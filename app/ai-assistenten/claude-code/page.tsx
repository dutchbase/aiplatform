import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Code',
  description:
    'Ontdek Claude Code - de AI pair programmer van Anthropic voor intelligent code assistentie.',
}

export default function ClaudeCodePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Claude Code</h1>
      <p className="text-lg text-muted-foreground">
        Ontdek binnenkort alles over Claude Code, de AI pair programmer die u
        helpt bij complexe development taken.
      </p>
    </div>
  )
}
