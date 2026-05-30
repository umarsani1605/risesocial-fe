// Client-side email preview that mirrors the backend send (layout.js + broadcastEmail.js).
// Shared by the Compose live preview and the History detail view so they never drift.
const RISE_PRIMARY = '#FF8E4F'

/**
 * Applies the same transforms the backend does before sending:
 * - CTA anchors (`<a data-cta>`) become the Rise email button (mirrors renderEmailButton).
 * - Images are constrained so a large one never overflows the container.
 */
export function renderBroadcastPreviewBody(html: string): string {
  // Color regular links primary (CTA anchors are skipped, they become buttons).
  const colored = html.replace(/<a\b([^>]*)>/gi, (full, attrs) => {
    if (/\bdata-cta\b/i.test(attrs) || /\bstyle="/i.test(attrs)) return full
    return `<a${attrs} style="color:${RISE_PRIMARY};">`
  })

  const withCta = colored.replace(/<a\b[^>]*\bdata-cta\b[^>]*>([\s\S]*?)<\/a>/gi, (match, inner) => {
    const href = match.match(/href="([^"]*)"/i)?.[1] || '#'
    const label = String(inner)
      .replace(/<[^>]*>/g, '')
      .trim()
    if (!label) return ''
    return `<table cellpadding="0" cellspacing="0" border="0" style="margin:32px auto 0;"><tr><td align="center" bgcolor="${RISE_PRIMARY}" style="border-radius:10px;"><a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 22px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${label}</a></td></tr></table>`
  })

  return withCta.replace(/<img\b([^>]*?)\/?>/gi, (_match, attrs) => {
    const cleaned = String(attrs)
      .replace(/\s*style="[^"]*"/i, '')
      .trim()
    return `<img${cleaned ? ` ${cleaned}` : ''} style="max-width:100%;height:auto;display:block;">`
  })
}

/**
 * Full email document (logo header + body + footer) for an iframe `srcdoc`.
 * Mirrors the structure of backend src/templates/email/layout.js. The body is
 * wrapped in `#preview-body` so the Compose tab can patch it imperatively.
 */
export function buildBroadcastPreviewDoc(bodyHtml = ''): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#F6F6F6;font-family:Arial,sans-serif;color:#1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;"><tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;overflow:hidden;">
        <tr><td style="background:${RISE_PRIMARY};padding:20px 40px;">
          <img src="https://risesocial.org/images/logo_white.png" alt="Rise Social" style="display:block;max-width:72px;width:100%;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:12px 40px 24px;">
          <div id="preview-body" style="color:#374151;font-size:16px;line-height:1.8;">${renderBroadcastPreviewBody(bodyHtml)}</div>
        </td></tr>
      </table>
      <table width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;">
        <tr><td style="padding:28px 40px;text-align:center;color:#9ca3af;font-size:12px;line-height:1.8;">
          <div style="margin-bottom:6px;">Bandung, West Java 40286, Indonesia</div>
          <div>© ${year} Rise Social</div>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`
}
