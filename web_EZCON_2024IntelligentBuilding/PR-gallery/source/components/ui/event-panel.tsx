"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, Maximize2, Minimize2, X } from 'lucide-react'
import type { GalleryEvent } from '@/src/data/schneider-event'
import '@/src/event-panel.css'

export type EventPanelRect = { left: number; top: number; width: number; height: number }
type EventPanelPhase = 'closed' | 'entering' | 'open' | 'closing'
type EventPhoto = GalleryEvent['photos'][number]

export type EventPanelProps = {
  event: GalleryEvent | null
  origin: EventPanelRect | null
  reduced: boolean
  onClosed: () => void
  onClosing?: () => void
  getReturnRect?: () => EventPanelRect | null
}

const EASE = 'cubic-bezier(.76, 0, .24, 1)'
const ENTER_DURATION = 850
const EXIT_DURATION = 720

function usableRect(rect: EventPanelRect | null | undefined): rect is EventPanelRect {
  return !!rect && [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
    rect.width > 1 && rect.height > 1
}

function rectStyles(rect: EventPanelRect): Record<string, string> {
  return { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
}

function PhotoImage({ photo, thumbnail = false, eager = false }: { photo: EventPhoto; thumbnail?: boolean; eager?: boolean }) {
  const sources = useMemo(() => Array.from(new Set((thumbnail
    ? [photo.thumbnailUrl, photo.imageUrl, photo.originalUrl]
    : [photo.imageUrl, photo.originalUrl, photo.thumbnailUrl]
  ).filter(Boolean))), [photo.thumbnailUrl, photo.imageUrl, photo.originalUrl, thumbnail])
  const [sourceIndex, setSourceIndex] = useState(0)
  const [ready, setReady] = useState(false)

  if (sourceIndex >= sources.length) return <div className="event-panel-image-fallback" role={thumbnail ? undefined : 'img'} aria-label={thumbnail ? undefined : photo.alt} aria-hidden={thumbnail || undefined}>
    <ImageOff size={thumbnail ? 20 : 30} aria-hidden="true" />
    {!thumbnail && <span>照片暫時無法載入</span>}
  </div>

  return <div className={`event-panel-image-stack${ready ? ' is-ready' : ''}`}>
    {!thumbnail && photo.thumbnailUrl && <img className="event-panel-image-preview" src={photo.thumbnailUrl} alt="" aria-hidden="true" draggable={false} decoding="async" />}
    <img
      className="event-panel-image"
      src={sources[sourceIndex]}
      alt={thumbnail ? '' : photo.alt}
      width={photo.width}
      height={photo.height}
      loading={thumbnail && !eager ? 'lazy' : 'eager'}
      decoding="async"
      draggable={false}
      onLoad={() => setReady(true)}
      onError={() => { setReady(false); setSourceIndex(current => current + 1) }}
    />
  </div>
}

/**
 * Keep this component mounted with its event until onClosed fires. The image used
 * for the transition is our own DOM clone: the 3D card stays in its React tree.
 */
export function EventPanel(props: EventPanelProps) {
  const { event, origin, reduced } = props
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const mainFrame = useRef<HTMLDivElement>(null)
  const mainImage = useRef<HTMLDivElement>(null)
  const movingCover = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const thumbnails = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null)
  const [expanded, setExpanded] = useState(false)
  const phaseRef = useRef<EventPanelPhase>('closed')
  const openingRect = useRef<EventPanelRect | null>(null)
  const motions = useRef(new Set<Animation>())
  const frames = useRef(new Set<number>())
  const generation = useRef(0)
  const latest = useRef(props)
  latest.current = props
  const [phase, setPhase] = useState<EventPanelPhase>('closed')
  const [photoIndex, setPhotoIndex] = useState(0)
  const photoIndexRef = useRef(0)
  photoIndexRef.current = photoIndex
  const pointerOnBackdrop = useRef(false)
  const headingId = useId()
  const storyHeadingId = useId()
  const reportsHeadingId = useId()
  const count = event?.photos.length ?? 0
  const index = Math.min(photoIndex, Math.max(0, count - 1))
  const photo = event?.photos[index]
  const cover = event?.photos[0]

  const updatePhase = useCallback((next: EventPanelPhase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const cancelMotion = useCallback(() => {
    generation.current += 1
    frames.current.forEach(frame => cancelAnimationFrame(frame))
    frames.current.clear()
    motions.current.forEach(animation => animation.cancel())
    motions.current.clear()
  }, [])

  const nextFrame = useCallback((callback: () => void) => {
    const frame = requestAnimationFrame(() => {
      frames.current.delete(frame)
      callback()
    })
    frames.current.add(frame)
  }, [])

  const animate = useCallback((node: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = node.animate(keyframes, { fill: 'both', ...options })
    motions.current.add(animation)
    return animation
  }, [])

  const finishClose = useCallback(() => {
    cancelMotion()
    updatePhase('closed')
    if (movingCover.current) movingCover.current.style.visibility = 'hidden'
    if (dialog.current?.open) dialog.current.close()
    latest.current.onClosed()
  }, [cancelMotion, updatePhase])

  const closePanel = useCallback(() => {
    if (phaseRef.current === 'closed' || phaseRef.current === 'closing') return
    const currentPanel = panel.current
    const currentScrim = scrim.current
    const clone = movingCover.current
    const currentCover = latest.current.event?.photos[0]
    const frame = mainFrame.current
    if (!currentPanel || !currentScrim) return finishClose()

    // Capture an interrupted entry before cancelling it; closing remains smooth
    // even when Escape is pressed before the first transition has finished.
    const panelTransform = getComputedStyle(currentPanel).transform
    const scrimOpacity = getComputedStyle(currentScrim).opacity
    const cloneWasVisible = !!clone && clone.style.visibility === 'visible'
    const fromRect = cloneWasVisible && clone
      ? clone.getBoundingClientRect()
      : currentCover && frame ? frame.getBoundingClientRect() : null
    cancelMotion()
    updatePhase('closing')
    latest.current.onClosing?.()

    if (latest.current.reduced || typeof currentPanel.animate !== 'function') return finishClose()

    const ticket = generation.current
    nextFrame(() => {
      if (ticket !== generation.current || phaseRef.current !== 'closing') return
      // A supplied callback returning null means the opener no longer exists.
      // Only use the saved origin when no live return-rectangle hook is supplied.
      const returnRectHook = latest.current.getReturnRect
      const requestedReturn = returnRectHook ? returnRectHook() : openingRect.current
      const toRect = usableRect(requestedReturn) ? requestedReturn : null
      const flightVisible = !!fromRect && fromRect.top + fromRect.height > 64 && fromRect.top < window.innerHeight - 24
      const canFly = !!clone && !!currentCover && usableRect(fromRect) && usableRect(toRect) && flightVisible
      const crossfade = photoIndexRef.current !== 0 && !cloneWasVisible
      const exitAnimations: Animation[] = [
        animate(currentPanel, [{ transform: panelTransform === 'none' ? 'translateX(0)' : panelTransform }, { transform: 'translateX(104%)' }], { duration: EXIT_DURATION, easing: EASE }),
        animate(currentScrim, [{ opacity: scrimOpacity }, { opacity: 0 }], { duration: EXIT_DURATION, easing: 'ease-in-out' }),
      ]

      if (canFly) {
        Object.assign(clone.style, rectStyles(fromRect), { visibility: 'visible', opacity: '1' })
        if (crossfade) {
          exitAnimations.push(animate(clone, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: 'ease-out' }))
        }
        if (mainImage.current) {
          exitAnimations.push(animate(mainImage.current, [{ opacity: 1 }, { opacity: 0 }], { duration: crossfade ? 140 : 1 }))
        }
        exitAnimations.push(animate(clone, [
          { ...rectStyles(fromRect), borderRadius: '2px', boxShadow: '0 16px 38px #00000018' },
          { ...rectStyles(toRect), borderRadius: '5px', boxShadow: '0 0 0 #0000' },
        ], { duration: EXIT_DURATION - (crossfade ? 110 : 0), delay: crossfade ? 110 : 0, easing: EASE }))
      } else if (clone) {
        clone.style.visibility = 'hidden'
      }

      void Promise.allSettled(exitAnimations.map(animation => animation.finished)).then(() => {
        if (ticket === generation.current && phaseRef.current === 'closing') finishClose()
      })
    })
  }, [animate, cancelMotion, finishClose, nextFrame, updatePhase])

  useLayoutEffect(() => {
    const node = dialog.current
    const currentPanel = panel.current
    const currentScrim = scrim.current
    if (!event || !node || !currentPanel || !currentScrim) return

    cancelMotion()
    openingRect.current = usableRect(origin) ? { ...origin } : null
    photoIndexRef.current = 0
    setPhotoIndex(0)
    setExpanded(false)
    updatePhase('entering')
    if (scroller.current) scroller.current.scrollTop = 0
    if (movingCover.current) movingCover.current.style.visibility = 'hidden'
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!node.open) node.showModal()
    closeButton.current?.focus({ preventScroll: true })

    if (reduced || typeof currentPanel.animate !== 'function') {
      updatePhase('open')
    } else {
      const ticket = generation.current
      nextFrame(() => {
        if (ticket !== generation.current || phaseRef.current !== 'entering') return
        const clone = movingCover.current
        const frame = mainFrame.current
        const coverPhoto = event.photos[0]
        // Both images cover their frames, so the flight ends at the full frame.
        // Measure the final layout before animating the panel out of position.
        const target = coverPhoto && frame ? frame.getBoundingClientRect() : null
        const canFly = !!clone && usableRect(openingRect.current) && usableRect(target)
        const entryAnimations: Animation[] = [
          animate(currentPanel, [{ transform: 'translateX(104%)' }, { transform: 'translateX(0)' }], { duration: ENTER_DURATION, easing: EASE }),
          animate(currentScrim, [{ opacity: 0 }, { opacity: 1 }], { duration: ENTER_DURATION, easing: 'ease-out' }),
        ]

        currentPanel.querySelectorAll<HTMLElement>('[data-panel-reveal]').forEach((element, revealIndex) => {
          entryAnimations.push(animate(element, [
            { opacity: 0, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 490, delay: 220 + Math.min(revealIndex, 3) * 55, easing: 'cubic-bezier(.2, .6, .2, 1)' }))
        })

        if (canFly) {
          Object.assign(clone.style, rectStyles(openingRect.current!), { visibility: 'visible', opacity: '1' })
          entryAnimations.push(animate(clone, [
            { ...rectStyles(openingRect.current!), borderRadius: '5px', boxShadow: '0 0 0 #0000' },
            { ...rectStyles(target), borderRadius: '2px', boxShadow: '0 16px 38px #00000018' },
          ], { duration: ENTER_DURATION, easing: EASE }))
        } else if (mainImage.current) {
          entryAnimations.push(animate(mainImage.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 330, easing: 'ease-out' }))
        }

        void Promise.allSettled(entryAnimations.map(animation => animation.finished)).then(() => {
          if (ticket !== generation.current || phaseRef.current !== 'entering') return
          updatePhase('open')
          nextFrame(() => {
            if (ticket !== generation.current || phaseRef.current !== 'open') return
            if (clone) clone.style.visibility = 'hidden'
            motions.current.forEach(animation => animation.cancel())
            motions.current.clear()
          })
        })
      })
    }

    const handleResize = () => {
      // A resize changes both coordinate spaces. Settle the current transition
      // rather than finish at a stale point outside the resized photo frame.
      if (phaseRef.current === 'entering') {
        cancelMotion()
        if (movingCover.current) movingCover.current.style.visibility = 'hidden'
        updatePhase('open')
      } else if (phaseRef.current === 'closing') {
        finishClose()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelMotion()
      phaseRef.current = 'closed'
      if (movingCover.current) movingCover.current.style.visibility = 'hidden'
      if (node.open) node.close()
      if (document.body.style.overflow === 'hidden') document.body.style.overflow = previousOverflow
    }
    // A new event starts a new dialog session. Photo changes leave the existing
    // dialog, focus, and scroll position alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, animate, cancelMotion, finishClose, nextFrame, updatePhase])

  useLayoutEffect(() => {
    const viewport = scroller.current
    const heading = viewport?.querySelector<HTMLElement>('.event-panel-heading')
    const caption = viewport?.querySelector<HTMLElement>('.event-panel-caption')
    const strip = viewport?.querySelector<HTMLElement>('.event-album-thumbnails')
    if (!event || !viewport || !heading || !caption || !strip) return
    const margin = (node: HTMLElement, side: 'marginTop' | 'marginBottom') => parseFloat(getComputedStyle(node)[side]) || 0
    const fitPhoto = () => {
      // Reserve the actual wrapped heading, caption and filmstrip before sizing
      // the photograph. offsetTop is unaffected by the entry reveal animation.
      const reserved = heading.offsetTop + heading.offsetHeight + margin(heading, 'marginBottom')
        + caption.offsetHeight + margin(caption, 'marginTop') + margin(caption, 'marginBottom')
        + strip.offsetHeight + margin(strip, 'marginTop') + margin(strip, 'marginBottom') + 16
      viewport.style.setProperty('--album-photo-max-height', `${Math.max(48, Math.min(640, viewport.clientHeight - reserved))}px`)
    }
    fitPhoto()
    const observer = new ResizeObserver(fitPhoto)
    ;[viewport, heading, caption, strip].forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [event?.id])

  const movePhoto = (direction: number) => {
    if (phaseRef.current !== 'open' || count < 2) return
    setPhotoIndex(current => (current + direction + count) % count)
  }

  useEffect(() => {
    const strip = thumbnails.current
    const active = strip?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!strip || !active) return
    const stripRect = strip.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    if (activeRect.left < stripRect.left || activeRect.right > stripRect.right) {
      strip.scrollTo({ left: strip.scrollLeft + activeRect.left - stripRect.left - (strip.clientWidth - activeRect.width) / 2, behavior: reduced ? 'instant' : 'smooth' })
    }
  }, [index, event?.id, reduced])

  const selectPhoto = (next: number) => {
    if (phaseRef.current === 'open') setPhotoIndex(next)
  }

  const handleKeyDown = (keyboardEvent: KeyboardEvent<HTMLDialogElement>) => {
    if (keyboardEvent.altKey || keyboardEvent.ctrlKey || keyboardEvent.metaKey) return
    if (keyboardEvent.key === 'Escape' && expanded) {
      keyboardEvent.preventDefault(); keyboardEvent.stopPropagation(); setExpanded(false); return
    }
    const target = keyboardEvent.target
    if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
    if (keyboardEvent.key === 'ArrowLeft' || keyboardEvent.key === 'ArrowRight') {
      keyboardEvent.preventDefault()
      keyboardEvent.stopPropagation()
      movePhoto(keyboardEvent.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  if (!event) return null
  // Optional editorial fields are compatible with events from the first pilot.
  const editorialEvent = event as GalleryEvent & { shortTitle?: string; category?: string }
  const storyParagraphs = event.paragraphs.join('').length <= 300
    ? [event.paragraphs.join('')]
    : event.paragraphs

  return <dialog
    ref={dialog}
    className={`event-panel-dialog${expanded ? ' is-photo-expanded' : ''}`}
    data-event-phase={phase}
    data-photo-index={index}
    aria-labelledby={headingId}
    onKeyDown={handleKeyDown}
    onCancel={cancelEvent => { cancelEvent.preventDefault(); if (expanded) setExpanded(false); else closePanel() }}
    onClose={() => {
      // A queued native close from cleanup must not dismiss a newer session.
      if (dialog.current?.open || phaseRef.current === 'closed') return
      finishClose()
    }}
    onPointerDown={pointerEvent => {
      pointerOnBackdrop.current = pointerEvent.target === scrim.current || pointerEvent.target === pointerEvent.currentTarget
    }}
    onClick={clickEvent => {
      if (pointerOnBackdrop.current && (clickEvent.target === scrim.current || clickEvent.target === clickEvent.currentTarget)) closePanel()
      pointerOnBackdrop.current = false
    }}
  >
    <div ref={scrim} className="event-panel-scrim" aria-hidden="true" />
    <aside ref={panel} className="event-panel-sheet" aria-label="活動照片與介紹">
      <div className="event-panel-topbar">
        <span className="event-panel-topbar-label"><span className="event-panel-mark" aria-hidden="true">✦</span> EVENT JOURNAL</span>
        <div className="event-panel-topbar-actions">
          <button ref={closeButton} type="button" className="event-panel-close" onClick={closePanel} aria-label="關閉活動，返回活動總覽" autoFocus><span>返回活動總覽</span><X size={20} aria-hidden="true" /></button>
        </div>
      </div>

      <div ref={scroller} className="event-panel-scroll">
        <header className="event-panel-heading" data-panel-reveal>
          <div className="event-panel-kicker">{event.year && <span>{event.year}</span>}<span>{editorialEvent.category || '活動紀錄'}</span><span className="event-panel-kicker-count">{String(count).padStart(2, '0')} PHOTOS</span></div>
          <h2 id={headingId}>{event.title}</h2>
        </header>

        <figure className="event-panel-figure event-album-viewer">
          <div ref={mainFrame} className="event-panel-main-frame" style={{ aspectRatio: photo ? `${photo.width} / ${photo.height}` : '16 / 9', '--album-photo-ratio': photo ? photo.width / photo.height : 16 / 9 } as CSSProperties}
            onPointerDown={e => {
              if (e.pointerType === 'mouse' || !e.isPrimary || (e.target instanceof Element && e.target.closest('button'))) return
              swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerCancel={() => { swipe.current = null }}
            onPointerUp={e => {
              const start = swipe.current; swipe.current = null
              if (!start || start.id !== e.pointerId) return
              const dx = e.clientX - start.x, dy = e.clientY - start.y
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) movePhoto(dx < 0 ? 1 : -1)
            }}>
            <div ref={mainImage} className="event-panel-main-photo">
              {photo ? <PhotoImage key={photo.id} photo={photo} /> : <div className="event-panel-image-fallback"><ImageOff size={30} aria-hidden="true" /><span>目前沒有活動照片</span></div>}
            </div>
            <button type="button" className="event-album-expand" onClick={() => setExpanded(current => !current)} aria-label={expanded ? '退出照片放大' : '放大照片'} aria-pressed={expanded}>{expanded ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
            <div className="event-panel-photo-controls event-album-arrows">
              <button type="button" onClick={() => movePhoto(-1)} disabled={count < 2 || phase !== 'open'} aria-label="上一張照片" title="上一張照片（←）"><ChevronLeft size={22} /></button>
              <button type="button" onClick={() => movePhoto(1)} disabled={count < 2 || phase !== 'open'} aria-label="下一張照片" title="下一張照片（→）"><ChevronRight size={22} /></button>
            </div>
          </div>
          <figcaption className="event-panel-caption" data-panel-reveal>
            <span className="event-panel-photo-label">{photo?.title || '活動照片'}</span>
            <span className="event-panel-photo-count" aria-live="polite" aria-atomic="true">{String(count ? index + 1 : 0).padStart(2, '0')}<span> / {String(count).padStart(2, '0')}</span></span>
            <span className="event-album-hint"><span className="album-desktop-hint">← → 切換照片</span><span className="album-mobile-hint">左右滑動切換</span></span>
          </figcaption>
        </figure>

        <section className="event-album-thumbnails" aria-label="活動照片縮圖" data-panel-reveal>
          <div ref={thumbnails} className="event-album-filmstrip">
            {event.photos.map((item, photoNumber) => <button key={item.id} type="button"
              className={`event-panel-photo-tile${photoNumber === index ? ' is-selected' : ''}`}
              aria-label={`檢視第 ${photoNumber + 1} 張照片：${item.title}`} aria-pressed={photoNumber === index}
              disabled={phase !== 'open'} onClick={() => selectPhoto(photoNumber)}>
              <span className="event-panel-tile-image"><PhotoImage photo={item} thumbnail eager /></span>
              <span className="event-album-thumbnail-number" aria-hidden="true">{String(photoNumber + 1).padStart(2, '0')}</span>
            </button>)}
          </div>
        </section>

        <section className="event-panel-story event-album-story" aria-labelledby={storyHeadingId} data-panel-reveal>
          <h3 id={storyHeadingId}>活動介紹</h3>
          {storyParagraphs.map((paragraph, paragraphNumber) => <p key={`${event.id}-${paragraphNumber}`}>{paragraph}</p>)}
        </section>
        {!!event.reports?.length && <section className="event-album-reports" aria-labelledby={reportsHeadingId} data-panel-reveal>
          <h3 id={reportsHeadingId}>媒體報導</h3>
          <div className="event-album-report-links">{event.reports.map((report, reportIndex) => {
            const sameMedia = event.reports!.filter(item => item.media === report.media)
            const ordinal = event.reports!.slice(0, reportIndex + 1).filter(item => item.media === report.media).length
            const label = sameMedia.length > 1 ? `${report.media} ${ordinal}` : report.media
            return <a key={report.url} href={report.url} target="_blank" rel="noopener noreferrer" aria-label={`${label}：閱讀報導（另開分頁）`} className="event-album-report-pill">{label}<ArrowUpRight size={14} aria-hidden="true" /></a>
          })}</div>
        </section>}
        <div className="event-panel-endnote"><span>每一個相聚，都值得被記錄。</span><span>EZCON · EVENT JOURNAL</span></div>
      </div>
    </aside>
    <div ref={movingCover} className="event-panel-moving-cover" aria-hidden="true">{cover && <PhotoImage key={cover.id} photo={cover} thumbnail eager />}</div>
  </dialog>
}
