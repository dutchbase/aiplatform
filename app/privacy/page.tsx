import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description:
    'Hoe AI Assistenten Hub omgaat met jouw persoonsgegevens. Transparantie over gegevensverzameling, gebruik en jouw rechten.',
}

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Privacybeleid' }]}
        />

        <h1 className="text-4xl font-bold mb-4">Privacybeleid</h1>

        {/* 1. Introductie */}
        <p className="text-muted-foreground leading-relaxed mb-4">
          Welkom bij het privacybeleid van AI Assistenten Hub. Wij hechten veel
          waarde aan de bescherming van jouw persoonsgegevens en verwerken deze
          in overeenstemming met de Algemene Verordening Gegevensbescherming
          (AVG).
        </p>

        {/* 2. Verantwoordelijke */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Verantwoordelijke</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          De verwerkingsverantwoordelijke voor jouw persoonsgegevens is:{' '}
          <strong>[NAAM]</strong>, bereikbaar via{' '}
          <strong>[EMAIL]</strong>. Vul dit in voor de lancering.
        </p>

        {/* 3. Welke gegevens verzamelen wij? */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Welke gegevens verzamelen wij?
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>
            <strong>Accountgegevens:</strong> e-mailadres en weergavenaam bij
            registratie via Supabase Auth.
          </li>
          <li>
            <strong>Inhoud:</strong> vragen, antwoorden en reacties die je
            plaatst op het Q&A-platform.
          </li>
          <li>
            <strong>Serverlogboeken:</strong> IP-adres, browser-type en
            paginabezoeken in serverlogs. Worden 30 dagen bewaard.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Wij gebruiken geen analytics-software van derden en plaatsen geen
          tracking-cookies.
        </p>

        {/* 4. Doeleinden en rechtsgronden */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Doeleinden en rechtsgronden
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>
            Account aanmaken en inloggen → Uitvoering van de overeenkomst (art.
            6 lid 1 b AVG)
          </li>
          <li>
            Weergeven van jouw bijdragen → Uitvoering van de overeenkomst (art.
            6 lid 1 b AVG)
          </li>
          <li>
            Serverbeveiliging en misbruikpreventie → Gerechtvaardigd belang
            (art. 6 lid 1 f AVG)
          </li>
        </ul>

        {/* 5. Bewaartermijnen */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Bewaartermijnen</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Accountgegevens worden bewaard zolang het account actief is. Na
          verwijdering van het account worden persoonsgegevens binnen 30 dagen
          verwijderd. Serverlogboeken worden 30 dagen bewaard.
        </p>

        {/* 6. Jouw rechten */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Jouw rechten</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Op grond van de AVG heb je de volgende rechten:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Recht op inzage</li>
          <li>Recht op rectificatie</li>
          <li>Recht op vergetelheid</li>
          <li>Recht op beperking van de verwerking</li>
          <li>Recht op overdraagbaarheid</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Neem contact op via <strong>[EMAIL]</strong> om gebruik te maken van
          jouw rechten. Je hebt ook het recht een klacht in te dienen bij de
          Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).
        </p>

        {/* 7. Beveiliging */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Beveiliging</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Persoonsgegevens worden opgeslagen bij Supabase, een beveiligd
          platform met encryptie in transit en at rest. Wij treffen passende
          technische en organisatorische maatregelen om jouw gegevens te
          beschermen.
        </p>

        {/* 8. Cookies */}
        <h2 id="cookies" className="text-2xl font-semibold mt-8 mb-3">
          Cookies
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Dit platform gebruikt uitsluitend functionele cookies die noodzakelijk
          zijn voor de werking van de dienst (inlogsessie). Er worden geen
          tracking-cookies of advertentiecookies geplaatst.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Zie ook onze{' '}
          <a
            href="/voorwaarden"
            className="underline hover:text-foreground transition-colors"
          >
            gebruiksvoorwaarden
          </a>{' '}
          voor meer informatie over gebruik van het platform.
        </p>

        {/* 9. Wijzigingen */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Wijzigingen</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Wij kunnen dit privacybeleid aanpassen. De datum van de laatste
          wijziging staat onderaan de pagina. Wezenlijke wijzigingen worden
          gecommuniceerd via het platform.
        </p>

        {/* 10. Laatste update */}
        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-4">
          Laatste update: februari 2026
        </p>
      </div>
    </div>
  )
}
