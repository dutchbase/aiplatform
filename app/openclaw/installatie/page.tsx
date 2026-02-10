import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OpenClawNav } from '@/components/openclaw/openclaw-nav'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenClaw Installatie – Stap voor Stap | AI Assistenten Hub',
  description:
    'Installeer OpenClaw in enkele stappen: vereisten, installatie, configuratie en verificatie. Complete Nederlandse handleiding.',
}

export default function OpenClawInstallatiePage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Breadcrumbs items={[
          { label: 'OpenClaw', href: '/openclaw' },
          { label: 'Installatie' },
        ]} />
        {/* Page header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">OpenClaw Installatie</h1>
          <OpenClawNav currentPath="/openclaw/installatie" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            In deze handleiding installeer en configureer je OpenClaw op je eigen systeem.
            Plan ongeveer 15 minuten voor de volledige setup. Je hebt een werkende
            ontwikkelomgeving nodig met de vereisten die hieronder staan beschreven.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Gepubliceerd op: 9 februari 2026
          </p>
        </div>

        {/* Section 1: Vereisten */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Vereisten</h2>

          <h3 className="text-lg font-medium mb-2">Besturingssysteem</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
            <li>Windows 10/11</li>
            <li>macOS 12 of hoger</li>
            <li>Ubuntu 20.04 of hoger</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Software</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
            <li>Node.js 18 of hoger (<a href="https://nodejs.org" className="underline hover:text-foreground">nodejs.org</a>)</li>
            <li>npm 9+ of yarn 1.22+ (meegeleverd met Node.js)</li>
            <li>Git 2.30 of hoger (<a href="https://git-scm.com" className="underline hover:text-foreground">git-scm.com</a>)</li>
          </ul>

          <p className="text-muted-foreground mb-2">Controleer je versies via de terminal:</p>
          <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
            <code>{`node --version
npm --version
git --version`}</code>
          </pre>
          <p className="text-sm text-muted-foreground mt-3">
            Bekijk de{' '}
            <Link href="/openclaw/tutorials/eerste-stappen" className="text-primary hover:underline">
              eerste-stappen tutorial
            </Link>{' '}
            om direct aan de slag te gaan na installatie.
          </p>
        </section>

        {/* Section 2: Installatie */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Installatie</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Stap 1: Repository klonen</h3>
              <p className="text-muted-foreground mb-2">
                Kloon de officiële OpenClaw-repository naar je lokale systeem en navigeer naar de projectmap:
              </p>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
                <code>{`git clone https://github.com/openclaw/openclaw.git
cd openclaw`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Stap 2: Dependencies installeren</h3>
              <p className="text-muted-foreground mb-2">
                Installeer alle benodigde Node.js-packages. Dit kan een minuut duren afhankelijk van je verbinding:
              </p>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
                <code>{`npm install`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Stap 3: Omgevingsvariabelen instellen</h3>
              <p className="text-muted-foreground mb-2">
                Kopieer het voorbeeldbestand voor omgevingsvariabelen:
              </p>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
                <code>{`cp .env.example .env`}</code>
              </pre>
              <p className="text-muted-foreground mt-2">
                Open het bestand <code className="bg-muted px-1 rounded text-sm">.env</code> in een teksteditor en vul je API-sleutel in bij{' '}
                <code className="bg-muted px-1 rounded text-sm">OPENCLAW_API_KEY</code>. Je vindt deze sleutel in het dashboard van je OpenClaw-account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Stap 4: OpenClaw bouwen</h3>
              <p className="text-muted-foreground mb-2">
                Compileer de broncode naar een uitvoerbare versie:
              </p>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
                <code>{`npm run build`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Stap 5: OpenClaw globaal beschikbaar maken (optioneel)</h3>
              <p className="text-muted-foreground mb-2">
                Installeer OpenClaw als globale CLI-tool zodat je het vanuit elke map kunt gebruiken. Na deze stap is het commando{' '}
                <code className="bg-muted px-1 rounded text-sm">openclaw</code> overal beschikbaar:
              </p>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
                <code>{`npm install -g .`}</code>
              </pre>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Heb je configuratiehulp nodig? Lees de{' '}
            <Link href="/openclaw/tutorials/configuratie" className="text-primary hover:underline">
              configuratie-tutorial
            </Link>
            .
          </p>
        </section>

        {/* Section 3: Verificatie */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Controleren of het werkt</h2>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            Voer het volgende commando uit om te bevestigen dat OpenClaw correct is geïnstalleerd:
          </p>
          <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
            <code>{`openclaw --version`}</code>
          </pre>
          <p className="text-muted-foreground mt-3 mb-4">
            Je zou een versienummer moeten zien, zoals: <code className="bg-muted px-1 rounded text-sm">OpenClaw v1.2.0</code>
          </p>
          <p className="text-muted-foreground mb-2">
            Voer daarna het volgende commando uit om alle beschikbare commando&apos;s te bekijken:
          </p>
          <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
            <code>{`openclaw --help`}</code>
          </pre>
        </section>

        {/* Next steps CTA */}
        <section>
          <p className="text-muted-foreground mb-4">
            OpenClaw succesvol geïnstalleerd? Ga verder met onze tutorials om te
            leren hoe je de assistent optimaal inzet voor je development workflow.
          </p>
          <Button asChild>
            <Link href="/openclaw/tutorials">Bekijk Tutorials</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
