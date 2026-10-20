import React from 'react'
import { isSchneiderPage } from './site-paths'
import ReactDOM from 'react-dom/client'
import StellarCardGallery from '@/components/ui/3d-image-gallery'
import './styles.css'
import './event-gallery.css'
import './centered-gallery.css'
import './gallery-entrance.css'
import './gallery-theme.css'

const isSchneiderEvent = isSchneiderPage()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><StellarCardGallery initialEventId={isSchneiderEvent ? 'schneider-2026' : undefined} /></React.StrictMode>,
)

import './gallery-album.css'
