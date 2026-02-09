# Fase 25 – MVP-afronding

**Doel:** Laatste controle en afronding van de MVP: alle must-haves uit de PRD zijn geïmplementeerd, documentatie is compleet, README en changelog zijn bijgewerkt, en de release wordt vastgelegd.

---

## Doel van deze fase

- Checklist PRD 11.1 must-haves: OpenClaw-sectie (installatie + 3 tutorials), Q&A werkend (stellen, beantwoorden, reacties), accounts (registreren, inloggen), blog/nieuws + RSS, SEO-structuur (URLs, meta, sitemap, breadcrumbs). Alles afgevinkt.
- README: projectnaam, beschrijving, hoe te starten (dev en build), env, link naar docs. Geen verouderde informatie.
- docs/CHANGELOG.md: alle fases tot en met 25 samengevat; release-entry voor MVP (versie of datum).
- Optioneel: tag in Git voor release (bijv. v1.0.0-mvp of release/mvp).

---

## Taken (2–3 kleine stappen)

1. **MVP-checklist**
   - Loop PRD 11.1 af: OpenClaw installatie + 3 tutorials, Q&A (vragen, antwoorden, reacties), accounts (registratie, login), blog + RSS, SEO (URLs, meta, sitemap, breadcrumbs). Controleer of elk item werkt in productie. Noteer eventuele kleine open punten in docs of als issue; fix kritieke ontbrekende onderdelen.

2. **README en docs**
   - Werk README bij: duidelijke titel, korte pitch, instructies (clone, install, env, dev, build). Links naar docs/ (architectuur, deployment, content, legal). Verwijder placeholder-tekst. Controleer dat alle bestanden in /docs/ die in de roadmap zijn genoemd bestaan en actueel zijn.

3. **Changelog en release**
   - Werk docs/CHANGELOG.md bij met een MVP-release entry: datum, versie (optioneel), en korte samenvatting van wat er live is. Commit met message zoals "chore: MVP release – checklist complete, docs and changelog updated". Optioneel: git tag en push tag voor release.

---

## Verwachte output

- MVP voldoet aan de must-haves uit de PRD. Documentatie en README zijn compleet. Changelog en eventueel release-tag vastgelegd. Platform klaar voor lancering.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken met MVP-release entry.
2. **Documentatie:** Geen nieuwe docs verplicht; wel controleren dat bestaande docs kloppen.
3. **Git:** Stagen, committen, pushen. Optioneel: tag aanmaken en pushen.

**Commit message (voorbeeld):**  
chore(phase-25): MVP release – checklist complete, README and changelog updated
