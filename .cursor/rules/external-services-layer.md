# External Services Layer Rules

**Layer:** External Services Integration  
**Location:** `/apps/dashboard/lib/services/external/`  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for integrating with external services. The system integrates with n8n for workflow automation and lead intake.

**This layer handles:**
- Lead intake via n8n → Supabase (PRD Section 7.1)
- Webhook outbound to n8n (sales actions, notifications) (PRD Section 9.3, 10.2)
- Webhook inbound from n8n (lead creation, feedback) (PRD Section 7.1, 12.2)
- Error tracking (Sentry - optional)
- Performance monitoring (optional)

**Key Principle:** External services should be abstracted behind service classes for testability and maintainability.

---

## Architecture Patterns

### Service Abstraction

**MUST:**
- Create service classes for each external service
- Abstract implementation details
- Use dependency injection for testability
- Handle errors gracefully with retries

**Example:**
```typescript
// lib/services/external/email-service.ts
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }): Promise<{ id: string }> {
    try {
      const result = await this.resend.emails.send({
        from: options.from || process.env.RESEND_FROM_EMAIL!,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (result.error) {
        throw new Error(`Resend error: ${result.error.message}`);
      }

      return { id: result.data!.id };
    } catch (error) {
      Sentry.captureException(error, {
        tags: { service: 'resend' },
        extra: { options },
      });
      throw error;
    }
  }

  async sendTemplate(
    templateId: string,
    to: string | string[],
    data: Record<string, unknown>
  ): Promise<{ id: string }> {
    // Implementation for template-based emails
  }
}
```

---

## File Structure

```
/lib/services/external/
├── email-service.ts              # Brevo email service (PRD Section 9.2)
├── n8n-service.ts               # n8n workflow integration (PRD Section 11.4)
├── webhook-service.ts           # Webhook handling for n8n
└── index.ts                     # Service exports
```

**n8n Workflows (PRD Section 9.2.3):**
- Email logging workflow (Brevo → CRM)
- Matching trigger workflows
- Export automation (future)

---

## Coding Standards

### Error Handling

**MUST:**
- Always wrap external service calls in try-catch
- Log errors to Sentry
- Provide fallback behavior when possible
- Never expose external service errors directly to users

**Example:**
```typescript
async sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const result = await this.resend.emails.send(options);
    return { success: true, id: result.data!.id };
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: { service: 'resend', operation: 'sendEmail' },
      extra: { options },
    });

    // Return user-friendly error
    throw new Error('Failed to send email. Please try again later.');
  }
}
```

### Retry Logic

**MUST:**
- Implement retry logic for transient failures
- Use exponential backoff
- Set maximum retry attempts
- Log retry attempts

**Example:**
```typescript
async sendEmailWithRetry(
  options: EmailOptions,
  maxRetries = 3
): Promise<EmailResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await this.sendEmail(options);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on non-retryable errors
      if (this.isNonRetryableError(error)) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await this.sleep(delay);

      // Log retry attempt
      Sentry.captureMessage('Email send retry attempt', {
        level: 'info',
        tags: { service: 'resend', attempt: attempt + 1 },
      });
    }
  }

  throw lastError || new Error('Failed to send email after retries');
}

private isNonRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Don't retry on validation errors
    return error.message.includes('validation') || 
           error.message.includes('invalid');
  }
  return false;
}

private sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Rate Limiting

**MUST:**
- Be aware of external service rate limits
- Implement rate limiting when needed
- Queue requests if rate limit exceeded
- Log rate limit violations

**Example:**
```typescript
import pLimit from 'p-limit';

export class EmailService {
  private resend: Resend;
  private rateLimiter: ReturnType<typeof pLimit>;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    // Resend allows 100 emails per second
    this.rateLimiter = pLimit(100);
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    return this.rateLimiter(async () => {
      try {
        const result = await this.resend.emails.send(options);
        return { success: true, id: result.data!.id };
      } catch (error) {
        if (this.isRateLimitError(error)) {
          // Queue for later or throw specific error
          throw new RateLimitError('Email rate limit exceeded');
        }
        throw error;
      }
    });
  }

  private isRateLimitError(error: unknown): boolean {
    // Check if error is rate limit error
    return error instanceof Error && 
           error.message.includes('rate limit');
  }
}
```

---

## Service-Specific Rules

### Brevo (Email Service - PRD Section 9.2)

**MUST:**
- Use Brevo API for email sending (PRD Section 9.2.3)
- Integrate with n8n for email logging (PRD Section 9.2.3)
- Log emails as activities (PRD Section 7.3, FR-13)
- Use webhooks to sync email status to CRM

**Email Logging Flow (PRD Section 9.2.3):**
1. Email sent via Brevo (directly or via n8n)
2. n8n webhook triggers on email sent
3. Activity created in CRM (`activity_type = 'email'`)
4. Link to email in Brevo stored in metadata

**Example:**
```typescript
// lib/services/external/email-service.ts
// Note: In MVP, emails are logged manually. Future: Brevo + n8n integration

import { z } from 'zod';

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().optional(),
  candidateId: z.string().uuid(),
});

export class EmailService {
  /**
   * Log email activity (PRD FR-13.1)
   * In MVP: Manual logging. Future: Automatic via n8n webhook
   */
  async logEmail(data: {
    candidateId: string;
    subject: string;
    to: string;
    cc?: string;
    bcc?: string;
    body?: string;
    brevoEmailId?: string; // Link to Brevo email (future)
  }, userId: string) {
    // Create activity record
    await supabase.from('activities').insert({
      entity_type: 'candidate',
      entity_id: data.candidateId,
      activity_type: 'email',
      summary: `Email to ${data.to} - ${data.subject}`,
      description: data.body,
      metadata: {
        subject: data.subject,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        brevoEmailId: data.brevoEmailId,
      },
      created_by: userId,
    });
  }

  /**
   * Future: Send email via Brevo and log automatically
   * This will be implemented with n8n workflow
   */
  async sendEmailViaBrevo(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ id: string }> {
    // Future implementation with Brevo API
    // n8n workflow will handle the actual sending and logging
    throw new Error('Not implemented - use n8n workflow');
  }
}

  async sendNotificationEmail(
    to: string,
    template: 'match_found' | 'unlock_approved' | 'time_approved',
    data: Record<string, unknown>
  ): Promise<{ id: string }> {
    const templateContent = this.getTemplate(template, data);
    
    return this.sendEmail({
      to,
      subject: templateContent.subject,
      html: templateContent.html,
    });
  }

  private getTemplate(
    template: string,
    data: Record<string, unknown>
  ): { subject: string; html: string } {
    // Load and render email templates
    // ... implementation
  }
}
```

### Webhook Service (PRD Section 13)

**Webhook Service for n8n Integration:**
```typescript
// lib/services/external/webhook-service.ts
// PRD Section 13: Webhook contract

export class WebhookService {
  /**
   * Send outbound webhook to n8n (PRD Section 9.3, 10.2)
   */
  async sendOutbound(options: {
    eventType: string;
    payload: Record<string, unknown>;
    leadId?: string;
    triggeredBy?: string;
  }): Promise<{ eventId: string }> {
    const n8nService = new N8nService();
    return await n8nService.sendWebhook(
      options.eventType,
      options.payload,
      options.leadId,
      options.triggeredBy
    );
  }

  /**
   * Handle inbound webhook from n8n (PRD Section 7.1)
   */
  async handleInbound(
    eventType: string,
    payload: Record<string, unknown>,
    eventId: string
  ): Promise<void> {
    const n8nService = new N8nService();
    return await n8nService.handleInboundWebhook(eventType, payload, eventId);
  }
}
```

### Sentry (Error Tracking - Optional)

**MUST:**
- Initialize Sentry in app initialization
- Capture exceptions with context
- Set user context for better debugging
- Use tags for filtering

**Example:**
```typescript
// lib/services/external/error-tracking-service.ts
import * as Sentry from '@sentry/nextjs';

export class ErrorTrackingService {
  static init() {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
        }
        return event;
      },
    });
  }

  static captureException(
    error: Error,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      user?: { id: string; email?: string };
    }
  ) {
    if (context?.user) {
      Sentry.setUser(context.user);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        Sentry.setTag(key, value);
      });
    }

    Sentry.captureException(error, {
      extra: context?.extra,
    });
  }

  static captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
    }
  ) {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        Sentry.setTag(key, value);
      });
    }

    Sentry.captureMessage(message, {
      level,
      extra: context?.extra,
    });
  }

  static setUser(user: { id: string; email?: string; role?: string }) {
    Sentry.setUser(user);
  }
}
```

**Usage in API routes:**
```typescript
// app/api/candidates/route.ts
import { ErrorTrackingService } from '@/lib/services/external/error-tracking-service';

export async function GET(request: NextRequest) {
  try {
    // ... implementation
  } catch (error) {
    ErrorTrackingService.captureException(error as Error, {
      tags: { endpoint: '/api/candidates', method: 'GET' },
      extra: { url: request.url },
      user: { id: user?.id },
    });
    throw error;
  }
}
```

### Vercel Analytics

**MUST:**
- Use Vercel Analytics for performance monitoring
- Track custom events for business metrics
- Monitor Core Web Vitals

**Example:**
```typescript
// lib/services/external/analytics-service.ts
import { track } from '@vercel/analytics';

export class AnalyticsService {
  static trackEvent(
    name: string,
    properties?: Record<string, unknown>
  ) {
    track(name, properties);
  }

  static trackCandidateCreated(candidateId: string) {
    this.trackEvent('candidate_created', { candidateId });
  }

  static trackMatchCreated(matchId: string, score: number) {
    this.trackEvent('match_created', { matchId, score });
  }
}
```

---

## Common Patterns

### Service Initialization

**Example:**
```typescript
// lib/services/external/index.ts
import { EmailService } from './email-service';
import { ErrorTrackingService } from './error-tracking-service';

// Initialize services
ErrorTrackingService.init();

// Export singleton instances
export const emailService = new EmailService();
export const errorTrackingService = ErrorTrackingService;
```

### Async Queue for Background Jobs

**Example:**
```typescript
// lib/services/external/email-queue.ts
import { emailService } from './email-service';

interface QueuedEmail {
  to: string;
  subject: string;
  html: string;
  retries: number;
}

class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;

  async enqueue(email: Omit<QueuedEmail, 'retries'>) {
    this.queue.push({ ...email, retries: 0 });
    this.process();
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift()!;
      
      try {
        await emailService.sendEmail(email);
      } catch (error) {
        // Retry up to 3 times
        if (email.retries < 3) {
          this.queue.push({ ...email, retries: email.retries + 1 });
        } else {
          // Log failed email
          ErrorTrackingService.captureException(error as Error, {
            tags: { service: 'email_queue' },
            extra: { email },
          });
        }
      }
    }

    this.processing = false;
  }
}

export const emailQueue = new EmailQueue();
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't call external services directly from API routes**
   ```typescript
   // ❌ BAD
   export async function POST(request: NextRequest) {
     const resend = new Resend(process.env.RESEND_API_KEY);
     await resend.emails.send({ ... });
   }
   
   // ✅ GOOD
   export async function POST(request: NextRequest) {
     const emailService = new EmailService();
     await emailService.sendEmail({ ... });
   }
   ```

2. **Don't ignore errors from external services**
   - Always catch and handle errors
   - Log to Sentry
   - Provide fallback behavior

3. **Don't expose API keys in code**
   - Always use environment variables
   - Never commit keys to repository

4. **Don't forget rate limiting**
   - Be aware of service limits
   - Implement queuing if needed

5. **Don't send sensitive data to external services**
   - Sanitize data before sending
   - Use templates instead of raw HTML with user data

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Resend Documentation](https://resend.com/docs)
- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
