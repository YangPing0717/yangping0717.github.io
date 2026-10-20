export type OrbitSlot = { x: number; y: number; scale: number; tilt: number; depth: number }

// Desktop offsets form a bounded, staggered constellation around the headline.
// Keep its composition centered instead of spreading farther on wide screens.
// Three restrained size bands add rhythm while keeping the largest within 1.32× of the smallest.
const desktop = [
  [-300, -247, .80, -4], [-10, -292, .61, 3], [220, -248, .71, -3],
  [530, 36, .80, 3], [-510, -75, .61, -5], [522, -265, .71, 4],
  [-453, 152, .71, 3], [-242, 263, .71, -3], [65, 278, .80, 2], [410, 310, .80, -4],
]
const mobile = [
  [.25, .18, .55, -3], [.75, .18, .55, 3], [.25, .32, .55, 2], [.75, .32, .55, -2],
  [.125, .5, .37, -3], [.875, .5, .37, 3],
  [.25, .68, .55, -2], [.75, .68, .55, 2], [.25, .82, .55, 3], [.75, .82, .55, -3],
]
// Real world-space layers: the same cover can move in front of or behind its
// neighbours as the viewpoint changes. Card 09 is the featured foreground layer.
const depths = [7, -8, 3, 10, 6, -12, -2, 4, 16, -5]

// Keep this in sync with --event-card-width in centered-gallery.css.
export function cardWidthForViewport(width: number) { return width <= 760 ? 240 : width <= 1100 ? 315 : 360 }

export function getOrbitSlots(count: number, width: number, height: number): OrbitSlot[] {
  const isMobile = width <= 760
  const base = isMobile ? mobile : desktop
  const cardWidth = cardWidthForViewport(width)
  const compactMobile = isMobile && height <= 640
  const topSafe = isMobile ? compactMobile ? 84 : 100 : height <= 760 ? 94 : 118
  const bottomSafe = isMobile ? 104 : 110
  const middle = height / 2
  const titleHalf = isMobile ? compactMobile ? 64 : 86 : height <= 760 ? 96 : 112
  const upperEnd = middle - titleHalf, lowerStart = middle + titleHalf
  const upperRoom = Math.max(1, upperEnd - topSafe)
  const lowerRoom = Math.max(1, height - bottomSafe - lowerStart)
  const gap = isMobile ? 12 : 20
  const cardHeight = cardWidth * .8 + (isMobile ? 33.4 : 38.8)
  const tiltLimit = 3 * Math.PI / 180
  const boundsWidth = cardWidth * Math.cos(tiltLimit) + cardHeight * Math.sin(tiltLimit)
  const boundsHeight = cardHeight * Math.cos(tiltLimit) + cardWidth * Math.sin(tiltLimit)
  const rowScale = isMobile ? .5 : .78
  const rowRoom = isMobile ? (Math.min(upperRoom, lowerRoom) - gap) / 2 : Math.min(upperRoom, lowerRoom) - 12
  const fit = isMobile ? Math.max(.15, Math.min(1,
    rowRoom / (boundsHeight * rowScale),
    (width * .5 - gap) / (boundsWidth * rowScale),
  )) : Math.max(.15, Math.min(1,
    (width - 72) / 1320,
    (middle - topSafe) / 410,
    (height - bottomSafe - middle) / 410,
  ))
  return Array.from({ length: count }, (_, i) => {
    const place = i % base.length
    let [x, y, scale, tilt] = base[place]
    // Leave more of each photograph exposed while retaining the three size bands.
    scale *= fit * (isMobile ? 1 : 1.12)
    if (isMobile) {
      // Four above, two at the sides, four below: every center stays on screen.
      if (place < 4) y = (topSafe + upperRoom * (place < 2 ? .25 : .75) + 28) / height
      else if (place < 6) y = .5
      else y = (lowerStart + lowerRoom * (place < 8 ? .25 : .75)) / height
    } else {
      x = .5 + x * fit / width
      y = .5 + y * fit / height
    }
    const radians = Math.abs(tilt) * Math.PI / 180
    const halfWidth = (cardWidth * Math.cos(radians) + cardHeight * Math.sin(radians)) * scale / 2
    const halfHeight = (cardHeight * Math.cos(radians) + cardWidth * Math.sin(radians)) * scale / 2
    x = Math.max(8 + halfWidth, Math.min(width - 8 - halfWidth, x * width)) / Math.max(1, width)
    const yPx = Math.max(topSafe + halfHeight, Math.min(height - bottomSafe - halfHeight, y * height))
    return { x, y: yPx / Math.max(1, height), scale, tilt, depth: depths[i % depths.length] * (isMobile ? .55 : 1) }
  })
}
