# Q&A API Documentatie

## Server Actions (`app/qa/actions.ts`)

All actions require an authenticated user session. Unauthenticated calls return `{ error: 'Niet ingelogd' }`.

### createQuestion(formData: FormData)

**Returns:** `{ id: string } | { error: string }`

| Field | Type   | Validatie                    |
|-------|--------|------------------------------|
| title | string | min 10 tekens                |
| body  | string | min 20 tekens                |

Na succes: `revalidatePath('/qa')`

### createAnswer(formData: FormData)

**Returns:** `{ id: string } | { error: string }`

| Field       | Type          | Validatie      |
|-------------|---------------|----------------|
| question_id | string (UUID) | geldig UUID    |
| body        | string        | min 10 tekens  |

Na succes: `revalidatePath('/qa')` en `revalidatePath('/qa/vraag/${question_id}')`

### createReply(formData: FormData)

**Returns:** `{ id: string } | { error: string }`

| Field     | Type          | Validatie     |
|-----------|---------------|---------------|
| answer_id | string (UUID) | geldig UUID   |
| body      | string        | min 5 tekens  |

Na succes: `revalidatePath('/qa')`

## Read Functions (`lib/qa/queries.ts`)

Async functions for use in Server Components. All functions throw on unexpected DB errors.

### getQuestions(limit?: number): Promise<Question[]>

Returns questions sorted by `created_at DESC`. Default limit: 20.

### getQuestionById(id: string): Promise<Question | null>

Returns a single question or `null` if not found.

### getAnswersByQuestionId(questionId: string): Promise<Answer[]>

Returns answers for a question sorted by `created_at ASC` (chronological).

### getRepliesByAnswerId(answerId: string): Promise<AnswerReply[]>

Returns replies for an answer sorted by `created_at ASC` (chronological).

## TypeScript Types (`lib/qa/types.ts`)

```typescript
type Question    = { id, user_id, title, body, created_at, updated_at }
type Answer      = { id, question_id, user_id, body, created_at, updated_at }
type AnswerReply = { id, answer_id, user_id, body, created_at, updated_at }
```

Input shapes:

```typescript
type CreateQuestionInput = { title: string; body: string }
type CreateAnswerInput   = { question_id: string; body: string }
type CreateReplyInput    = { answer_id: string; body: string }
```

## Foutafhandeling

- Unauthenticated: `{ error: 'Niet ingelogd' }`
- Validation failure: `{ error: '<Dutch validation message>' }`
- DB/unexpected error: `{ error: 'Er is iets misgegaan. Probeer het opnieuw.' }`
- No stack traces or internal details are exposed to callers.
