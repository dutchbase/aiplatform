import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Gebruiksvoorwaarden',
  description:
    'De gebruiksvoorwaarden van AI Assistenten Hub. Lees de regels voor gebruik van het platform, community-gedrag en intellectueel eigendom.',
}

export default function VoorwaardenPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gebruiksvoorwaarden' },
          ]}
        />

        <h1 className="text-4xl font-bold mb-4">Gebruiksvoorwaarden</h1>

        {/* 1. Over dit platform */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Over dit platform</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          AI Assistenten Hub is een Nederlands platform voor het delen van
          kennis over AI-assistenten. Door gebruik te maken van dit platform ga
          je akkoord met deze gebruiksvoorwaarden.
        </p>

        {/* 2. Registratie */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Registratie</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Je kunt het platform gebruiken zonder account voor het lezen van
          content. Voor het stellen van vragen en plaatsen van antwoorden is een
          account vereist. Je bent verantwoordelijk voor de beveiliging van je
          account en wachtwoord.
        </p>

        {/* 3. Gedragsregels */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Gedragsregels</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Als gebruiker van het platform ga je ermee akkoord om:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Geen spam of commerciële berichten te plaatsen</li>
          <li>Andere gebruikers met respect te behandelen</li>
          <li>
            Geen misleidende, lasterlijke of illegale inhoud te plaatsen
          </li>
          <li>
            Geen inbreuk te maken op intellectueel eigendom van derden
          </li>
          <li>
            Geen persoonlijke gegevens van anderen te delen zonder toestemming
          </li>
        </ul>

        {/* 4. Door gebruikers gegenereerde inhoud */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Door gebruikers gegenereerde inhoud
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Je behoudt het auteursrecht op de vragen, antwoorden en reacties die
          je plaatst. Door inhoud te plaatsen verleen je AI Assistenten Hub een
          niet-exclusieve, wereldwijde, royaltyvrije licentie om deze inhoud te
          tonen, reproduceren en distribueren op het platform. Je garandeert dat
          je inhoud plaatst waarvoor je de rechten hebt.
        </p>

        {/* 5. Moderatie en verwijdering */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Moderatie en verwijdering
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          AI Assistenten Hub behoudt zich het recht voor inhoud te verwijderen
          of te bewerken die de gedragsregels schendt. Bij herhaaldelijke
          overtredingen kan een account worden gesuspendeerd of verwijderd.
        </p>

        {/* 6. Aansprakelijkheid */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Aansprakelijkheid</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          AI Assistenten Hub spant zich in voor de kwaliteit van de inhoud,
          maar geeft geen garanties over juistheid of volledigheid. Het platform
          is &ldquo;as is&rdquo; beschikbaar. AI Assistenten Hub is niet
          aansprakelijk voor schade door gebruik van het platform, tenzij er
          sprake is van opzet of grove nalatigheid.
        </p>

        {/* 7. Wijzigingen */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Wijzigingen</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Wij kunnen deze voorwaarden aanpassen. Wezenlijke wijzigingen worden
          gecommuniceerd via het platform. Door het platform te blijven
          gebruiken na wijzigingen ga je akkoord met de nieuwe voorwaarden.
        </p>

        {/* 8. Toepasselijk recht */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Toepasselijk recht
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Op deze voorwaarden is Nederlands recht van toepassing. Geschillen
          worden voorgelegd aan de bevoegde rechter in Nederland.
        </p>

        {/* 9. Contact */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Contact</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Vragen over deze voorwaarden? Neem contact op via{' '}
          <strong>[EMAIL]</strong>.
        </p>

        {/* 10. Laatste update */}
        <p className="text-sm text-muted-foreground mt-8 border-t border-border pt-4">
          Laatste update: februari 2026
        </p>
      </div>
    </div>
  )
}
