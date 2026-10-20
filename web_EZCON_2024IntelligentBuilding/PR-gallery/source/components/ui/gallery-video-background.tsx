import { localAsset } from '@/src/site-paths'
import { useEffect, useRef, useState } from 'react'
import '@/src/gallery-video-background.css'

const PLAYBACK_RATE = 0.25
const VIDEO_URL = localAsset('/media/structure-ambient.mp4')
const POSTER_URL = localAsset('/media/structure-poster.webp')

export function GalleryVideoBackground({ active, reduced }: { active: boolean; reduced: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = video.current
    if (!node) return
    node.defaultPlaybackRate = PLAYBACK_RATE
    node.playbackRate = PLAYBACK_RATE
    if (active && !reduced) {
      void node.play().catch(() => { /* Keep the still frame if autoplay is unavailable. */ })
    } else {
      node.pause()
    }
    return () => node.pause()
  }, [active, reduced])

  return <div className="gallery-video-background" aria-hidden="true">
    <div className="gallery-video-frame">
      <img src={POSTER_URL} alt="" decoding="async" draggable={false} />
      {!reduced && <video
        ref={video}
        className={ready ? 'is-ready' : undefined}
        src={VIDEO_URL}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
        onLoadedMetadata={event => {
          event.currentTarget.defaultPlaybackRate = PLAYBACK_RATE
          event.currentTarget.playbackRate = PLAYBACK_RATE
        }}
        onPlaying={() => setReady(true)}
        onError={() => setReady(false)}
      />}
    </div>
  </div>
}
