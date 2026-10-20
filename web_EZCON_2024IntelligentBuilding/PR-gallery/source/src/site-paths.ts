// Resolve resources from this module's directory so the gallery can live in any subfolder.
const moduleUrl = import.meta.url
export const galleryBase = new URL('../', moduleUrl)
export function localAsset(path: string) {
  return new URL(path.replace(/^\/+/, ''), galleryBase).href
}
export function isSchneiderPage() {
  const current = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '')
  const target = new URL('schneider-2026/', galleryBase).pathname.replace(/\/+$/, '')
  return current === target
}
