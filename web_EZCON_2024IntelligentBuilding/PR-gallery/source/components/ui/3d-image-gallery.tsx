"use client"

import { galleryBase, isSchneiderPage } from '@/src/site-paths'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowLeft, ArrowUpRight, LayoutGrid, Minus, MousePointer2, Orbit, Pause, Play, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { EventPanel, type EventPanelRect } from '@/components/ui/event-panel'
import { GalleryVideoBackground } from '@/components/ui/gallery-video-background'
import { galleryEvents } from '@/src/data/gallery-events'
import type { GalleryEvent } from '@/src/data/schneider-event'
import { getOrbitSlots } from '@/src/orbit-layout'
import { GALLERY_ZOOM_LIMITS, useGalleryMotion, type GalleryMotion } from '@/src/gallery-motion'
import { GALLERY_FOV, getCardGeometry, projectCard, setGalleryCamera } from '@/src/gallery-projection'
import { useGalleryCardDrag, type GalleryCardDrag } from '@/src/gallery-card-drag'

export type GalleryCard = {
  id: string; eventId: string; title: string; subtitle: string; alt: string
  imageUrl: string; thumbnailUrl?: string; originalUrl: string
  width: number; height: number; photoCount: number
}
type CameraAction = { type: 'reset' | 'in' | 'out' | 'resume'; id: number }
type ViewMode = 'space' | 'grid'
type OnSelect = (id: string, opener?: HTMLElement) => void
type SpatialCardsProps = {
  cards: GalleryCard[]; blocked: boolean; visible: boolean; entering: boolean
  selectedId: string | null; motion: GalleryMotion; cardDrag: GalleryCardDrag
  onSelect: OnSelect; onHover: (id: string | null) => void
}
const ENTRANCE_DELAY = 120
const ENTRANCE_STAGGER = 35
const ENTRANCE_DURATION = 1350

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function SafeImage({ card, eager = false }: { card: GalleryCard; eager?: boolean }) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const sources = useMemo(() => Array.from(new Set([card.thumbnailUrl, card.imageUrl, card.originalUrl].filter(Boolean))) as string[], [card])
  useEffect(() => setSourceIndex(0), [card.id])
  if (sourceIndex >= sources.length) return <div className="image-unavailable" role="img" aria-label={card.alt}><Sparkles /><span>圖片暫時無法載入</span></div>
  return <img src={sources[sourceIndex]} alt={card.alt} width={card.width} height={card.height} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} onError={() => setSourceIndex(current => current + 1)} />
}

function CardSurface({ card, index, cardDrag, onSelect, onHover, selected = false }: { card: GalleryCard; index: number; cardDrag: GalleryCardDrag; onSelect: OnSelect; onHover: (id: string | null) => void; selected?: boolean }) {
  return <button type="button" className={`space-card${selected ? ' card-is-open' : ''}`} aria-label={`開啟 ${card.title}，${card.photoCount} 張活動照片`} data-card-id={card.id} data-event-id={card.eventId}
    onPointerDown={event => cardDrag.pointerDown(card.id, event)} onPointerMove={event => cardDrag.pointerMove(card.id, event)}
    onPointerUp={event => cardDrag.pointerUp(card.id, event)} onPointerCancel={event => cardDrag.pointerCancel(card.id, event)} onLostPointerCapture={event => cardDrag.pointerCancel(card.id, event)}
    onClick={event => { event.stopPropagation(); if (!cardDrag.shouldOpen(card.id, event)) { event.preventDefault(); return }; onSelect(card.id, event.currentTarget) }}
    onPointerEnter={event => { if (event.pointerType !== 'touch' && !cardDrag.heldId) onHover(card.id) }} onPointerLeave={() => { if (!cardDrag.heldId) onHover(null) }} onFocus={() => { if (!cardDrag.heldId) onHover(card.id) }} onBlur={() => { if (!cardDrag.heldId) onHover(null) }}>
    <div className="card-image-wrap"><SafeImage card={card} eager /><span className="card-number">{String(index + 1).padStart(2, '0')}</span><span className="card-event-count">{card.photoCount} 張照片</span><span className="card-open"><ArrowUpRight size={15} /></span></div>
    <div className="card-caption"><span>{card.title}</span><span className="card-caption-dot" /></div>
  </button>
}

// Every browser uses this DOM layer with the same Three perspective projection.
function SpatialCards({ cards, blocked, visible, selectedId, motion, cardDrag, onSelect, onHover, entering }: SpatialCardsProps) {
  const region = useRef<HTMLDivElement>(null)
  const cardNodes = useRef<(HTMLDivElement | null)[]>([])
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const slots = useMemo(() => getOrbitSlots(cards.length, size.width, size.height), [cards.length, size])
  const geometry = useMemo(() => slots.map(slot => getCardGeometry(slot, size.width, Math.max(1, size.height))), [slots, size])
  useEffect(() => { const node = region.current; if (!node) return; const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height })); observer.observe(node); return () => observer.disconnect() }, [])
  useLayoutEffect(() => {
    if (entering) return
    const camera = new THREE.PerspectiveCamera(GALLERY_FOV, size.width / Math.max(1, size.height), .1, 500)
    const viewPoint = new THREE.Vector3(), screenPoint = new THREE.Vector3(), arrangedPosition = new THREE.Vector3()
    const render = (delta: number) => {
      setGalleryCamera(camera, motion.step(delta))
      geometry.forEach(({ position }, index) => {
        const node = cardNodes.current[index]; if (!node) return
        const slot = slots[index]
        cardDrag.applyPosition(cards[index].id, position, camera, arrangedPosition)
        const projected = projectCard(arrangedPosition, slot, camera, size.width, size.height, viewPoint, screenPoint)
        node.style.left = `${projected.x.toFixed(3)}px`
        node.style.top = `${projected.y.toFixed(3)}px`
        node.style.transform = `translate(-50%, -50%) scale(${projected.scale.toFixed(5)}) rotate(${slot.tilt}deg)`
        node.style.zIndex = cardDrag.draggingId === cards[index].id ? '3600' : String(Math.round(3000 - projected.depth * 20))
      })
    }
    render(0)
    if (blocked || !visible) return
    let frame = 0, previous = 0
    const tick = (now: number) => { render(previous ? Math.min((now - previous) / 1000, .04) : 0); previous = now; frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame)
  }, [motion, cardDrag, cards, slots, geometry, size, blocked, visible, entering])
  return <div className="orbit-fallback" ref={region} data-renderer="dom-perspective">
    <div className="orbit-fallback-depth" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {cards.map((card, index) => <div key={card.id} ref={node => { cardNodes.current[index] = node }} className="orbit-fallback-card" data-depth={slots[index].depth} style={{ left: `${slots[index].x * 100}%`, top: `${slots[index].y * 100}%`, pointerEvents: 'auto', zIndex: Math.round(2080 + slots[index].depth * 20), '--card-scale': slots[index].scale, '--card-tilt': `${slots[index].tilt}deg`, '--arrival-x': `${(.5 - slots[index].x) * size.width}px`, '--arrival-y': `${(.5 - slots[index].y) * size.height}px`, '--arrival-delay': `${ENTRANCE_DELAY + index * ENTRANCE_STAGGER}ms`, '--arrival-duration': `${ENTRANCE_DURATION}ms` } as React.CSSProperties}><CardSurface card={card} index={index} cardDrag={cardDrag} onSelect={onSelect} onHover={onHover} selected={selectedId === card.id} /></div>)}
    </div>
  </div>
}

export default function StellarCardGallery({ events = galleryEvents, initialEventId }: { events?: GalleryEvent[]; initialEventId?: string }) {
  const cards = useMemo<GalleryCard[]>(() => events.filter(event => event.photos.length).map(event => ({ ...event.photos[0], id: event.id, eventId: event.id, title: event.shortTitle || event.title, subtitle: [event.year, event.category || '活動紀錄'].filter(Boolean).join(' · '), photoCount: event.photos.length })), [events])
  const spaceCards = useMemo(() => cards.filter(card => !events.find(event => event.id === card.eventId)?.overviewOnly), [cards, events])
  const reduced = useReducedMotion()
  const entranceAt = useRef(performance.now())
  const [entranceRun, setEntranceRun] = useState(0)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [entering, setEntering] = useState(() => !mobile && !reduced && !initialEventId)
  const [view, setView] = useState<ViewMode>(() => mobile ? 'grid' : 'space'), [spinning, setSpinning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState<string | null>(null), [selectedId, setSelectedId] = useState<string | null>(initialEventId ?? null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<EventPanelRect | null>(null), [closing, setClosing] = useState(false)
  const [action, setAction] = useState<CameraAction>({ type: 'reset', id: 0 }), [zoom, setZoom] = useState(100)
  const [visible, setVisible] = useState(!document.hidden)
  const sceneRef = useRef<HTMLDivElement>(null), lastFocused = useRef<HTMLElement | null>(null), sourceImage = useRef<HTMLElement | null>(null)
  const selectedEvent = events.find(event => event.id === selectedId) ?? null
  const animated = spinning && visible && !reduced && !selectedEvent && !entering && hovered === null && draggingId === null
  const blocked = !!selectedEvent || entering
  const pauseOnInteraction = useCallback(() => setSpinning(false), [])
  const updateZoom = useCallback((value: number) => setZoom(current => current === value ? current : value), [])
  const motion = useGalleryMotion({ region: sceneRef, active: view === 'space', animate: animated, blocked: blocked || draggingId !== null, hovered, reduced, visible, action, onStart: pauseOnInteraction, onZoom: updateZoom })
  const hoverCard = useCallback((id: string | null) => { setHovered(id) }, [])
  const cardDrag = useGalleryCardDrag({ region: sceneRef, enabled: view === 'space' && visible && !blocked, motion, onStart: pauseOnInteraction, onDragChange: setDraggingId, onHover: hoverCard })
  useEffect(() => {
    if (!entering) return
    if (reduced) { setEntering(false); return }
    const total = ENTRANCE_DELAY + ENTRANCE_DURATION + Math.max(0, spaceCards.length - 1) * ENTRANCE_STAGGER + 80
    const timer = window.setTimeout(() => setEntering(false), Math.max(0, total - (performance.now() - entranceAt.current)))
    return () => window.clearTimeout(timer)
  }, [entering, reduced, spaceCards.length, entranceAt, entranceRun])
  useLayoutEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const update = () => {
      setMobile(media.matches)
      setView(media.matches ? 'grid' : 'space')
      setHovered(null)
      if (media.matches) setEntering(false)
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => { const update = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update) }, [])
  useEffect(() => { if (reduced) setSpinning(false) }, [reduced])
  const openCard = useCallback((id: string, opener?: HTMLElement) => {
    if (selectedId || entering) return
    cardDrag.cancel()
    motion.freeze()
    lastFocused.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    sourceImage.current = opener?.querySelector<HTMLElement>('.card-image-wrap, .grid-image') ?? null
    const rect = sourceImage.current?.getBoundingClientRect()
    setOrigin(rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null)
    setClosing(false); setSelectedId(id); setHovered(null)
  }, [selectedId, entering, motion, cardDrag])
  const closeCard = useCallback(() => {
    setSelectedId(null); setClosing(false); setHovered(null)
    if (isSchneiderPage()) window.history.replaceState(null, '', galleryBase.pathname)
    window.requestAnimationFrame(() => { if (lastFocused.current?.isConnected) lastFocused.current.focus({ preventScroll: true }); else document.querySelector<HTMLButtonElement>('.view-switch button, .grid-card')?.focus({ preventScroll: true }) })
  }, [])
  const getReturnRect = useCallback(() => {
    const element = sourceImage.current; if (!element?.isConnected) return null
    const rect = element.getBoundingClientRect(); let shiftX = 0, shiftY = 0
    const shiftedRegion = element.closest('.scene-region, .collection-section')
    if (shiftedRegion) { const transform = getComputedStyle(shiftedRegion).transform; if (transform !== 'none') { const matrix = new DOMMatrixReadOnly(transform); shiftX = matrix.m41; shiftY = matrix.m42 } }
    return { left: rect.left - shiftX, top: rect.top - shiftY, width: rect.width, height: rect.height }
  }, [])
  const cameraAction = (type: CameraAction['type']) => {
    if (type === 'reset') {
      cardDrag.reset()
      setHovered(null)
      entranceAt.current = performance.now()
      setEntranceRun(current => current + 1)
      setEntering(!reduced && !mobile)
      setSpinning(!reduced)
    } else cardDrag.cancel()
    setAction(current => ({ type, id: current.id + 1 }))
  }
  const showSpace = () => { cardDrag.cancel(); setView('space'); setHovered(null) }, showGrid = () => { cardDrag.cancel(); setView('grid'); setHovered(null) }
  const spatialCardsProps = { cards: spaceCards, blocked, visible, selectedId, motion, cardDrag, onSelect: openCard, onHover: hoverCard, entering }

  return <main className={`gallery-app event-overview view-${view}${selectedEvent && !closing ? ' is-event-open' : ''}${entering && view === 'space' ? ' is-arriving' : ''}`} data-reduced-motion={reduced}>
    <GalleryVideoBackground active={visible && view === 'space' && !selectedEvent} reduced={reduced} />
    <div className="space-atmosphere" aria-hidden="true" /><div className="ambient-stars" aria-hidden="true">{Array.from({ length: 48 }, (_, index) => <i key={index} style={{ left: `${(index * 37.23 + 5) % 100}%`, top: `${(index * 23.77 + 9) % 100}%`, opacity: .15 + (index % 4) * .12, width: index % 7 === 0 ? 2 : 1, height: index % 7 === 0 ? 2 : 1 }} />)}</div>
    {!mobile && <header className="site-header"><button type="button" className="brand" aria-label="回到 3D 畫廊" onClick={() => { showSpace(); cameraAction('reset') }}><span className="brand-symbol" aria-hidden="true">✦</span><span>STELLAR</span><span className="brand-divider" /><span className="brand-label">EZCON · EVENT GALLERY</span></button>
      <nav aria-label="畫廊模式" className="view-switch"><button type="button" aria-label="空間探索" aria-pressed={view === 'space'} className={view === 'space' ? 'active' : ''} onClick={showSpace}><Orbit size={16} /><span>空間探索</span></button><button type="button" aria-label="活動一覽" aria-pressed={view === 'grid'} className={view === 'grid' ? 'active' : ''} onClick={showGrid}><LayoutGrid size={15} /><span>活動一覽</span></button></nav>
    </header>}
    {view === 'space' ? <>
      <section key={`intro-${entranceRun}`} className="gallery-intro" aria-label="畫廊介紹"><div className="eyebrow intro-eyebrow"><span className="tiny-line" /> EZCON · PUBLIC RELATIONS</div><h1>易控公關活動</h1><p className="intro-heading">連結智慧建築，共築永續未來。</p><p className="intro-description">多元交流・深耕產業・拓展連結</p></section>
      <section className="scene-region" aria-label={`共 ${spaceCards.length} 場活動，可拖曳卡片與旋轉視角的 3D 活動畫廊`} aria-busy={entering} data-card-dragging={draggingId ?? undefined} ref={sceneRef} onPointerMoveCapture={event => { if (!cardDrag.heldId && hovered !== null && event.pointerType !== 'touch' && event.buttons === 0 && event.target instanceof Element && !event.target.closest('button, a, input, select, textarea, [role="button"]')) setHovered(null) }}><div className="scene-topline" aria-hidden="true"><span>THE EVENT COLLECTION</span><span>共 {spaceCards.length} 場活動</span></div>
        <SpatialCards key={entranceRun} {...spatialCardsProps} />
        <div className="scene-bottomline" aria-hidden="true"><span className="crosshair">＋</span><span>DRAG TO EXPLORE THE STORIES</span><span className="crosshair">＋</span></div></section>
      <div className="space-controls"><div className="control-bar" role="group" aria-label="3D 視角控制"><button type="button" className="rotation-button" disabled={reduced} aria-label={spinning ? '暫停自動旋轉' : '開始自動旋轉'} aria-pressed={spinning} onClick={() => { setHovered(null); if (!spinning) cameraAction('resume'); setSpinning(current => !current) }}>{spinning ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}<span>{reduced ? '減少動態效果' : spinning ? '暫停旋轉' : '自動旋轉'}</span></button><span className="control-divider" />
        <button type="button" className="icon-button" aria-label="拉遠視角" title="拉遠視角" onClick={() => cameraAction('out')}><Minus size={18} /></button><span className="zoom-readout" aria-live="off" title={`縮放範圍 ${GALLERY_ZOOM_LIMITS.min}%–${GALLERY_ZOOM_LIMITS.max}%`}>{zoom}%</span><button type="button" className="icon-button" aria-label="拉近視角" title="拉近視角" onClick={() => cameraAction('in')}><Plus size={18} /></button><span className="control-divider" /><button type="button" className="icon-button" aria-label="重設視角" title="重設視角" onClick={() => { cameraAction('reset'); setHovered(null) }}><RotateCcw size={17} /></button>
      </div><p className="gesture-hint"><MousePointer2 size={12} /><span className="desktop-hint">拖曳卡片移位<span>·</span>空白處轉向<span>·</span>滾輪縮放</span><span className="mobile-hint">拖曳卡片移位<span>·</span>輕點看活動</span></p></div>
    </> : <section className="collection-section" aria-label="所有活動"><div className="collection-heading"><div><div className="eyebrow">EZCON · EVENT JOURNAL</div><h1>聚焦智慧建築，連結產業未來。<span>{String(cards.length).padStart(2, '0')}</span></h1><p>一張卡片，一場活動。點開照片牆，重訪現場的每個片刻。</p></div>{!mobile && <button type="button" className="text-button" onClick={showSpace}><ArrowLeft size={16} />返回空間探索</button>}</div>
      {cards.length ? <div className="image-grid">{cards.map((card, index) => <button type="button" key={card.id} className={`grid-card${selectedId === card.id ? ' card-is-open' : ''}`} data-card-id={card.id} onClick={event => openCard(card.id, event.currentTarget)} aria-label={`開啟 ${card.title}，${card.photoCount} 張活動照片`}><div className="grid-image"><SafeImage card={card} /><span className="grid-number">{String(index + 1).padStart(2, '0')}</span><span className="card-event-count">{card.photoCount} 張照片</span><span className="grid-open"><ArrowUpRight size={22} /></span></div><div className="grid-caption"><div><h2>{card.title}</h2><p>{card.subtitle}</p></div><ArrowUpRight size={17} /></div></button>)}</div> : <div className="empty-collection"><Sparkles size={34} /><h2>活動紀錄準備中。</h2><p>目前尚無可瀏覽的活動照片。</p></div>}
    </section>}
    <EventPanel event={selectedEvent} origin={origin} reduced={reduced} onClosed={closeCard} onClosing={() => setClosing(true)} getReturnRect={getReturnRect} />
  </main>
}
