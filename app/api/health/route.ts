export const runtime = 'edge'

export function GET(): Response {
  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  )
}
