import { useCallback, useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

export type MotionPose = {
  yaw: number
  pitch: number
  distance: number
  panX: number
  panY: number
}

export const GALLERY_ZOOM_LIMITS = { min: 45, max: 300 } as const
const nearestZoomDistance = 4600 / GALLERY_ZOOM_LIMITS.max
const farthestZoomDistance = 4600 / GALLERY_ZOOM_LIMITS.min

export type GalleryMotion = {
  /** Stable object, updated in place by the active renderer's step call. */
  current: MotionPose
  step: (deltaSeconds: number) => MotionPose
  freeze: (point?: { x: number; y: number }) => void
}

type Options = {
  region: RefObject<HTMLDivElement | null>
  active: boolean
  animate: boolean
  blocked: boolean
  hovered: string | null
  reduced: boolean
  visible: boolean
  action: { type: 'reset' | 'in' | 'out' | 'resume'; id: number }
  onStart: () => void
  onZoom: (value: number) => void
}

type Point = { x: number; y: number }
type Offset = Omit<MotionPose, 'distance'>
type Drag = { id: number; start: Point; origin: MotionPose; moved: boolean }
type State = {
  current: MotionPose
  base: MotionPose
  target: MotionPose
  follow: Offset
  drift: Offset
  anchor: Point
  lastPointer: Point
  lastClient: Point | null
  drag: Drag | null
  awaitPointer: boolean
  actionActive: boolean
  autoActive: boolean
  elapsed: number
  lastAction: number
  lastZoom: number
  navigationUntil: number
}

const rest = (): MotionPose => ({ yaw: 0, pitch: 0, distance: 46, panX: 0, panY: 0 })
const zero = (): Offset => ({ yaw: 0, pitch: 0, panX: 0, panY: 0 })
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const keys: (keyof MotionPose)[] = ['yaw', 'pitch', 'distance', 'panX', 'panY']

function compose(state: State) {
  const { base, follow, drift, target } = state
  target.yaw = clamp(base.yaw + follow.yaw + drift.yaw, -.55, .55)
  target.pitch = clamp(base.pitch + follow.pitch + drift.pitch, -.28, .28)
  target.distance = clamp(base.distance, nearestZoomDistance, farthestZoomDistance)
  target.panX = clamp(base.panX + follow.panX + drift.panX, -4.4, 4.4)
  target.panY = clamp(base.panY + follow.panY + drift.panY, -2.4, 2.4)
}

/** Discard every damping tail without changing the rendered pose. */
function settle(state: State, awaitPointer: boolean) {
  Object.assign(state.base, state.current)
  Object.assign(state.target, state.current)
  Object.assign(state.follow, zero())
  Object.assign(state.drift, zero())
  state.anchor = { ...state.lastPointer }
  state.elapsed = 0
  state.autoActive = false
  state.awaitPointer = awaitPointer
  state.actionActive = false
  state.navigationUntil = 0
}

// A gesture owns the camera until input stops and its damping tail finishes.
// Crossing a card must not discard a pending turn or zoom target.
function isNavigating(state: State) {
  return !!state.drag || state.actionActive || (state.navigationUntil > 0 && (
    performance.now() < state.navigationUntil || keys.some(key =>
      Math.abs(state.target[key] - state.current[key]) > (key === 'distance' ? .002 : .0001))
  ))
}

function normalized(node: HTMLElement, point: Point): Point {
  const rect = node.getBoundingClientRect()
  return {
    x: clamp((point.x - rect.left) / Math.max(rect.width, 1) * 2 - 1, -1, 1),
    y: clamp(1 - (point.y - rect.top) / Math.max(rect.height, 1) * 2, -1, 1),
  }
}

function isControl(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('button, a, input, select, textarea, [role="button"]')
}

/** One input owner and one damped pose for either projection renderer. */
export function useGalleryMotion(options: Options): GalleryMotion {
  const latest = useRef(options)
  latest.current = options
  const stateRef = useRef<State | null>(null)
  if (!stateRef.current) stateRef.current = {
    current: rest(), base: rest(), target: rest(), follow: zero(), drift: zero(),
    anchor: { x: 0, y: 0 }, lastPointer: { x: 0, y: 0 }, lastClient: null,
    drag: null, awaitPointer: false, actionActive: false, autoActive: false,
    elapsed: 0, lastAction: options.action.id, lastZoom: NaN, navigationUntil: 0,
  }
  const state = stateRef.current
  const binding = useRef<{ node: HTMLDivElement; remove: () => void } | null>(null)
  const previous = useRef<{ hovered: string | null | undefined; reduced: boolean }>({ hovered: undefined, reduced: options.reduced })

  const releaseDrag = useCallback(() => {
    const current = stateRef.current!
    const id = current.drag?.id
    current.drag = null
    if (id !== undefined && binding.current?.node.hasPointerCapture(id)) {
      try { binding.current.node.releasePointerCapture(id) } catch { /* Already released by the browser. */ }
    }
  }, [])

  const freeze = useCallback((point?: Point) => {
    const current = stateRef.current!
    if (point && binding.current?.node) {
      current.lastPointer = normalized(binding.current.node, point)
      current.lastClient = { ...point }
    }
    settle(current, true)
    releaseDrag()
  }, [releaseDrag])

  const reportZoom = useCallback(() => {
    const current = stateRef.current!
    const zoom = Math.round(4600 / current.current.distance)
    if (zoom !== current.lastZoom) { current.lastZoom = zoom; latest.current.onZoom(zoom) }
  }, [])

  const step = useCallback((deltaSeconds: number) => {
    const current = stateRef.current!, config = latest.current
    if (!config.active || config.blocked || !config.visible || document.hidden) {
      settle(current, current.awaitPointer)
      releaseDrag()
      return current.current
    }
    if (config.hovered !== null && !isNavigating(current)) {
      settle(current, true)
      releaseDrag()
      return current.current
    }
    if (current.awaitPointer && !isNavigating(current)) {
      // Hover and pointer-leave freezes must not silently stop enabled auto motion.
      // Manual interactions turn animate off and therefore keep their frozen pose.
      if (config.animate && !config.reduced) current.awaitPointer = false
      else return current.current
    }

    const delta = clamp(Number.isFinite(deltaSeconds) ? deltaSeconds : 0, 0, .1)
    const auto = config.animate && !config.reduced && !current.drag && !current.actionActive
    if (auto) {
      current.elapsed += delta
      current.drift.yaw = Math.sin(current.elapsed * .32) * .12
      current.drift.pitch = Math.sin(current.elapsed * .23) * .025
      current.drift.panX = Math.sin(current.elapsed * .27) * .35
      current.drift.panY = Math.sin(current.elapsed * .19) * .12
    } else if (current.autoActive) {
      // Pausing the ambient movement must not pull the camera back to its origin.
      current.base.yaw += current.drift.yaw
      current.base.pitch += current.drift.pitch
      current.base.panX += current.drift.panX
      current.base.panY += current.drift.panY
      Object.assign(current.drift, zero())
      current.elapsed = 0
    }
    current.autoActive = auto
    compose(current)
    const alpha = config.reduced ? 1 : 1 - Math.exp(-9 * delta)
    let settled = true
    for (const key of keys) {
      const difference = current.target[key] - current.current[key]
      current.current[key] += difference * alpha
      if (Math.abs(difference) > (key === 'distance' ? .002 : .0001)) settled = false
    }
    if (current.actionActive && settled) {
      Object.assign(current.current, current.target)
      current.actionActive = false
      current.awaitPointer = latest.current.hovered !== null
    }
    reportZoom()
    return current.current
  }, [releaseDrag, reportZoom])

  const bind = useCallback((node: HTMLDivElement) => {
    const usable = () => {
      const config = latest.current
      return config.active && !config.blocked && config.visible && !document.hidden
    }
    const commitManual = () => {
      const current = stateRef.current!
      compose(current)
      if (latest.current.reduced) { Object.assign(current.current, current.target); reportZoom() }
    }
    const point = (event: PointerEvent): Point => ({ x: event.clientX, y: event.clientY })

    const down = (event: PointerEvent) => {
      const current = stateRef.current!
      if (!usable() || isControl(event.target) || current.drag || event.button !== 0) return
      const position = point(event)
      current.lastPointer = normalized(node, position)
      current.lastClient = position
      settle(current, false)
      current.drag = { id: event.pointerId, start: position, origin: { ...current.current }, moved: false }
      try { node.setPointerCapture(event.pointerId) } catch { /* Capture is optional for synthetic input. */ }
    }

    const move = (event: PointerEvent) => {
      const current = stateRef.current!
      if (!usable()) return
      const position = point(event), sample = normalized(node, position)
      const small = node.clientWidth <= 760
      if (current.drag?.id === event.pointerId) {
        const drag = current.drag
        const dx = position.x - drag.start.x, dy = position.y - drag.start.y
        if (!drag.moved && Math.hypot(dx, dy) < 3) return
        if (!drag.moved) { drag.moved = true; latest.current.onStart() }
        const strength = small ? .72 : 1
        current.base.yaw = clamp(drag.origin.yaw - dx * .0016 * strength, -.55, .55)
        current.base.pitch = clamp(drag.origin.pitch + dy * .0012 * strength, -.28, .28)
        current.awaitPointer = false
        current.lastPointer = sample
        current.lastClient = position
        event.preventDefault()
        commitManual()
        return
      }
      if (current.drag || event.buttons !== 0 || event.pointerType === 'touch') return
      if (current.lastClient && position.x === current.lastClient.x && position.y === current.lastClient.y) return
      current.lastClient = position
      const overCard = event.target instanceof Element && !!event.target.closest('.space-card')
      // Wheel zoom keeps its target even when the pointer moves across a card.
      if (current.actionActive) return
      if ((latest.current.hovered !== null || isControl(event.target)) && !(overCard && isNavigating(current))) {
        current.lastPointer = sample
        settle(current, true)
        return
      }
      if (latest.current.reduced) {
        current.lastPointer = sample
        current.anchor = sample
        return
      }
      // A hover/panel freeze holds until this actual movement, without recentering.
      current.awaitPointer = false
      current.actionActive = false
      current.navigationUntil = performance.now() + 250
      current.lastPointer = sample
      const strength = small ? .55 : 1
      const dx = sample.x - current.anchor.x, dy = sample.y - current.anchor.y
      current.follow.yaw = dx * .16 * strength
      current.follow.pitch = dy * .07 * strength
      current.follow.panX = dx * 2.2 * strength
      current.follow.panY = dy * 1 * strength
    }

    const up = (event: PointerEvent) => {
      const current = stateRef.current!
      if (current.drag?.id !== event.pointerId) return
      const position = point(event)
      current.lastPointer = normalized(node, position)
      current.anchor = { ...current.lastPointer }
      current.lastClient = position
      current.navigationUntil = performance.now() + 250
      releaseDrag()
    }
    const cancel = (event: PointerEvent) => { if (stateRef.current!.drag?.id === event.pointerId) freeze() }
    const leave = () => { if (!stateRef.current!.drag) freeze() }
    const wheel = (event: WheelEvent) => {
      const overCard = event.target instanceof Element && !!event.target.closest('.space-card')
      if (!usable() || (isControl(event.target) && !overCard)) return
      event.preventDefault()
      const current = stateRef.current!
      const pendingDistance = current.actionActive ? current.target.distance : current.base.distance
      settle(current, false)
      releaseDrag()
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1
      current.base.distance = clamp(pendingDistance * Math.exp(clamp(event.deltaY * units, -400, 400) * .00085), nearestZoomDistance, farthestZoomDistance)
      current.actionActive = true
      latest.current.onStart()
      commitManual()
    }

    node.addEventListener('pointerdown', down)
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerup', up)
    node.addEventListener('pointercancel', cancel)
    node.addEventListener('lostpointercapture', cancel)
    node.addEventListener('pointerleave', leave)
    node.addEventListener('wheel', wheel, { passive: false })
    return () => {
      releaseDrag()
      node.removeEventListener('pointerdown', down)
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerup', up)
      node.removeEventListener('pointercancel', cancel)
      node.removeEventListener('lostpointercapture', cancel)
      node.removeEventListener('pointerleave', leave)
      node.removeEventListener('wheel', wheel)
    }
  }, [freeze, releaseDrag, reportZoom])

  // Ref targets may change when the grid/space view mounts a different region.
  // Compare actual nodes after each commit instead of rebinding on every frame.
  useLayoutEffect(() => {
    const node = options.active ? options.region.current : null
    if (node !== binding.current?.node) {
      binding.current?.remove()
      binding.current = node ? { node, remove: bind(node) } : null
    }
    const unavailable = !options.active || options.blocked || !options.visible || document.hidden
    if (unavailable) { settle(state, state.awaitPointer); releaseDrag() }
    else if (options.hovered !== null && options.hovered !== previous.current.hovered && !isNavigating(state)) freeze()
    if (options.reduced && !previous.current.reduced) settle(state, state.awaitPointer)
    previous.current = { hovered: options.hovered, reduced: options.reduced }

    if (options.action.id !== state.lastAction) {
      state.lastAction = options.action.id
      if (unavailable && options.action.type !== 'reset') return
      if (options.action.type === 'resume') {
        settle(state, false)
        releaseDrag()
        state.awaitPointer = false
        state.actionActive = false
        return
      }
      const previousDistance = state.actionActive ? state.target.distance : state.current.distance
      settle(state, options.hovered !== null)
      releaseDrag()
      if (options.action.type === 'reset') Object.assign(state.base, rest())
      else state.base.distance = clamp(previousDistance * (options.action.type === 'in' ? .9 : 1.1), nearestZoomDistance, farthestZoomDistance)
      compose(state)
      state.actionActive = true
      // Reset the camera before replaying the entrance, whose renderer is blocked.
      if (options.reduced || (unavailable && options.action.type === 'reset')) {
        Object.assign(state.current, state.target)
        state.actionActive = false
        reportZoom()
      }
    }
  })

  useLayoutEffect(() => () => { binding.current?.remove(); binding.current = null }, [])

  const result = useRef<GalleryMotion | null>(null)
  if (!result.current) result.current = { current: state.current, step, freeze }
  return result.current
}
