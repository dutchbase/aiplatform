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
          heading: 'OpenClaw starten',
          content:
            'Zodra OpenClaw geïnstalleerd is, start je de assistent op via de terminal of de geïntegreerde editor. OpenClaw herkent automatisch de context van je huidige project en past zijn antwoorden hierop aan. Zorg dat je werkmap correct is ingesteld voordat je begint.',
        },
        {
          heading: 'Je eerste vraag stellen',
          content:
            'Stel een concrete, gerichte vraag over je code of project. OpenClaw werkt het beste met specifieke vragen zoals "Hoe implementeer ik foutafhandeling in deze functie?" in plaats van vage verzoeken. De assistent analyseert je vraag en geeft een direct toepasbaar antwoord met uitleg.',
        },
        {
          heading: 'Code genereren met OpenClaw',
          content:
            'Vraag OpenClaw om code te genereren door je gewenste functionaliteit te beschrijven. Je kunt specificeren welke taal, framework of stijlvoorkeur je hanteert. OpenClaw past de gegenereerde code aan op basis van de bestaande codebase in je project.',
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
          heading: 'Basis instellingen',
          content:
            'De basis instellingen van OpenClaw bepalen hoe de assistent zich gedraagt in dagelijks gebruik. Je configureert hier je voorkeurstaal voor responses, het gewenste detailniveau van antwoorden en de standaard projectstructuur die OpenClaw aanneemt. Deze instellingen zijn te wijzigen via het configuratiebestand in de root van je project.',
        },
        {
          heading: 'API keys configureren',
          content:
            'OpenClaw maakt gebruik van externe AI-diensten die een API key vereisen. Sla je keys veilig op in een `.env`-bestand en verwijs hier vanuit de configuratie naar. Gebruik nooit je productie-API-keys in development omgevingen en commit nooit secrets naar versiebeheer.',
        },
        {
          heading: 'Geavanceerde opties',
          content:
            'Voor gevorderde gebruikers biedt OpenClaw uitgebreide configuratiemogelijkheden zoals aangepaste context-vensters, domeinspecifieke kennisbases en integraties met externe tools. Deze opties zijn beschikbaar via de geavanceerde sectie van het configuratiebestand en worden gedocumenteerd in de officiële handleiding.',
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
            'De kwaliteit van je prompt bepaalt grotendeels de kwaliteit van het antwoord. Wees specifiek over het gewenste resultaat, geef relevante context mee en geef aan welk formaat je verwacht. Gebruik zinnen als "Refactor deze functie zodat het..." of "Schrijf een test die controleert of..." voor de meest bruikbare resultaten.',
        },
        {
          heading: 'Gebruik van context',
          content:
            'OpenClaw werkt beter wanneer het de juiste context heeft. Verwijs expliciet naar bestanden, functies of concepten die relevant zijn voor je vraag. Je kunt meerdere bestanden als context meegeven, zodat OpenClaw het grotere plaatje begrijpt en consistente code genereert die aansluit bij je bestaande codebase.',
        },
        {
          heading: 'Keyboard shortcuts',
          content:
            'OpenClaw ondersteunt diverse sneltoetsen die je sessies aanzienlijk versnellen. De meestgebruikte combinaties zijn beschikbaar via de toetsenbordreferentie in de instellingen. Door sneltoetsen te leren voor veelgebruikte acties zoals context wisselen, sessies opslaan en commando\'s herhalen, verhoog je je productiviteit merkbaar.',
        },
        {
          heading: 'Workflow optimalisatie',
          content:
            'Integreer OpenClaw structureel in je development workflow door het in te zetten bij vaste stappen: code review, documentatie genereren en testcases schrijven. Stel terugkerende taken in als sjablonen zodat je niet steeds dezelfde instructies hoeft te typen. Een consistente werkwijze leidt tot betere en voorspelbaardere resultaten.',
        },
      ],
    },
  },
]
