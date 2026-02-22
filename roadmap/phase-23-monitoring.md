# Fase 23 – Monitoring

**Doel:** Basis monitoring voor beschikbaarheid en fouten (PRD 8.6): uptime-check, error tracking (bijv. Sentry), en gestructureerde logging voor kritieke acties.

---

## Doel van deze fase

- Uptime-monitoring: externe ping op de productie-URL (via Vercel Analytics, UptimeRobot, of vergelijkbaar) of afhankelijk van hosting. Doel: uitval detecteren.
- Error tracking: Sentry (of vergelijkbaar) geïntegreerd voor frontend en/of server-side errors. Geen gevoelige data in error reports; source maps optioneel voor productie.
- Logging: bij kritieke acties (login, posten, evt. registratie) een gestructureerde log (bijv. naar console of externe service). Geen persoonsgegevens in logs; wel actietype en timestamp.

---

## Taken (2–3 kleine stappen)

1. **Error tracking**
   - Installeer en configureer Sentry voor Next.js (of vergelijkbaar). Capture unhandled exceptions en API errors. Stel DSN in via env (NEXT_PUBLIC_SENTRY_DSN of SENTRY_DSN). Test met een bewust getriggerde fout in development. Documenteer in /docs/ hoe Sentry is geconfigureerd.

2. **Uptime en health**
   - Zorg voor een eenvoudige health-check (bijv. /api/health die 200 retourneert). Configureer een uptime-monitor die deze URL periodiek aanroept. Documenteer welke service wordt gebruikt en waar te kijken bij uitval.

3. **Structured logging**
   - Bij login (succes/falen), registratie en bij het posten van een vraag/antwoord: log een compact event (bijv. type, timestamp, user_id hash of "anon"). Geen wachtwoorden of body content. Doel: audit trail voor moderatie en debugging. Documenteer in docs/monitoring.md.

---

## Verwachte output

- Fouten in productie worden opgevangen en gemeld in Sentry. Uptime wordt gemonitord. Kritieke acties zijn logbaar. Documentatie is bijgewerkt.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (monitoring: Sentry, uptime, logging).
2. **Documentatie:** docs/monitoring.md met uitleg over error tracking, uptime en logging.
3. **Git:** Stagen, committen, pushen. Geen DSN of secrets in repo.

**Commit message (voorbeeld):**  
chore(phase-23): monitoring – Sentry, uptime check, structured logging
