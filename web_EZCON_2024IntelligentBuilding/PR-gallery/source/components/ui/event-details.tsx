"use client"

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, Images, X } from 'lucide-react'
import type { GalleryEvent } from '@/src/data/schneider-event'
import '@/src/event-details.css'

type EventPhoto = GalleryEvent['photos'][number]

function EventPhotoImage({ photo, thumbnail = false }: { photo: EventPhoto; thumbnail?: boolean }) {
  const sources = useMemo(() => Array.from(new Set(
    (thumbnail
      ? [photo.thumbnailUrl, photo.imageUrl, photo.originalUrl]
      : [photo.imageUrl, photo.originalUrl]
    ).filter(Boolean),
  )), [thumbnail, photo.thumbnailUrl, photo.imageUrl, photo.originalUrl])
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => setSourceIndex(0), [sources])

  if (sourceIndex >= sources.length) {
    return <div
      className={`event-detail-image-fallback${thumbnail ? ' event-detail-image-fallback-small' : ''}`}
      role={thumbnail ? undefined : 'img'}
      aria-label={thumbnail ? undefined : photo.alt}
      aria-hidden={thumbnail || undefined}
    >
      <ImageOff size={thumbnail ? 18 : 28} aria-hidden="true" />
      {!thumbnail && <span>照片暫時無法載入</span>}
    </div>
  }

  return <img
    className="event-detail-image"
    src={sources[sourceIndex]}
    alt={thumbnail ? '' : photo.alt}
    width={photo.width}
    height={photo.height}
    loading={thumbnail ? 'lazy' : 'eager'}
    decoding="async"
    draggable={false}
    onError={() => setSourceIndex(current => current + 1)}
  />
}

export function EventDetailModal({ event, photoIndex, onClose, onPhotoChange }: {
  event: GalleryEvent
  photoIndex: number | null
  onClose: () => void
  onPhotoChange: (index: number) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const thumbnails = useRef<HTMLDivElement>(null)
  const thumbnailButtons = useRef<Array<HTMLButtonElement | null>>([])
  const opener = useRef<HTMLElement | null>(null)
  const pointerStartedOnBackdrop = useRef(false)
  const headingId = useId()
  const isOpen = photoIndex !== null
  const count = event.photos.length
  const index = count > 0 ? Math.max(0, Math.min(photoIndex ?? 0, count - 1)) : 0
  const photo = event.photos[index]

  // Changing the selected photo must not close and reopen the native dialog.
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (isOpen && !node.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      node.showModal()
    } else if (!isOpen && node.open) {
      node.close()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const strip = thumbnails.current
    const button = thumbnailButtons.current[index]
    if (!strip || !button) return
    const stripBounds = strip.getBoundingClientRect()
    const buttonBounds = button.getBoundingClientRect()
    // Only scroll the thumbnail strip; preserve the reader's vertical position.
    if (buttonBounds.left < stripBounds.left + 5) {
      strip.scrollBy({ left: buttonBounds.left - stripBounds.left - 5, behavior: 'instant' })
    } else if (buttonBounds.right > stripBounds.right - 5) {
      strip.scrollBy({ left: buttonBounds.right - stripBounds.right + 5, behavior: 'instant' })
    }
  }, [index, isOpen])

  const movePhoto = (direction: number) => {
    if (count > 1) onPhotoChange((index + direction + count) % count)
  }

  const handleKeyDown = (keyboardEvent: KeyboardEvent<HTMLDialogElement>) => {
    if (keyboardEvent.altKey || keyboardEvent.ctrlKey || keyboardEvent.metaKey) return
    const target = keyboardEvent.target
    if (target instanceof HTMLElement && (
      target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    )) return
    if (keyboardEvent.key === 'ArrowLeft' || keyboardEvent.key === 'ArrowRight') {
      keyboardEvent.preventDefault()
      keyboardEvent.stopPropagation()
      movePhoto(keyboardEvent.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return <dialog
    ref={dialog}
    className="event-detail-dialog"
    aria-labelledby={headingId}
    onKeyDown={handleKeyDown}
    onCancel={cancelEvent => {
      cancelEvent.preventDefault()
      onClose()
    }}
    onClose={() => {
      // Ignore a queued close event if a later request has already reopened it.
      if (dialog.current?.open) return
      if (isOpen) onClose()
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
    }}
    onPointerDown={pointerEvent => {
      pointerStartedOnBackdrop.current = pointerEvent.target === pointerEvent.currentTarget
    }}
    onClick={clickEvent => {
      if (clickEvent.target !== clickEvent.currentTarget || !pointerStartedOnBackdrop.current) return
      const bounds = clickEvent.currentTarget.getBoundingClientRect()
      if (clickEvent.clientX < bounds.left || clickEvent.clientX > bounds.right ||
        clickEvent.clientY < bounds.top || clickEvent.clientY > bounds.bottom) onClose()
    }}
  >
    <div className="event-detail-topbar">
      <span className="event-detail-topbar-label"><Images size={16} aria-hidden="true" />活動相簿</span>
      <button type="button" className="event-detail-close" onClick={onClose} aria-label="關閉活動相簿" autoFocus>
        <span>關閉</span><X size={18} aria-hidden="true" />
      </button>
    </div>
    {isOpen && <div className="event-detail-body">
      <section className="event-detail-media" aria-label="活動照片">
        <figure className="event-detail-figure">
          <div className="event-detail-photo-frame">
            {photo ? <EventPhotoImage key={photo.id} photo={photo} /> : <div className="event-detail-image-fallback"><ImageOff size={28} aria-hidden="true" /><span>目前沒有活動照片</span></div>}
          </div>
          <figcaption className="event-detail-caption-row">
            <div className="event-detail-caption" aria-live="polite" aria-atomic="true">
              <span className="event-detail-photo-count">{String(count ? index + 1 : 0).padStart(2, '0')}<span> / {String(count).padStart(2, '0')}</span></span>
              <h3>{photo?.title ?? '活動照片'}</h3>
            </div>
            <div className="event-detail-photo-controls">
              <button type="button" onClick={() => movePhoto(-1)} disabled={count < 2} aria-label="上一張照片" title="上一張照片（←）"><ChevronLeft size={20} aria-hidden="true" /></button>
              <button type="button" onClick={() => movePhoto(1)} disabled={count < 2} aria-label="下一張照片" title="下一張照片（→）"><ChevronRight size={20} aria-hidden="true" /></button>
            </div>
          </figcaption>
        </figure>
        <div ref={thumbnails} className="event-detail-thumbnails" role="group" aria-label="選擇活動照片">
          {event.photos.map((item, photoNumber) => <button
            ref={node => { thumbnailButtons.current[photoNumber] = node }}
            key={item.id}
            type="button"
            className={`event-detail-thumbnail${photoNumber === index ? ' event-detail-thumbnail-selected' : ''}`}
            aria-label={`第 ${photoNumber + 1} 張，共 ${count} 張：${item.title}`}
            aria-pressed={photoNumber === index}
            onClick={() => onPhotoChange(photoNumber)}
          >
            <EventPhotoImage photo={item} thumbnail />
            <span className="event-detail-thumbnail-number" aria-hidden="true">{String(photoNumber + 1).padStart(2, '0')}</span>
          </button>)}
        </div>
        <p className="event-detail-album-hint">點選縮圖切換照片<span className="event-detail-keyboard-hint"> · 鍵盤 ← → 切換</span></p>
      </section>
      <section className="event-detail-information" aria-labelledby={headingId}>
        <div className="event-detail-tags"><span>{event.year}</span><span>活動紀錄</span></div>
        <h2 id={headingId} className="event-detail-title">{event.title}</h2>
        <div className="event-detail-article">
          <h3 className="event-detail-article-label">活動介紹</h3>
          {event.paragraphs.map((paragraph, paragraphIndex) => <p key={`${event.id}-${paragraphIndex}`}>{paragraph}</p>)}
        </div>
        <a className="event-detail-source-link" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
          閱讀原始活動頁<ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <p className="event-detail-source-note">依易控原活動文章整理</p>
      </section>
    </div>}
  </dialog>
}
