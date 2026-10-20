import { useCallback, useLayoutEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react'
import * as THREE from 'three'
import type { GalleryMotion } from './gallery-motion'

type Point = { x: number; y: number }
type CardPointerEvent = ReactPointerEvent<HTMLButtonElement>
type Session = {
  cardId: string
  pointerId: number
  pointerType: string
  node: HTMLButtonElement
  start: Point
  last: Point
  initialOffset: Point
  width: number
  height: number
  moved: boolean
}
type Options = {
  region: RefObject<HTMLDivElement | null>
  enabled: boolean
  motion: GalleryMotion
  onStart: () => void
  onDragChange: (id: string | null) => void
  onHover: (id: string | null) => void
}

export type GalleryCardDrag = {
  readonly heldId: string | null
  readonly draggingId: string | null
  applyPosition: (id: string, base: THREE.Vector3, camera: THREE.Camera, target: THREE.Vector3) => THREE.Vector3
  pointerDown: (id: string, event: CardPointerEvent) => void
  pointerMove: (id: string, event: CardPointerEvent) => void
  pointerUp: (id: string, event: CardPointerEvent) => void
  pointerCancel: (id: string, event: CardPointerEvent) => void
  shouldOpen: (id: string, event: ReactMouseEvent<HTMLButtonElement>) => boolean
  cancel: () => void
  reset: () => void
}

const DRAG_THRESHOLD = 7

/** Session-local screen offsets survive renderer, grid, and activity-panel changes. */
export function useGalleryCardDrag(options: Options): GalleryCardDrag {
  const latest = useRef(options)
  latest.current = options
  const offsets = useRef(new Map<string, Point>())
  const session = useRef<Session | null>(null)
  const suppressedClicks = useRef(new Set<string>())

  const finish = useCallback((cancelled: boolean, point?: Point, notify = true) => {
    const held = session.current
    if (!held) return
    // Clear first: releasing capture also dispatches lostpointercapture.
    session.current = null
    if (held.moved || cancelled) suppressedClicks.current.add(held.cardId)
    held.node.removeAttribute('data-card-dragging')
    held.node.style.removeProperty('--card-drag-transform')
    if (held.node.hasPointerCapture(held.pointerId)) {
      try { held.node.releasePointerCapture(held.pointerId) } catch { /* Capture was already released. */ }
    }
    const end = point ?? held.last
    latest.current.motion.freeze(end)
    if (!notify) return
    if (held.moved) latest.current.onDragChange(null)
    const rect = held.node.getBoundingClientRect()
    const overCard = end.x >= rect.left && end.x <= rect.right && end.y >= rect.top && end.y <= rect.bottom
    latest.current.onHover(!cancelled && held.pointerType !== 'touch' && overCard ? held.cardId : null)
  }, [])

  const cancel = useCallback(() => finish(true), [finish])

  const pointerDown = useCallback((id: string, event: CardPointerEvent) => {
    event.stopPropagation()
    if (!latest.current.enabled || event.button !== 0 || !event.isPrimary || session.current) return
    const node = latest.current.region.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const point = { x: event.clientX, y: event.clientY }
    suppressedClicks.current.delete(id)
    latest.current.motion.freeze(point)
    latest.current.onHover(id)
    session.current = {
      cardId: id, pointerId: event.pointerId, pointerType: event.pointerType,
      node: event.currentTarget, start: point, last: point,
      initialOffset: { ...(offsets.current.get(id) ?? { x: 0, y: 0 }) },
      width: rect.width, height: rect.height, moved: false,
    }
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* Window release handlers still clean up. */ }
  }, [])

  const pointerMove = useCallback((id: string, event: CardPointerEvent) => {
    const held = session.current
    if (!held || held.cardId !== id || held.pointerId !== event.pointerId) return
    event.stopPropagation()
    const point = { x: event.clientX, y: event.clientY }
    held.last = point
    if (!latest.current.enabled || (event.pointerType !== 'touch' && !(event.buttons & 1))) {
      finish(true, point)
      return
    }
    const dx = point.x - held.start.x, dy = point.y - held.start.y
    if (!held.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    if (!held.moved) {
      held.moved = true
      suppressedClicks.current.add(id)
      // Hold the current hover lift while dragging, without changing cover geometry.
      held.node.style.setProperty('--card-drag-transform', getComputedStyle(held.node).transform)
      held.node.setAttribute('data-card-dragging', 'true')
      latest.current.onStart()
      latest.current.onDragChange(id)
    }
    event.preventDefault()
    latest.current.motion.freeze(point)
    offsets.current.set(id, {
      x: held.initialOffset.x + dx / held.width,
      y: held.initialOffset.y + dy / held.height,
    })
  }, [finish])

  const pointerUp = useCallback((id: string, event: CardPointerEvent) => {
    const held = session.current
    if (!held || held.cardId !== id || held.pointerId !== event.pointerId) return
    event.stopPropagation()
    if (held.moved) event.preventDefault()
    finish(false, { x: event.clientX, y: event.clientY })
  }, [finish])

  const pointerCancel = useCallback((id: string, event: CardPointerEvent) => {
    const held = session.current
    if (!held || held.cardId !== id || held.pointerId !== event.pointerId) return
    event.stopPropagation()
    // lostpointercapture may have zero coordinates; retain the last real pointer sample.
    finish(true)
  }, [finish])

  const shouldOpen = useCallback((id: string, event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!latest.current.enabled) return false
    if (event.detail === 0) { cancel(); return true }
    if (suppressedClicks.current.delete(id)) return false
    return !session.current
  }, [cancel])

  const applyPosition = useCallback((id: string, base: THREE.Vector3, camera: THREE.Camera, target: THREE.Vector3) => {
    target.copy(base)
    const offset = offsets.current.get(id)
    if (!offset || (!offset.x && !offset.y)) return target
    // Preserve camera-space depth. Unprojection includes the current view basis and
    // lens zoom, so both renderers keep the same size and screen-pixel displacement.
    target.project(camera)
    target.x += offset.x * 2
    target.y -= offset.y * 2
    return target.unproject(camera)
  }, [])

  const reset = useCallback(() => { cancel(); offsets.current.clear() }, [cancel])

  useLayoutEffect(() => { if (!options.enabled) cancel() }, [options.enabled, cancel])
  useLayoutEffect(() => {
    const release = (event: PointerEvent) => {
      if (session.current?.pointerId === event.pointerId) finish(true, { x: event.clientX, y: event.clientY })
    }
    const hide = () => { if (document.hidden) cancel() }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', cancel)
    window.addEventListener('resize', cancel)
    document.addEventListener('visibilitychange', hide)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', cancel)
      window.removeEventListener('resize', cancel)
      document.removeEventListener('visibilitychange', hide)
      finish(true, undefined, false)
    }
  }, [cancel, finish])

  const api = useRef<GalleryCardDrag | null>(null)
  if (!api.current) api.current = {
    get heldId() { return session.current?.cardId ?? null },
    get draggingId() { return session.current?.moved ? session.current.cardId : null },
    applyPosition, pointerDown, pointerMove, pointerUp, pointerCancel, shouldOpen, cancel, reset,
  }
  return api.current
}
