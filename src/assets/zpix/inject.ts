import { p0 } from './p0'
import { p1 } from './p1'
import { p2 } from './p2'
import { p3 } from './p3'

/** Inject self-hosted Zpix as a CSS data URI so the pixel font ships without a binary .woff2. */
export function injectZpixFont(): void {
  if (document.getElementById('zpix-font')) return
  const style = document.createElement('style')
  style.id = 'zpix-font'
  style.textContent =
    "@font-face{font-family:'Zpix';src:url(data:font/woff2;base64," +
    p0 +
    p1 +
    p2 +
    p3 +
    ") format('woff2');font-weight:normal;font-style:normal;font-display:swap;}"
  document.head.appendChild(style)
}
