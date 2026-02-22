# Fix Matching Settings Page Issues and Enhancements

## Context & Goal

The matching settings page (`/matching-settings`) has several critical bugs preventing proper functionality, and requires enhancements to support additional AI models. The system uses Supabase Edge Functions for AI matching, stores configuration in `system_settings` table, and displays settings in a React Admin interface. This task addresses UI errors, CORS issues, model availability, and data display problems.

## Task Description

Fix the following issues and implement enhancements:

1. **Remove 'duplicaat' column** from the leads table view (`/leads`)
2. **Fix "Fout bij laden van backfill tellingen" error** on matching-settings page load
3. **Fix inability to save changes** on matching-settings page
4. **Add GPT-5-nano, gpt-5-mini, and gtp-5.2** as selectable scoring models (with dropdown/select UI)
5. **Add all three embedding models** (text-embedding-3-small, text-embedding-3-large, text-embedding-ada-002) as selectable options
6. **Fix prompts displaying "[object Object]"** instead of actual text
7. **Fix CORS error** when clicking "Embeddings genereren" button
8. **Fix backfill counts query** that's causing 400 errors in console

**Scope:**
- Frontend: `src/components/admin/MatchingSettingsPage.tsx`, `src/components/leads/LeadsListContent.tsx`
- Backend: `supabase/functions/backfill-embeddings/index.ts`
- Database: Verify RLS policies for `contact_embeddings` and `company_embeddings` tables
- Configuration: Ensure proper CORS headers and error handling

## Technical Specifications

**Stack:**
- Frontend: React with TypeScript, React Admin, shadcn/ui components
- Backend: Supabase Edge Functions (Deno runtime)
- Database: PostgreSQL with pgvector extension
- API: Supabase REST API and Edge Functions

**Key Files:**
- `src/components/admin/MatchingSettingsPage.tsx` - Main settings page component
- `src/components/leads/LeadsListContent.tsx` - Leads table view
- `supabase/functions/backfill-embeddings/index.ts` - Backfill Edge Function
- `supabase/functions/_shared/matching.ts` - Model loading helpers
- `supabase/functions/_shared/openai.ts` - OpenAI API helpers

**Database Tables:**
- `system_settings` - Stores matching configuration (prompts, models, thresholds, pricing)
- `contact_embeddings` - Stores contact embeddings (RLS protected)
- `company_embeddings` - Stores company embeddings (RLS protected)
- `contacts` - Contact records
- `companies` - Company records

**Model Requirements:**
- Embedding models: `text-embedding-3-small` (1536-dim), `text-embedding-3-large` (3072-dim), `text-embedding-ada-002` (1536-dim)
- Scoring models: `gpt-4o-mini`, `gpt-4o`, `gpt-5-nano`, `gpt-5-mini`, `gtp-5.2` (note: user specified "gtp-5.2" which may be a typo for "gpt-5.2", but implement as specified)

**Deployment Platform:** Vercel (Next.js frontend) + Supabase (backend)

## Constraints & Conditions

1. **RLS Policies:** All queries must respect Row Level Security. The backfill counts query may fail if RLS blocks access to `contact_embeddings` or `company_embeddings` tables.
2. **CORS:** Edge Functions must return proper CORS headers for preflight (OPTIONS) and actual requests.
3. **Model Dimensions:** Changing embedding models may require schema changes (1536 vs 3072 dimensions). For now, support all models but warn users about dimension mismatches.
4. **Admin Only:** Matching settings page requires admin access (`sales.administrator = true`).
5. **Data Types:** Prompts must be stored and retrieved as strings, not JSON objects.
6. **Error Handling:** All API calls must have proper error handling with user-friendly messages in Dutch.

## Verification Criteria

1. **Duplicaat Column Removed:**
   - Navigate to `/leads` page
   - Verify "Duplicaat" column is not visible in table header or rows
   - Verify leads with `is_duplicate = true` still show duplicate badge in other locations (e.g., lead detail view)

2. **Backfill Counts Load Successfully:**
   - Navigate to `/matching-settings` page
   - Verify no "Fout bij laden van backfill tellingen" error appears
   - Verify counts display correctly: "Nog zonder embeddings: X contacten, Y bedrijven"
   - Check browser console for no 400 errors related to `contact_embeddings` or `company_embeddings`

3. **Settings Save Successfully:**
   - Change any setting (threshold, prompt, model, pricing)
   - Click "Opslaan" button
   - Verify success notification appears
   - Refresh page and verify changes persisted
   - Check `system_settings` table in database to confirm values saved

4. **Model Selection Works:**
   - Verify embedding model dropdown shows: `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`
   - Verify scoring model dropdown shows: `gpt-4o-mini`, `gpt-4o`, `gpt-5-nano`, `gpt-5-mini`, `gtp-5.2`
   - Select each model and verify it saves correctly
   - Verify pricing fields update when model changes

5. **Prompts Display Correctly:**
   - Verify prompt textareas show actual prompt text, not "[object Object]"
   - Edit prompts and verify changes save and display correctly
   - Check database `system_settings.value` column contains string, not JSON

6. **Backfill Function Works:**
   - Click "Embeddings genereren" button
   - Verify no CORS error in console
   - Verify function executes and shows results
   - Verify backfill counts update after completion

7. **No Console Errors:**
   - Check browser console for no 400 errors on `contact_embeddings` or `company_embeddings` queries
   - Verify all API calls return 200/204 status codes

## Dependencies

**Upstream:**
- `system_settings` table exists with proper schema
- `contact_embeddings` and `company_embeddings` tables exist with RLS policies
- Supabase Edge Functions runtime supports CORS
- Admin user has `sales.administrator = true`

**Downstream:**
- Edge Functions that use model settings (`match-lead`, `embed-entity`) will use new models
- Embedding generation functions must support all three embedding models

**Order of Operations:**
1. Fix RLS policies for embedding tables (if needed)
2. Fix backfill counts query
3. Fix prompt display issue
4. Fix CORS in backfill function
5. Add model selection dropdowns
6. Remove duplicaat column
7. Test all functionality

## Deliverables

### Code Changes

1. **`src/components/leads/LeadsListContent.tsx`:**
   - Remove the `<DataTable.Col label="Duplicaat">` section (lines 39-41)
   - Keep `DuplicateIndicator` component code for potential future use, but remove from table view

2. **`src/components/admin/MatchingSettingsPage.tsx`:**
   - Fix `loadBackfillCounts` function to handle RLS properly (use service role or adjust query)
   - Fix prompt display: Ensure `settings.promptContact` and `settings.promptCompany` are always strings (add type coercion if needed)
   - Replace model input fields with `<Select>` components (from shadcn/ui) for both embedding and scoring models
   - Add model options arrays:
     - Embedding: `["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002"]`
     - Scoring: `["gpt-4o-mini", "gpt-4o", "gpt-5-nano", "gpt-5-mini", "gtp-5.2"]`
   - Ensure `handleSave` properly serializes all values as strings before upsert
   - Add error handling for save failures with specific error messages

3. **`supabase/functions/backfill-embeddings/index.ts`:**
   - Verify CORS headers are correct (already present, but ensure they match request origin)
   - Ensure OPTIONS handler returns 204 with proper headers
   - Add error logging for debugging CORS issues
   - Verify authentication check (`getAdminSaleUser`) works correctly

4. **Database/RLS (if needed):**
   - Verify RLS policies on `contact_embeddings` and `company_embeddings` allow admin users to read counts
   - If needed, create a database function or view that aggregates counts with proper permissions
   - Alternative: Use service role in Edge Function to get counts, or create a separate endpoint

### Documentation Updates

1. **`docs/changelog.md`:**
   - Add entry under "Fixed" section with date:
     - Fixed matching settings page errors (backfill counts, prompt display, save functionality)
     - Fixed CORS error in backfill-embeddings Edge Function
     - Added support for additional AI models (GPT-5 variants, all embedding models)
     - Removed duplicaat column from leads table view
   - Add entry under "Changed" section:
     - Matching settings page now uses dropdown selects for model selection instead of text inputs

2. **`doc/src/content/docs/lead-management/changelog.mdx`:**
   - Add corresponding entries in MDX format

### Testing Checklist

- [ ] Duplicaat column removed from leads table
- [ ] Backfill counts load without errors
- [ ] Settings save successfully
- [ ] All models available in dropdowns
- [ ] Prompts display as text, not "[object Object]"
- [ ] Backfill function executes without CORS errors
- [ ] No console errors related to embeddings queries
- [ ] Model changes persist after page refresh

## Known Pitfalls / Edge Cases

1. **RLS Blocking Count Queries:**
   - The `contact_embeddings` and `company_embeddings` tables may have RLS policies that block direct count queries from the frontend
   - **Solution:** Create a database view or function that aggregates counts, or use an Edge Function endpoint to fetch counts with service role permissions

2. **Prompt Values as Objects:**
   - If prompts are stored as JSON in `system_settings.value`, they need to be parsed/stringified
   - **Solution:** Ensure `getSettingValue` always returns a string, and add `String()` coercion when loading prompts

3. **CORS Preflight Failure:**
   - The Edge Function may not be handling OPTIONS requests correctly
   - **Solution:** Verify CORS headers match the request origin, and ensure OPTIONS handler returns before authentication checks

4. **Model Dimension Mismatches:**
   - `text-embedding-3-large` uses 3072 dimensions, but schema expects 1536
   - **Solution:** Add warning in UI when user selects 3-large, but don't block selection. Document that schema migration is needed for full support.

5. **Typo in Model Name:**
   - User specified "gtp-5.2" which may be a typo
   - **Solution:** Implement as specified, but verify with user if this is correct model name

6. **Tasks Table Error (Separate Issue):**
   - Console shows errors about `sales_id` being UUID instead of bigint
   - **Note:** This is a separate issue not in scope, but document it for future fix

## Implementation Notes

1. **Model Selection UI:**
   - Use shadcn/ui `Select` component (already imported as `Select` from `@/components/ui/select`)
   - Create model option arrays as constants at top of component
   - Map options to `SelectItem` components

2. **Backfill Counts Fix:**
   - If RLS is the issue, consider creating a database function:
     ```sql
     CREATE OR REPLACE FUNCTION get_embedding_counts()
     RETURNS TABLE(contacts_missing bigint, companies_missing bigint)
     SECURITY DEFINER
     AS $$
     BEGIN
       RETURN QUERY
       SELECT 
         (SELECT COUNT(*) FROM contacts) - (SELECT COUNT(*) FROM contact_embeddings) as contacts_missing,
         (SELECT COUNT(*) FROM companies) - (SELECT COUNT(*) FROM company_embeddings) as companies_missing;
     END;
     $$ LANGUAGE plpgsql;
     ```
   - Or use an Edge Function endpoint that uses service role

3. **Prompt Display Fix:**
   - Add explicit string conversion when loading:
     ```typescript
     promptContact: String(getSettingValue(baseSettings, "matching.prompt.contact", "")),
     promptCompany: String(getSettingValue(baseSettings, "matching.prompt.company", "")),
     ```

4. **CORS Headers:**
   - Ensure `Access-Control-Allow-Origin` matches the frontend origin (or use `*` for development)
   - Include `Access-Control-Allow-Credentials: true` if using cookies/auth headers

## Success Metrics

- Zero errors in browser console when loading matching-settings page
- All settings save and persist correctly
- Backfill function executes successfully
- All requested models available for selection
- Prompts display and edit correctly
- Duplicaat column removed from leads view
