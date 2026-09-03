# Layout Patterns

> **Version:** 1.0.0 | **Updated:** 2026-06-16
> **Purpose:** Pre-built JSX layout skeletons for the most common page types.
> Pick the matching pattern and fill in the slots — do not generate from scratch.

---

## RULE: Always pick a pattern before writing layout JSX.

If none match exactly, compose from multiple patterns. Never start from a blank `<div>`.

---

## Decomposition Note (read before using any pattern)

The JSX below shows the **full shape** of each pattern for reference only — it is **not** what the root `ui/<Name>.tsx` file should contain verbatim. Per the **Component-Generator** → Small Component Decomposition Rule:

- The outer wrapper `<div>` stays in the root `ui/<Name>.tsx` — it is the **composer**.
- Every bracketed block below (stat cards row, filter panel, step content, table block, form section, etc.) becomes its **own sub-component file** in the same `ui/` folder (e.g. `<Name>StatsRow.tsx`, `<Name>FilterPanel.tsx`, `<Name>Table.tsx`).
- Loading / error / empty / data branches for a data block belong **inside that block's sub-component**, not spread across the composer.
- Only pass the pattern's top-level slots (`labels`, `handlers`, `filters`, `data`, …) as props from the model into the composer; the composer forwards scoped props to each sub-component.

---

## Pattern 1 — List / Management Page

**When to use:** Admin list pages (users, tenants, roles, etc.)

**Suggested sub-components:** `<Name>Toolbar.tsx` (search/sort/filter), `<Name>Table.tsx` (loading/error/empty/data states + `DynamicTable` + `EPagination`). Root composer renders `HeaderPages` inline (single element, no decomposition needed) plus the two sub-components.

```
┌─────────────────────────────────────────┐
│ HeaderPages (title + subtitle + action) │
├─────────────────────────────────────────┤
│ TableHeader (search + sort + filter)    │
├─────────────────────────────────────────┤
│ DynamicTable                            │
│   └─ row × N (each row has link actions)│
├─────────────────────────────────────────┤
│ EPagination                             │
└─────────────────────────────────────────┘
```

```tsx
<div className="flex flex-col gap-6 p-6">
  <HeaderPages title={labels.title} subtitle={labels.subtitle}>
    <EButton variant="primary" onClick={handlers.onAddNew}>
      {labels.addNew}
    </EButton>
  </HeaderPages>

  <TableHeader
    searchValue={filters.search}
    onSearchChange={handlers.onSearch}
    searchPlaceholder={labels.searchPlaceholder}
    showSort={false}
    showFilter={false}
    showAction={false}
  />

  {/* Loading */}
  {isLoading && <SkeletonRows count={5} />}

  {/* Error */}
  {!isLoading && error && <ErrorRetry onRetry={refetch} />}

  {/* Empty */}
  {!isLoading && !error && data.length === 0 && (
    <EmptyState title={labels.empty} buttonLabel={labels.addNew} onButtonClick={handlers.onAddNew} />
  )}

  {/* Data */}
  {!isLoading && !error && data.length > 0 && (
    <>
      <DynamicTable columns={columns} data={data} keyExtractor={(r) => r.id} />
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <EPagination page={filters.page} count={totalPages} onChange={handlers.onPageChange} />
        </div>
      )}
    </>
  )}
</div>
```

---

## Pattern 2 — Detail / Single Page

**When to use:** `/entity/:id` — read-only or editable detail view.

**Suggested sub-components:** `<Name>StatsRow.tsx` (stat cards row), `<Name>InfoSection.tsx` (main content card + fields). See `src/widgets/personSingle/ui/` (`InfoCard.tsx`, `PersonInfoField.tsx`, `ActivityCard.tsx`) as the reference pattern.

```
┌─────────────────────────────────────────┐
│ Breadcrumb                              │
├─────────────────────────────────────────┤
│ HeaderPages (title + subtitle)          │
├──────────────┬──────────────────────────┤
│ Stat Cards   │                          │
│ (row of 3-4) │   Main content section   │
├──────────────┤   (card with sections)   │
│ Section card │                          │
└──────────────┴──────────────────────────┘
```

```tsx
<div className="flex flex-col gap-6 p-6">
  <Breadcrumb items={breadcrumbs} />

  <HeaderPages title={labels.title} subtitle={labels.subtitle}>
    <div className="flex gap-2">
      <EButton variant="outlined" onClick={handlers.onEdit}>
        {labels.edit}
      </EButton>
      <EButton variant="destructive" onClick={handlers.onDelete}>
        {labels.delete}
      </EButton>
    </div>
  </HeaderPages>

  {/* Stat cards row */}
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    {stats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>

  {/* Main content */}
  <div className="rounded-sm border-xs border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] p-6">
    <SectionHeader title={labels.infoSection} />
    {/* fields */}
  </div>
</div>
```

---

## Pattern 3 — Multi-Step Form Page

**When to use:** Create/onboarding flows with a stepper (createRole, createUser, etc.)

**Suggested sub-components:** each step already gets its own file (`StepOneContent.tsx`, `StepTwoContent.tsx`) — keep this. Add `<Name>StepActions.tsx` if the prev/next/submit row grows conditional logic. See `src/widgets/createRole/ui/` (`ResourcesPanel.tsx`, `EditingPanel.tsx`, `PermissionGuide.tsx`) as the reference pattern.

```
┌─────────────────────────────────────────┐
│ HeaderPages (title + subtitle)          │
├─────────────────────────────────────────┤
│ EStepper (steps + activeStep)           │
├─────────────────────────────────────────┤
│ Step content (varies per step)          │
├─────────────────────────────────────────┤
│ Prev · Next / Submit buttons            │
└─────────────────────────────────────────┘
```

```tsx
<div className="flex flex-col gap-6 p-6">
  <HeaderPages title={labels.title} subtitle={labels.subtitle} />

  <EStepper steps={steps} activeStep={activeStep} />

  <div className="rounded-sm border-xs border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] p-6">
    {activeStep === 0 && <StepOneContent {...stepProps} />}
    {activeStep === 1 && <StepTwoContent {...stepProps} />}
  </div>

  <div className="flex justify-between pt-2">
    <EButton variant="outlined" onClick={handlers.onBack} disabled={activeStep === 0}>
      {labels.back}
    </EButton>
    {activeStep < steps.length - 1 ? (
      <EButton variant="primary" onClick={handlers.onNext}>
        {labels.next}
      </EButton>
    ) : (
      <EButton variant="primary" onClick={handlers.onSubmit}>
        {labels.submit}
      </EButton>
    )}
  </div>
</div>
```

---

## Pattern 4 — Card Grid Page

**When to use:** Dashboard / overview pages with multiple stat cards and a table below.

**Suggested sub-components:** `<Name>StatsGrid.tsx` (stat cards), `<Name>Table.tsx` (`TableHeader` + `DynamicTable` block).

```
┌─────────────────────────────────────────┐
│ HeaderPages                             │
├──────┬──────┬──────┬──────┬────────────┤
│ Stat │ Stat │ Stat │ Stat │            │
├──────┴──────┴──────┴──────┴────────────┤
│ TableHeader + DynamicTable             │
└─────────────────────────────────────────┘
```

```tsx
<div className="flex flex-col gap-6 p-6">
  <HeaderPages title={labels.title} />

  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {stats.map((s) => (
      <StatCard key={s.label} value={s.value} label={s.label} icon={s.icon} iconBgClassName={s.iconBgClass} />
    ))}
  </div>

  <div className="rounded-sm border-xs border-[var(--color-border-default)] bg-[var(--color-bg-subtle)]">
    <TableHeader
      searchValue={filters.search}
      onSearchChange={handlers.onSearch}
      showAction={false}
      showSort={false}
      showFilter={false}
    />
    <DynamicTable columns={columns} data={data} keyExtractor={(r) => r.id} />
  </div>
</div>
```

---

## Pattern 5 — Form Section (inside a page, not a full page)

**When to use:** A section of a form with a label row and a grid of inputs.

**Suggested sub-component:** this whole pattern **is** a sub-component — name it `<Name><SectionTitle>.tsx` (e.g. `PersonBasicInfo.tsx`) and compose multiple of these inside the parent form's root `ui/<Name>.tsx`.

```tsx
<div className="flex flex-col gap-4">
  <SectionHeader title={labels.sectionTitle} />

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <ETextField
      label={labels.firstName}
      value={form.firstName}
      onValueChange={(v) => form.set("firstName", v)}
      required
      fullWidth
    />
    <ETextField
      label={labels.lastName}
      value={form.lastName}
      onValueChange={(v) => form.set("lastName", v)}
      required
      fullWidth
    />
    <ESelect
      label={labels.role}
      options={roleOptions}
      value={form.role}
      onValueChange={(v) => form.set("role", v)}
      fullWidth
    />
    <ETextField
      label={labels.email}
      value={form.email}
      onValueChange={(v) => form.set("email", v)}
      type="email"
      fullWidth
    />
  </div>
</div>
```

---

## Pattern 6 — Filter Sidebar + Table

**When to use:** Pages with a persistent left/right filter panel.

**Suggested sub-components:** `<Name>FilterPanel.tsx` (the `<aside>` block), `<Name>Table.tsx` (`TableHeader` + `DynamicTable` + `EPagination` block). Root composer lays out the two side by side.

```
┌────────────┬────────────────────────────┐
│  Filters   │  TableHeader + Table       │
│  (panel)   │                            │
│            │  DynamicTable              │
│            │                            │
│            │  EPagination               │
└────────────┴────────────────────────────┘
```

```tsx
<div className="flex gap-4 p-6">
  {/* Filter panel */}
  <aside className="w-64 shrink-0 rounded-sm border-xs border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] p-4">
    <SectionHeader title={labels.filters} />
    {/* filter fields */}
  </aside>

  {/* Main content */}
  <div className="flex flex-1 flex-col gap-4">
    <HeaderPages title={labels.title} />
    <TableHeader
      searchValue={filters.search}
      onSearchChange={handlers.onSearch}
      showSort={false}
      showFilter={false}
      showAction={false}
    />
    <DynamicTable columns={columns} data={data} keyExtractor={(r) => r.id} />
    {totalPages > 1 && (
      <div className="flex justify-center">
        <EPagination page={filters.page} count={totalPages} onChange={handlers.onPageChange} />
      </div>
    )}
  </div>
</div>
```

---

## Token Quick Reference (for layout)

| Need | Class |
|------|-------|
| Page outer padding | `p-6` |
| Vertical stack gap | `gap-6` (sections) · `gap-4` (fields) · `gap-2` (tight) |
| Card background | `bg-[var(--color-bg-subtle)]` |
| Card border | `border-xs border-[var(--color-border-default)]` |
| Card radius | `rounded-sm` |
| Section divider | `border-b border-xs border-[var(--color-border-subtle)]` |
| Muted bg (skeleton) | `bg-[var(--color-bg-muted)]` |
| 2-col grid | `grid grid-cols-1 gap-4 md:grid-cols-2` |
| 4-col stat row | `grid grid-cols-2 gap-4 lg:grid-cols-4` |
