const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

/**
 * Fetch a list of recent inbox messages (metadata only — no body).
 */
export async function fetchInbox(accessToken, maxResults = 20) {
  const res = await fetch(
    `${GMAIL_BASE}/messages?maxResults=${maxResults}&labelIds=INBOX`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error(`Gmail list failed: ${res.status}`)
  const data = await res.json()
  return data.messages || []
}

/**
 * Fetch a single message with full headers + body.
 */
export async function fetchEmailDetail(accessToken, messageId) {
  const res = await fetch(
    `${GMAIL_BASE}/messages/${messageId}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error(`Gmail message failed: ${res.status}`)
  return res.json()
}

/**
 * Decode base64url → UTF-8 string.
 */
function b64decode(str) {
  // Replace URL-safe chars and add padding
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
  } catch {
    return atob(base64)
  }
}

/**
 * Recursively walk message parts to find the plain-text body.
 */
function extractTextFromParts(parts) {
  if (!parts) return ''
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return b64decode(part.body.data)
    }
    if (part.parts) {
      const nested = extractTextFromParts(part.parts)
      if (nested) return nested
    }
  }
  // Fall back to HTML if no plain text found
  for (const part of parts) {
    if (part.mimeType === 'text/html' && part.body?.data) {
      const html = b64decode(part.body.data)
      // Strip HTML tags for plain text
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }
    if (part.parts) {
      const nested = extractTextFromParts(part.parts)
      if (nested) return nested
    }
  }
  return ''
}

/**
 * Given a full Gmail message object, return a decoded plain-text body string.
 */
export function decodeEmailBody(message) {
  const payload = message.payload
  if (!payload) return ''

  // Single-part message
  if (payload.body?.data) {
    return b64decode(payload.body.data)
  }

  // Multi-part message
  return extractTextFromParts(payload.parts || [])
}

/**
 * Extract a header value by name from a message payload.
 */
export function getHeader(message, name) {
  const headers = message.payload?.headers || []
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

/**
 * Fetch summaries for a list of message stubs (parallel, limited).
 */
export async function fetchEmailSummaries(accessToken, messageStubs) {
  // Fetch top 20 in parallel (capped to avoid rate limits)
  const limited = messageStubs.slice(0, 20)
  const results = await Promise.allSettled(
    limited.map((m) => fetchEmailDetail(accessToken, m.id))
  )
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => {
      const msg = r.value
      return {
        id: msg.id,
        subject: getHeader(msg, 'Subject') || '(no subject)',
        from: getHeader(msg, 'From') || 'Unknown',
        date: getHeader(msg, 'Date') || '',
        snippet: msg.snippet || '',
        raw: msg,
      }
    })
}
