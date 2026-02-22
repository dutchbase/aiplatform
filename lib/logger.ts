/**
 * Structured logging utility for audit trail events.
 * Logs to stdout as JSON — visible in Vercel Functions logs and local terminal.
 *
 * Privacy rules:
 * - Never log passwords, email addresses, or content bodies.
 * - User IDs are hashed (first 8 chars of base64) to prevent direct PII exposure.
 */

export type LogEventType =
  | 'login_success'
  | 'login_failure'
  | 'signup'
  | 'qa_question_created'
  | 'qa_answer_created'

interface LogEntry {
  type: LogEventType
  timestamp: string
  userId: string
}

/**
 * Returns the first 8 characters of a base64-encoded userId.
 * Not cryptographically strong — purpose is to correlate events
 * without storing the raw UUID in plain logs.
 */
function hashUserId(userId: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(userId).toString('base64').slice(0, 8)
  }
  // Edge runtime fallback (btoa is available globally)
  return btoa(userId).slice(0, 8)
}

/**
 * Log a structured audit event.
 *
 * @param type  - Event type identifier
 * @param userId - Raw user ID (UUID from Supabase). Pass undefined for anonymous/unauthenticated events.
 */
export function logEvent(type: LogEventType, userId?: string): void {
  const entry: LogEntry = {
    type,
    timestamp: new Date().toISOString(),
    userId: userId ? hashUserId(userId) : 'anon',
  }
  console.log(JSON.stringify(entry))
}
