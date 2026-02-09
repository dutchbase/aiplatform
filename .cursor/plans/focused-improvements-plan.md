---
name: Focused Improvements Implementation Plan
overview: Detailed implementation plan for selected UX, accessibility, mobile responsiveness, and animation improvements to enhance the Lead Management CRM.
todos:
  - id: bulk-operations
    content: Implement bulk selection and operations (status change, assignment) in leads list and kanban views
    status: pending
  - id: smart-notifications
    content: Add visual urgency indicators, smart alerts, and follow-up reminders with toast notifications
    status: pending
  - id: advanced-search
    content: Implement saved searches, filter presets, and enhanced search capabilities
    status: pending
  - id: skeleton-loaders
    content: Replace all loading states with skeleton screens matching final layouts
    status: pending
  - id: error-handling
    content: Improve error messages, add retry mechanisms, and implement error boundaries
    status: pending
  - id: accessibility
    content: Enhance keyboard navigation, ARIA labels, focus management, and color contrast
    status: pending
  - id: mobile-responsive
    content: Optimize all views for mobile with touch targets, responsive layouts, and mobile navigation
    status: pending
  - id: form-improvements
    content: Add inline validation, smart defaults, auto-save, and better date pickers
    status: pending
  - id: micro-interactions
    content: Enhance button, card, and form micro-interactions with better feedback
    status: pending
  - id: modal-transitions
    content: Add staggered content animations to modals and smooth page transitions
    status: pending
  - id: status-animations
    content: Improve Kanban drag-and-drop animations and status change feedback
    status: pending
  - id: loading-animations
    content: Enhance skeleton pulse, add progress indicators, and staggered loading
    status: pending
  - id: notification-animations
    content: Enhance toast notifications with better entrance animations
    status: pending
  - id: list-animations
    content: Add staggered fade-in for list items and smooth filter transitions
    status: pending
  - id: feedback-animations
    content: Add success/error state animations with visual feedback
    status: pending
isProject: false
---

# Focused Improvements Implementation Plan

## Overview

This plan details the implementation of selected improvements across three key areas:
1. **Product Features**: Bulk operations, smart notifications, advanced search
2. **UI/UX Enhancements**: Loading states, error handling, accessibility, mobile responsiveness, forms
3. **Animation Improvements**: Micro-interactions, transitions, status changes, loading, notifications, lists, feedback

---

## 1. Product Features

### 1.1 Quick Actions & Bulk Operations

**Goal**: Enable users to process multiple leads simultaneously, dramatically improving efficiency.

#### Implementation Details

**1.1.1 Bulk Selection UI**

**File**: `src/components/leads/LeadsListContent.tsx`

- Add checkbox column as first column in table
- Add "Select All" checkbox in table header
- Track selected lead IDs in component state
- Show count of selected items: "X leads selected"
- Visual feedback: Highlight selected rows with subtle background color

**Code Structure**:
```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedIds(new Set(allLeadIds));
  } else {
    setSelectedIds(new Set());
  }
};

const handleSelectOne = (id: string, checked: boolean) => {
  const newSet = new Set(selectedIds);
  if (checked) {
    newSet.add(id);
  } else {
    newSet.delete(id);
  }
  setSelectedIds(newSet);
};
```

**1.1.2 Bulk Actions Bar**

**New File**: `src/components/leads/BulkActionsBar.tsx`

- Appears when 1+ leads are selected
- Fixed position at bottom of viewport (mobile: full-width, desktop: floating)
- Actions:
  - **Change Status**: Opens dialog with status dropdown
  - **Assign to Customer**: Opens customer selection dialog
  - **Assign to Sales User**: Opens user selection dialog
  - **Add Note**: Opens note dialog (applies to all selected)
  - **Mark as Duplicate**: Bulk duplicate marking
  - **Delete**: Confirmation dialog, soft delete
- Shows progress indicator during bulk operations
- Displays success/error notifications per operation

**Design**:
- Mobile: Full-width bottom sheet
- Desktop: Floating bar above table
- Smooth slide-up animation (200ms ease-out)
- Backdrop blur when active

**1.1.3 Kanban Bulk Selection**

**File**: `src/components/leads/LeadsKanbanContent.tsx`

- Add "Select Mode" toggle button in header
- When enabled:
  - Cards show checkbox in top-right corner
  - Clicking card toggles selection (instead of opening modal)
  - Selected cards have border highlight
  - Bulk actions bar appears
- Exit select mode: Click "Done" or press Escape

**1.1.4 Keyboard Shortcuts**

**New File**: `src/hooks/useKeyboardShortcuts.ts`

- `Ctrl/Cmd + A`: Select all visible leads
- `Ctrl/Cmd + D`: Deselect all
- `Escape`: Exit selection mode, close modals
- `Delete`: Delete selected leads (with confirmation)
- `s`: Open status change dialog for selected
- `n`: Open note dialog for selected
- `f`: Open feedback dialog for selected

**Implementation**:
- Use `useEffect` with keyboard event listeners
- Only active when not typing in inputs
- Show toast with available shortcuts on `?` key

**1.1.5 Bulk Operations Backend**

**New File**: `src/lib/leads/bulk-operations.ts`

Functions:
- `bulkUpdateStatus(leadIds: string[], newStatus: LeadStatus, reason?: string)`
- `bulkAssignCustomer(leadIds: string[], customerId: string)`
- `bulkAssignSalesUser(leadIds: string[], userId: number)`
- `bulkAddNote(leadIds: string[], noteText: string, isUrgent: boolean)`
- `bulkMarkDuplicate(leadIds: string[], originalLeadId: string)`

All functions:
- Use Supabase batch operations where possible
- Create activity log entries for each lead
- Return success/failure counts
- Handle partial failures gracefully

**Files to Create/Modify**:
- `src/components/leads/BulkActionsBar.tsx` (NEW)
- `src/components/leads/BulkStatusDialog.tsx` (NEW)
- `src/components/leads/BulkAssignDialog.tsx` (NEW)
- `src/components/leads/LeadsListContent.tsx` (MODIFY)
- `src/components/leads/LeadsKanbanContent.tsx` (MODIFY)
- `src/hooks/useKeyboardShortcuts.ts` (NEW)
- `src/lib/leads/bulk-operations.ts` (NEW)

---

### 1.2 Smart Notifications & Alerts

**Goal**: Proactively alert users to time-sensitive leads and important events.

#### Implementation Details

**1.2.1 Visual Urgency Indicators**

**New File**: `src/components/leads/UrgencyIndicator.tsx`

- Calculate urgency based on:
  - Time in current status (>24h = yellow, >48h = orange, >72h = red)
  - Lead age (newer = higher priority)
  - Status type (final states = no urgency)
- Display as:
  - Colored border on Kanban cards
  - Badge in list view
  - Progress bar showing time in status
- Color coding:
  - Green: < 24h (normal)
  - Yellow: 24-48h (attention needed)
  - Orange: 48-72h (urgent)
  - Red: > 72h (critical)

**1.2.2 Smart Alert System**

**New File**: `src/hooks/useLeadAlerts.ts`

- Poll for leads needing attention (every 5 minutes when tab active)
- Check conditions:
  - Leads assigned to current user in status > 24h
  - Leads approaching SLA thresholds
  - New leads assigned to user
- Show toast notifications:
  - "3 leads need your attention"
  - "Lead 'X' has been in status for 48 hours"
- Click notification → Navigate to lead or filtered view

**1.2.3 Follow-up Reminders**

**Integration**: Extend existing `getLeadsNeedingFollowUp()`

- Add visual indicator in header (bell icon with count)
- Dropdown showing:
  - List of leads needing follow-up
  - Time in status for each
  - Quick action: "Mark as reviewed"
- Auto-refresh every 5 minutes

**1.2.4 Activity Feed Component**

**New File**: `src/components/notifications/ActivityFeed.tsx`

- Real-time activity stream (using Supabase realtime subscriptions)
- Shows:
  - Status changes
  - New leads assigned to user
  - Webhook events (admin only)
  - Notes/feedback added
- Grouped by time (Today, Yesterday, This Week)
- Click to navigate to lead
- Mark as read functionality

**Files to Create/Modify**:
- `src/components/leads/UrgencyIndicator.tsx` (NEW)
- `src/hooks/useLeadAlerts.ts` (NEW)
- `src/components/notifications/ActivityFeed.tsx` (NEW)
- `src/components/notifications/NotificationBell.tsx` (NEW)
- `src/components/atomic-crm/layout/Header.tsx` (MODIFY - add notification bell)
- `src/lib/leads/follow-up.ts` (MODIFY - enhance with alert logic)

---

### 1.4 Advanced Search & Filtering

**Goal**: Enable users to quickly find leads with powerful search and saved filter combinations.

#### Implementation Details

**1.4.1 Saved Searches**

**New File**: `src/components/leads/SavedSearches.tsx`

- Dropdown in filter bar: "Saved Searches"
- Save current filter combination:
  - Name: "My Urgent Leads"
  - Description (optional)
  - Icon/color (optional)
- Load saved search: Applies all filters instantly
- Edit/Delete saved searches
- Store in `system_settings` table as JSON

**Database Schema** (add to system_settings):
```typescript
{
  key: 'saved_searches',
  value: JSON.stringify([
    {
      id: 'uuid',
      name: 'My Urgent Leads',
      filters: { status: 'nieuw', is_urgent: true },
      created_at: 'timestamp',
      created_by: 'user_id'
    }
  ])
}
```

**1.4.2 Filter Presets**

**File**: `src/components/leads/LeadsListFilter.tsx`

- Add preset buttons above filters:
  - "My Leads" (assigned to me)
  - "Needs Follow-up" (needs_followup = true)
  - "Urgent" (is_urgent = true)
  - "New Today" (created today)
  - "This Week" (created this week)
- Click preset → Apply filters instantly
- Visual indicator when preset is active
- Custom presets via saved searches

**1.4.3 Enhanced Search Input**

**File**: `src/components/leads/LeadsListFilter.tsx`

- Add search suggestions dropdown:
  - Recent searches (last 5)
  - Common searches
  - Autocomplete for filter values
- Search syntax support:
  - `status:nieuw` → Filter by status
  - `branche:hypotheken` → Filter by branche
  - `created:>2026-01-01` → Date range
  - `has:feedback` → Has feedback
  - `has:note` → Has notes
- Parse query and apply filters automatically
- Show search history (stored in localStorage)

**1.4.4 Quick Filters Bar**

**New Component**: Quick filter chips above table

- Show active filters as removable chips
- "Clear all" button
- Filter count badge
- Smooth animations when adding/removing

**Files to Create/Modify**:
- `src/components/leads/SavedSearches.tsx` (NEW)
- `src/components/leads/FilterPresets.tsx` (NEW)
- `src/components/leads/QuickFilterChips.tsx` (NEW)
- `src/components/leads/LeadsListFilter.tsx` (MODIFY)
- `src/lib/leads/search-parser.ts` (NEW - parse search syntax)

---

## 2. UI/UX Improvements

### 2.1 Loading States & Skeleton Screens

**Goal**: Replace all "Loading..." text with skeleton screens that match final layouts.

#### Implementation Details

**2.1.1 Skeleton Components**

**New File**: `src/components/ui/skeleton-lead-card.tsx`
```typescript
export const SkeletonLeadCard = () => (
  <Card className="py-3">
    <CardContent className="px-3 space-y-2">
      <Skeleton className="h-4 w-3/4" /> {/* Title */}
      <Skeleton className="h-3 w-1/2" /> {/* Meta */}
      <Skeleton className="h-3 w-full" /> {/* Description line 1 */}
      <Skeleton className="h-3 w-2/3" /> {/* Description line 2 */}
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" /> {/* Badge */}
        <Skeleton className="h-5 w-16" /> {/* Badge */}
      </div>
    </CardContent>
  </Card>
);
```

**New File**: `src/components/ui/skeleton-table.tsx`
- Skeleton rows matching table structure
- Animated pulse effect (already in Skeleton component)
- Show 5-10 skeleton rows

**New File**: `src/components/ui/skeleton-dashboard-widget.tsx`
- Skeleton for chart widgets
- Skeleton bars matching chart height
- Skeleton for card headers

**2.1.2 Progressive Loading**

- Load critical data first (lead list)
- Load secondary data after (counts, charts)
- Show partial skeletons for partially loaded data

**2.1.3 Optimistic Updates**

- Update UI immediately on user actions
- Show loading state on affected elements
- Revert on error, confirm on success

**Files to Create/Modify**:
- `src/components/ui/skeleton-lead-card.tsx` (NEW)
- `src/components/ui/skeleton-table.tsx` (NEW)
- `src/components/ui/skeleton-dashboard-widget.tsx` (NEW)
- `src/components/leads/LeadsListContent.tsx` (MODIFY - use skeletons)
- `src/components/leads/LeadsKanbanContent.tsx` (MODIFY - use skeletons)
- `src/components/leads/LeadDetailView.tsx` (MODIFY - use skeletons)
- `src/components/dashboard/*.tsx` (MODIFY - use skeletons)
- `src/components/ui/skeleton.tsx` (MODIFY - enhance pulse animation)

---

### 2.3 Error Handling & Recovery

**Goal**: Provide clear, actionable error messages with retry capabilities.

#### Implementation Details

**2.3.1 Error Boundary**

**New File**: `src/components/ui/ErrorBoundary.tsx`

- Wrap main app sections
- Catch React errors gracefully
- Display user-friendly error message
- "Reload Page" button
- Log errors to console (and optionally to service)

**2.3.2 Error Display Component**

**New File**: `src/components/ui/ErrorDisplay.tsx`

- Consistent error UI across app
- Props:
  - `error: Error | string`
  - `onRetry?: () => void`
  - `title?: string`
- Shows:
  - Error icon
  - User-friendly message
  - Technical details (collapsible, for debugging)
  - Retry button (if onRetry provided)
  - "Report Issue" link (optional)

**2.3.3 Retry Mechanisms**

- Add retry buttons to all async operations:
  - Failed API calls
  - Failed webhook calls
  - Failed file uploads
- Exponential backoff for retries
- Max 3 retries before showing permanent error

**2.3.4 User-Friendly Error Messages**

- Map technical errors to user-friendly messages:
  - "Network error" → "Kan geen verbinding maken. Controleer je internetverbinding."
  - "Permission denied" → "Je hebt geen toestemming voor deze actie."
  - "Not found" → "Lead niet gevonden. Mogelijk verwijderd."
- Show actionable next steps

**Files to Create/Modify**:
- `src/components/ui/ErrorBoundary.tsx` (NEW)
- `src/components/ui/ErrorDisplay.tsx` (NEW)
- `src/components/leads/LeadDetailView.tsx` (MODIFY - use ErrorDisplay)
- `src/components/leads/LeadsListContent.tsx` (MODIFY - use ErrorDisplay)
- All components with error states (MODIFY)

---

### 2.4 Accessibility Improvements

**Goal**: Ensure the application is fully accessible to all users.

#### Implementation Details

**2.4.1 Keyboard Navigation**

- **Tab Order**: Logical, sequential tab order
- **Skip Links**: "Skip to main content" link (visible on focus)
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Shortcuts**: Document and ensure consistent
- **Modal Focus Trap**: Trap focus within modals
- **Escape to Close**: All modals/dialogs close on Escape

**2.4.2 ARIA Labels & Descriptions**

- Add `aria-label` to all icon-only buttons
- Add `aria-describedby` for form fields with help text
- Add `aria-live` regions for dynamic content updates
- Add `role` attributes where needed
- Ensure all images have `alt` text

**2.4.3 Screen Reader Support**

- Semantic HTML (use proper headings, lists, etc.)
- `aria-expanded` for collapsible sections
- `aria-selected` for selected items
- `aria-busy` for loading states
- Announce status changes to screen readers

**2.4.4 Color Contrast**

- Audit all text/background combinations
- Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Don't rely solely on color to convey information
- Add icons/symbols alongside color coding

**2.4.5 Focus Management**

- Return focus to trigger after closing modals
- Focus first element when opening modals
- Maintain focus state during page transitions
- Visible focus indicators (already partially implemented)

**Files to Modify**:
- All interactive components (`src/components/ui/*.tsx`)
- `src/components/leads/*.tsx` (add ARIA attributes)
- `src/components/atomic-crm/layout/Layout.tsx` (add skip link)
- `src/index.css` (ensure focus styles are visible)

---

### 2.5 Mobile Responsiveness (VERY IMPORTANT)

**Goal**: Optimize the entire application for mobile devices with touch-friendly interfaces.

#### Implementation Details

**2.5.1 Touch Targets**

- Ensure all interactive elements are minimum 44x44px
- Increase padding on buttons for mobile
- Add touch-friendly spacing between clickable elements
- Test on actual mobile devices

**2.5.2 Responsive Layouts**

**Kanban View** (`src/components/leads/LeadsKanbanContent.tsx`):
- **Mobile (< 768px)**:
  - Horizontal scroll for columns (instead of grid)
  - Column width: 280px minimum
  - Card width: full width of column
  - Swipe gestures for status change (optional)
- **Tablet (768px - 1024px)**:
  - 2 columns visible
  - Horizontal scroll for more
- **Desktop (> 1024px)**:
  - All columns visible (current behavior)

**List View** (`src/components/leads/LeadsListContent.tsx`):
- **Mobile**:
  - Stack table columns vertically
  - Card-based layout instead of table
  - Swipe actions: Swipe left for actions menu
- **Desktop**: Current table layout

**2.5.3 Mobile Navigation**

**File**: `src/components/atomic-crm/layout/Layout.tsx`

- **Sidebar**:
  - Collapsible on mobile (hamburger menu)
  - Overlay on mobile (not push content)
  - Close on navigation
- **Bottom Navigation** (Mobile only):
  - Fixed bottom bar with main actions
  - Icons: Home, Leads, Dashboard, Settings
  - Badge indicators for counts

**2.5.4 Mobile-Optimized Forms**

- Full-width inputs on mobile
- Larger touch targets (min 44px height)
- Native date pickers on mobile
- Better keyboard types (email, tel, etc.)
- "Done" button in keyboard toolbar

**2.5.5 Mobile Lead Detail Modal**

**File**: `src/components/leads/lead-detail-modal.tsx`

- **Mobile**:
  - Full-screen modal (not centered)
  - Swipe down to close
  - Bottom sheet style
  - Larger action buttons
  - Stack tabs vertically or use bottom tab bar

**2.5.6 Mobile-Specific Components**

**New File**: `src/components/leads/MobileLeadCard.tsx`

- Card layout optimized for mobile
- Larger text
- Touch-friendly spacing
- Swipe actions
- Quick action buttons

**2.5.7 Responsive Breakpoints**

Use Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Files to Create/Modify**:
- `src/components/leads/MobileLeadCard.tsx` (NEW)
- `src/components/leads/LeadsKanbanContent.tsx` (MODIFY - responsive)
- `src/components/leads/LeadsListContent.tsx` (MODIFY - mobile layout)
- `src/components/leads/lead-detail-modal.tsx` (MODIFY - mobile fullscreen)
- `src/components/atomic-crm/layout/Layout.tsx` (MODIFY - mobile sidebar)
- `src/components/atomic-crm/layout/Header.tsx` (MODIFY - mobile menu)
- `src/components/ui/button.tsx` (MODIFY - larger on mobile)
- All form components (MODIFY - mobile optimization)

---

### 2.7 Form Improvements

**Goal**: Make forms more intuitive, faster to complete, and less error-prone.

#### Implementation Details

**2.7.1 Inline Validation**

**File**: `src/components/ui/input.tsx`

- Show validation errors as user types (after blur or after 500ms delay)
- Error message appears below field
- Red border on invalid fields
- Green checkmark on valid fields
- Smooth slide-in animation for error messages

**Implementation**:
```typescript
// Use react-hook-form with real-time validation
const { register, formState: { errors } } = useForm();

<Input
  {...register('email', {
    required: 'Email is verplicht',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Ongeldig email adres'
    }
  })}
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" className="text-sm text-destructive mt-1 animate-in slide-in-from-top-1">
    {errors.email.message}
  </p>
)}
```

**2.7.2 Smart Defaults**

- Pre-fill fields based on context:
  - If creating lead from customer → pre-fill customer
  - If creating from contact → pre-fill contact
  - Default status based on user role
  - Default branche based on recent selections
- Store user preferences in localStorage

**2.7.3 Auto-save**

- Auto-save form drafts every 30 seconds
- Store in localStorage with key: `lead-draft-${leadId || 'new'}`
- Restore draft on page load
- Show "Draft saved" indicator
- Clear draft on successful submit

**2.7.4 Field Dependencies**

- Show/hide fields based on selections:
  - If status = "verkocht" → show "verkoopdatum" field
  - If is_duplicate = true → show "original_lead_id" field
- Smooth slide-down animation when showing
- Smooth slide-up when hiding

**2.7.5 Better Date Pickers**

- Use native date picker on mobile
- Custom calendar on desktop
- Keyboard input support
- Date range validation
- Relative dates: "Today", "Tomorrow", "Next Week"

**Files to Modify**:
- `src/components/leads/LeadCreate.tsx` (MODIFY - add validation, auto-save)
- `src/components/leads/LeadEdit.tsx` (MODIFY - add validation, auto-save)
- `src/components/leads/StatusChangeDialog.tsx` (MODIFY - inline validation)
- `src/components/ui/input.tsx` (MODIFY - add error state styling)
- `src/components/ui/date-picker.tsx` (NEW or MODIFY existing)

---

## 3. Animation Enhancements

### 3.1 Micro-Interactions

**Goal**: Add subtle, purposeful animations that provide immediate feedback.

#### Implementation Details

**3.1.1 Button Interactions**

**File**: `src/components/ui/button.tsx`

- **Press Feedback**: 
  - Current: `active:translate-y-[1px]`
  - Enhance: Add scale (0.98) for more pronounced feedback
  - Duration: 100ms
- **Loading States**:
  - Smooth fade-in for spinner
  - Disable button during loading
  - Show loading text if provided
- **Success States**:
  - Brief checkmark animation (300ms)
  - Green flash (200ms)
  - Then return to normal

**Code**:
```typescript
className={cn(
  "motion-safe:transition-all motion-safe:duration-100",
  "active:scale-[0.98] active:translate-y-[1px]",
  isLoading && "opacity-70 cursor-not-allowed"
)}
```

**3.1.2 Card Interactions**

**File**: `src/components/leads/LeadKanbanCard.tsx`

- **Hover Lift**: 
  - Current: `hover:-translate-y-0.5`
  - Enhance: Add shadow increase, scale slightly (1.02)
  - Duration: 200ms ease-out
- **Click Ripple**: 
  - Subtle ripple effect on click (optional, use CSS)
  - Or use scale animation

**Code**:
```typescript
className={cn(
  "motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
  "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md",
  "active:scale-[0.98]"
)}
```

**3.1.3 Form Interactions**

**File**: `src/components/ui/input.tsx`

- **Focus Ring**: 
  - Animated ring expansion on focus
  - Use `focus-visible:ring-[3px]` with transition
- **Validation Feedback**:
  - Slide-in error messages (from top, 200ms)
  - Shake animation for errors (optional, subtle)
  - Green checkmark fade-in for valid fields

**Files to Modify**:
- `src/components/ui/button.tsx` (MODIFY)
- `src/components/leads/LeadKanbanCard.tsx` (MODIFY)
- `src/components/ui/input.tsx` (MODIFY)
- `src/components/ui/select.tsx` (MODIFY - add focus animations)

---

### 3.2 Page & Modal Transitions

**Goal**: Create smooth, professional transitions between views and modals.

#### Implementation Details

**3.2.1 Modal Staggered Content**

**File**: `src/components/leads/lead-detail-modal.tsx`

- Animate content in sequence:
  1. Backdrop fade-in (200ms)
  2. Modal container scale + fade (200ms, delay 50ms)
  3. Header fade-in (200ms, delay 100ms)
  4. Body content fade-in (200ms, delay 150ms)
  5. Actions fade-in (200ms, delay 200ms)

**Implementation**:
```typescript
// Use CSS animations with delays
<div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
  <DialogHeader className="animate-in fade-in-0 delay-100">
    {/* Header content */}
  </DialogHeader>
  <div className="animate-in fade-in-0 delay-150">
    {/* Body content */}
  </div>
</div>
```

**3.2.2 Page Transitions**

**File**: Router configuration

- Fade between routes (300ms)
- Use React Router's location for transition detection
- Animate out old content, animate in new content

**3.2.3 List Updates**

- Animate new items appearing in lists
- Staggered fade-in (50ms delay between items)
- Smooth removal animation (fade-out + slide-up)

**Files to Modify**:
- `src/components/leads/lead-detail-modal.tsx` (MODIFY)
- `src/components/ui/dialog.tsx` (MODIFY - enhance animations)
- Router configuration (MODIFY - add transitions)
- `src/index.css` (ADD - animation utilities)

---

### 3.3 Status Change Animations

**Goal**: Provide clear visual feedback when leads change status.

#### Implementation Details

**3.3.1 Kanban Drag Feedback**

**File**: `src/components/leads/LeadsKanbanContent.tsx`

- **During Drag**:
  - Smooth card movement (already handled by @hello-pangea/dnd)
  - Highlight target column with border + background tint
  - Show drop indicator line
- **On Drop**:
  - Success animation: Brief green flash on card
  - Card animates to new position smoothly
  - Column updates with smooth transition

**3.3.2 Status Badge Transitions**

**File**: `src/components/leads/LeadsListContent.tsx` (StatusField)

- When status changes:
  - Old badge fades out (150ms)
  - New badge fades in (150ms, delay 150ms)
  - Color transition on badge background

**3.3.3 Timeline Updates**

**File**: `src/components/leads/LeadTimeline.tsx`

- New timeline items:
  - Slide in from left (300ms)
  - Fade in simultaneously
  - Staggered delay (50ms per item)

**Files to Modify**:
- `src/components/leads/LeadsKanbanContent.tsx` (MODIFY)
- `src/components/leads/LeadsListContent.tsx` (MODIFY - StatusField)
- `src/components/leads/LeadTimeline.tsx` (MODIFY)

---

### 3.4 Loading Animations

**Goal**: Make loading states feel faster and more engaging.

#### Implementation Details

**3.4.1 Skeleton Pulse**

**File**: `src/components/ui/skeleton.tsx`

- Enhance existing pulse animation
- Smooth, continuous pulse
- Duration: 2s, infinite
- Easing: ease-in-out

**3.4.2 Progress Indicators**

**New File**: `src/components/ui/ProgressBar.tsx`

- Animated progress bar for long operations
- Smooth fill animation
- Percentage display
- Use for bulk operations

**3.4.3 Staggered Loading**

- List items appear sequentially
- 50ms delay between each item
- Creates sense of progress

**Files to Create/Modify**:
- `src/components/ui/ProgressBar.tsx` (NEW)
- `src/components/ui/skeleton.tsx` (MODIFY - enhance pulse)
- `src/components/leads/BulkActionsBar.tsx` (MODIFY - use ProgressBar)

---

### 3.5 Notification Animations

**Goal**: Make notifications more noticeable and delightful.

#### Implementation Details

**3.5.1 Toast Entrance**

**File**: `src/components/ui/sonner.tsx`

- Customize Sonner animations:
  - Slide in from top (300ms, ease-out)
  - Slight bounce on arrival (optional, subtle)
  - Fade in simultaneously

**3.5.2 Success Celebrations**

- Brief confetti for major successes (optional, can be disabled)
- Or use checkmark animation with scale
- Duration: 500ms max

**3.5.3 Error Shake**

- Subtle shake animation for errors
- 3-4 quick horizontal movements
- Duration: 300ms

**Files to Modify**:
- `src/components/ui/sonner.tsx` (MODIFY - customize animations)
- `src/index.css` (ADD - notification animation utilities)

---

### 3.7 List & Grid Animations

**Goal**: Smooth, professional animations for list updates.

#### Implementation Details

**3.7.1 List Item Entrance**

**File**: `src/components/leads/LeadsListContent.tsx`

- New items: Fade in + slide up (300ms)
- Staggered: 50ms delay between items
- Use CSS animations or Framer Motion

**3.7.2 Filter Transitions**

- Smooth transition when filters change
- Fade out old results (200ms)
- Fade in new results (200ms, delay 200ms)
- Show loading skeleton during transition

**3.7.3 Reorder Animation**

- Smooth animation when items reorder
- Use transform for performance
- Duration: 300ms

**Files to Modify**:
- `src/components/leads/LeadsListContent.tsx` (MODIFY)
- `src/components/leads/LeadsKanbanContent.tsx` (MODIFY)

---

### 3.8 Feedback Animations

**Goal**: Clear visual feedback for all user actions.

#### Implementation Details

**3.8.1 Success States**

- Brief green flash (200ms)
- Checkmark icon with scale animation
- Fade out smoothly

**3.8.2 Error States**

- Red flash (200ms)
- Error icon with shake
- Persistent until user dismisses

**3.8.3 Loading States**

- Smooth spinner transitions
- Fade in/out (200ms)

**3.8.4 Empty States**

- Gentle fade-in for illustrations (400ms)
- Staggered text appearance

**Files to Modify**:
- All components with success/error states
- `src/components/ui/EmptyState.tsx` (when created)

---

## 4. Implementation Order

### Phase 1: Foundation (Week 1)
1. Skeleton loaders
2. Error handling & boundaries
3. Basic accessibility improvements
4. Mobile responsive layouts (critical)

### Phase 2: Features (Week 2)
1. Bulk operations
2. Smart notifications
3. Advanced search & filtering

### Phase 3: Polish (Week 3)
1. Form improvements
2. All animations
3. Final accessibility audit

---

## 5. Technical Notes

### Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Test on lower-end devices

### Accessibility
- All animations respect `prefers-reduced-motion`
- Provide static alternatives
- Don't rely on animations for critical information

### Mobile Considerations
- Reduce animation complexity on mobile
- Test touch interactions thoroughly
- Ensure 60fps performance

---

## 6. Files Summary

### New Files (25)
- `src/components/leads/BulkActionsBar.tsx`
- `src/components/leads/BulkStatusDialog.tsx`
- `src/components/leads/BulkAssignDialog.tsx`
- `src/components/leads/UrgencyIndicator.tsx`
- `src/components/notifications/ActivityFeed.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/leads/SavedSearches.tsx`
- `src/components/leads/FilterPresets.tsx`
- `src/components/leads/QuickFilterChips.tsx`
- `src/components/ui/skeleton-lead-card.tsx`
- `src/components/ui/skeleton-table.tsx`
- `src/components/ui/skeleton-dashboard-widget.tsx`
- `src/components/ui/ErrorBoundary.tsx`
- `src/components/ui/ErrorDisplay.tsx`
- `src/components/ui/ProgressBar.tsx`
- `src/components/leads/MobileLeadCard.tsx`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/hooks/useLeadAlerts.ts`
- `src/lib/leads/bulk-operations.ts`
- `src/lib/leads/search-parser.ts`

### Modified Files (20+)
- All lead components
- All UI components
- Layout components
- Form components
- Dashboard components

---

This plan provides detailed, actionable specifications for implementing all selected improvements.
