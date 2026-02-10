export interface Tutorial {
  slug: string
  title: string
  description: string
  lastUpdated: string
  content: {
    intro: string
    steps: Array<{
      heading: string
      content: string
    }>
  }
}

export const tutorials: Tutorial[] = [
  {
    slug: 'eerste-stappen',
    title: 'Eerste Stappen met OpenClaw',
    description:
      'Begin met OpenClaw: installatie, basis commando\'s en je eerste AI-gesprek.',
    lastUpdated: '2026-02-09',
    content: {
      intro:
        'OpenClaw is ontworpen om developers direct productief te maken. In deze tutorial leer je de basishandelingen die je nodig hebt om aan de slag te gaan. We behandelen het opstarten van de assistent, het stellen van je eerste vraag en het genereren van code. Na het doorlopen van deze tutorial heb je een werkende setup en ben je klaar voor de meer gevorderde tutorials.',
      steps: [
        {
          heading: 'OpenClaw opstarten',
          content:
            'Open een terminal in de map van je project en typ: openclaw start. OpenClaw analyseert automatisch de bestanden in je werkmap en laadt de projectcontext. Je ziet een bevestiging zodra de assistent gereed is, inclusief het aantal geïndexeerde bestanden. Zorg dat je werkmap de root van je project is — OpenClaw gebruikt package.json of een .openclaw-bestand als ankerpunt.',
        },
        {
          heading: 'Je eerste vraag stellen',
          content:
            'Typ je vraag direct in de prompt die OpenClaw toont. Wees concreet: \'Wat doet de functie getUserById in src/lib/users.ts?\' werkt beter dan \'Leg mijn code uit.\' OpenClaw doorzoekt de geïndexeerde bestanden, vindt de relevante context en geeft een antwoord met verwijzing naar de betreffende regels. Je kunt ook een bestandspad meegeven: \'Analyseer @src/lib/users.ts\'.',
        },
        {
          heading: 'Code genereren',
          content:
            'Beschrijf de gewenste functionaliteit zo specifiek mogelijk. Gebruik aanwijzingen als \'in TypeScript\', \'gebruik de fetch API\', of \'schrijf een async functie\'. Voorbeeld: \'Schrijf een async TypeScript-functie die een gebruiker op ID ophaalt uit Supabase en undefined teruggeeft als de gebruiker niet bestaat.\' OpenClaw genereert de code en legt uit welke keuzes het heeft gemaakt.',
        },
        {
          heading: 'Je sessie afsluiten en hervatten',
          content:
            'Type exit of druk op Ctrl+C om een sessie te beëindigen. OpenClaw slaat de gespreksgeschiedenis automatisch op in .openclaw/history. Bij de volgende start laad je een eerdere sessie via: openclaw start --resume. Dit is handig bij langere projecten waarbij je de context niet opnieuw wilt opbouwen.',
        },
      ],
    },
  },
  {
    slug: 'configuratie',
    title: 'OpenClaw Configureren',
    description:
      'Pas OpenClaw aan naar jouw workflow: instellingen, API keys en preferences.',
    lastUpdated: '2026-02-09',
    content: {
      intro:
        'Een goed geconfigureerde OpenClaw-installatie sluit naadloos aan op jouw persoonlijke workflow en projecteisen. In deze tutorial doorloop je de belangrijkste configuratieopties: van basis instellingen tot geavanceerde aanpassingen. Door OpenClaw correct in te stellen bespaar je tijd en krijg je betere, meer gerichte antwoorden. Na deze tutorial weet je hoe je de assistent optimaal instelt voor jouw specifieke gebruik.',
      steps: [
        {
          heading: 'Het configuratiebestand aanmaken',
          content:
            'OpenClaw zoekt bij het opstarten naar een .openclaw.json bestand in de root van je project. Als dit bestand niet bestaat, werkt OpenClaw met standaardinstellingen. Maak het bestand aan via: openclaw init. Dit genereert een .openclaw.json met de meestgebruikte opties en hun standaardwaarden. Voeg .openclaw.json toe aan je versiebeheersysteem zodat je teamconfiguratie gedeeld wordt.',
        },
        {
          heading: 'API-sleutel instellen',
          content:
            'OpenClaw heeft een API-sleutel nodig voor de onderliggende AI-dienst. Sla je sleutel op in een .env bestand: OPENCLAW_API_KEY=jouw-sleutel-hier. Verwijs vanuit .openclaw.json naar de omgevingsvariabele met: "apiKey": "${OPENCLAW_API_KEY}". Commit nooit je .env bestand naar Git — voeg het toe aan .gitignore. Je API-sleutel vind je in het dashboard van je OpenClaw-account.',
        },
        {
          heading: 'Taal en responsegedrag instellen',
          content:
            'Stel in .openclaw.json de voorkeurstaal in voor antwoorden: "language": "nl" voor Nederlands. Configureer ook het detailniveau met "verbosity": "concise" (kort), "normal" (standaard) of "detailed" (uitgebreid). Voor codegerelateerde vragen kun je het framework specificeren: "defaultStack": ["typescript", "nextjs", "supabase"]. OpenClaw past zijn antwoorden hierop aan zonder dat je dit telkens hoeft te herhalen.',
        },
        {
          heading: 'Bestanden en mappen uitsluiten',
          content:
            'Gebruik de ignore-optie om mappen uit te sluiten van indexering: "ignore": ["node_modules", ".next", "dist", "coverage"]. Dit versnelt het opstarten en voorkomt dat OpenClaw irrelevante context gebruikt. Je kunt ook bestandspatronen opgeven zoals "**/*.test.ts". Een kleinere, relevante context leidt doorgaans tot betere en snellere antwoorden.',
        },
      ],
    },
  },
  {
    slug: 'tips',
    title: 'Tips en Trucs voor OpenClaw',
    description:
      'Haal meer uit OpenClaw: productiviteitstips, shortcuts en best practices.',
    lastUpdated: '2026-02-09',
    content: {
      intro:
        'Met de juiste technieken haal je aanzienlijk meer uit OpenClaw dan met een basisopstelling. Deze tutorial bundelt de meest effectieve tips van ervaren gebruikers. Je leert hoe je prompts schrijft die consistente en bruikbare resultaten opleveren, hoe je context slim inzet en welke sneltoetsen je workflow versnellen. Pas deze tips toe in je dagelijkse werk om OpenClaw optimaal te benutten.',
      steps: [
        {
          heading: 'Effectieve prompts schrijven',
          content:
            'De meest bruikbare prompts zijn concreet, context-rijk en actiegericht. Gebruik het patroon: [actie] + [onderwerp] + [beperking of gewenst formaat]. Slecht: \'fix dit\'. Goed: \'Refactor de functie parseUserInput in src/utils/parser.ts zodat deze een Result-type teruggeeft in plaats van een exception te gooien. Gebruik hetzelfde patroon als in src/utils/validator.ts.\' Door een referentiebestand te noemen, stuurt OpenClaw de stijl van het antwoord.',
        },
        {
          heading: 'Context slim inzetten',
          content:
            'OpenClaw indexeert je gehele project, maar jij bepaalt welke context actief is. Prefix een bestandspad met @ om het expliciet als context te markeren: \'@src/lib/auth.ts Controleer of deze functie gevoelig is voor session hijacking.\' Je kunt meerdere bestanden tegelijk markeren. Voor grote codebases helpt het om context te beperken tot de relevante module — dit geeft gerichte antwoorden en bespaart tokens.',
        },
        {
          heading: 'Veelgemaakte fouten vermijden',
          content:
            'De meest voorkomende valkuil is een te vage prompt waardoor OpenClaw een generiek antwoord geeft dat niet aansluit bij je codebase. Tweede fout: OpenClaw vragen om iets te \'repareren\' zonder de foutmelding mee te sturen. Voeg altijd de volledige foutmelding toe, inclusief stack trace. Derde fout: ervan uitgaan dat OpenClaw wijzigingen automatisch opslaat — het genereert altijd een voorstel dat jij beoordeelt en toepast.',
        },
        {
          heading: 'Workflow-integratie',
          content:
            'Maak OpenClaw onderdeel van vaste stappen in je ontwikkelworkflow. Gebruik het bij code reviews: \'Beoordeel deze diff op mogelijke bugs en onveilige patronen.\' Gebruik het bij het schrijven van tests: \'Schrijf Jest-tests voor alle edge cases van de functie calculateDiscount.\' Gebruik het bij documentatie: \'Genereer een JSDoc-commentaarblok voor elke publieke functie in dit bestand.\' Door OpenClaw structureel in te zetten verhoog je de consistentie en kwaliteit van je code.',
        },
      ],
    },
  },
]
