# Fase 14 – Q&A-API

**Doel:** Server-side acties of API-routes om een vraag te stellen, een antwoord te posten en een reactie op een antwoord te plaatsen. Alle mutaties geauthenticeerd; validatie en foutafhandeling.

---

## Doel van deze fase

- Create question: titel en body; user_id uit sessie; insert in `questions`.
- Create answer: question_id en body; user_id uit sessie; insert in `answers`.
- Create reply: answer_id en body; user_id uit sessie; insert in `answer_replies`.
- Read: functies of queries om vragen (gepagineerd), antwoorden bij een vraag en reacties bij een antwoord op te halen. Geen wijziging van bestaande posts in deze fase (edit/delete kan later).

---

## Taken (2–3 kleine stappen)

1. **Server Actions of API-routes**
   - Implementeer Server Actions (aanbevolen in Next.js App Router) of API-routes voor: createQuestion, createAnswer, createReply. Elke actie controleert de sessie (Supabase auth); bij geen sessie duidelijke fout. Valideer input (niet leeg, max lengte waar nodig). Gebruik de Supabase-client met RLS zodat alleen toegestane inserts plaatsvinden.

2. **Lezen van data**
   - Functies (in `lib/` of bij de pagina) om: alle vragen op te halen (met paginatie of limit), antwoorden bij een vraag_id, reacties bij een answer_id. Sorteer vragen op created_at (nieuwste eerst); antwoorden en reacties chronologisch. Deze kunnen direct in Server Components worden aangeroepen.

3. **Foutafhandeling en feedback**
   - Return van acties: succes met id of data, of fout met korte melding (bijv. "Niet ingelogd", "Ongeldige invoer"). Geen gevoelige stack traces naar de client. Documenteer de contracten (parameters, return) in `/docs/` (bijv. `docs/api.md` of in architecture).

---

## Verwachte output

- Een vraag, antwoord en reactie kunnen via de server worden aangemaakt als de gebruiker is ingelogd. Data wordt correct in Supabase opgeslagen. Read-functies leveren de juiste data voor overzicht en detailpagina's.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (Q&A server actions, create + read).
2. **Documentatie:** In `/docs/` beschrijven welke acties en read-functies er zijn en wanneer ze falen (bijv. `docs/api.md` of `docs/qa.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-14): Q&A API – create question/answer/reply, read functions`
