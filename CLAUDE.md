---
description:
alwaysApply: true
---

# Frontend V2 — Development Guidelines

## Stack

- Nuxt 4 + Nuxt UI v4 + VueUse + TanStack Table
- Backend: Fastify + PostgreSQL + Prisma — OpenAPI spec at `http://localhost:8000/docs/json`

## TypeScript Types

- Global API types: `app/types/api.d.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`
- Feature types: prefer `.d.ts` for pure types (auto-ambient, no import needed); use `.ts` only if the file has runtime code
- Never put interfaces inline in components
- To sync types with backend (requires backend running):
  `pnpm openapi-typescript http://localhost:8000/docs/json -o app/types/api-schema.ts`

---

## API Calls

### useApi

- `useApi()` only handles **401** (clears token + redirects `/login`)
- Does **not** show global error toast — each component handles its own

### Fetch pattern

| Context                    | Pattern                                   |
| -------------------------- | ----------------------------------------- |
| Pages (critical data, SSR) | `await useAsyncData(key, () => api(...))` |
| Child components / tabs    | `onMounted(async () => { ... })`          |

### Mutation pattern (POST / PUT / DELETE)

```ts
const loading = ref(false)

async function onSave() {
  loading.value = true
  try {
    await api('/endpoint', { method: 'POST', body: ... })
    toast.add({ title: 'Saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}
```

---

## Authentication

- Token + user stored in cookies via `useAuth()` — use this composable, do not access cookies directly
- Member routes (`/dashboard/**`): `definePageMeta({ middleware: 'auth' })`
- Admin routes (`/admin/**`): `definePageMeta({ middleware: ['auth', 'admin'] })`

---

## Loading States

- Single async op → `loading`
- Two or more concurrent ops → descriptive names: `isSavingTheme`, `isSavingTopic`
- Always reset in `finally`
- Bind: `:loading="loading" :disabled="loading"`

---

## Toast Messages

- **English only**
- Success: past-tense (`"Academy deleted"`, `"FAQ saved"`)
- Error: from server (`error?.data?.message ?? 'An error occurred'`)
- Validation: present-tense (`"Title is required"`)

---

## Performance & Hydration

- Prefix with `Lazy` to defer heavy component load: `<LazyHeavyTable />`
- Wrap browser-only code in `<ClientOnly>` — never access `window`/`localStorage` in `<script setup>`
- Use `useCookie()` not `localStorage` for SSR-safe persistence
- Use `shallowRef` for large lists/objects — Nuxt 4 defaults to shallow reactivity

---

## Composable Return Pattern

- Namespaced (`const foo = useFoo()`) → `return reactive({...})`
- Destructured (`const { x } = useFoo()`) → `return { x }` (plain object)

> Detail & example: read skill `project-preferences`

---

## Form Validation

- All Zod schemas in `app/schemas/` — one file per domain (`academy.ts`, `cohort.ts`, `user.ts`)
- Always use `UForm` + Zod — never manual `if (!form.field)` checks
- Cross-field validation (e.g. password confirm) via `.refine()`
- Schema `min()` / required fields must match backend Fastify schema constraints
- Modal serving two modes (create/edit): select schema via `computed` based on `mode` prop
- Save button in `#footer` (outside `<UForm>`): use `formRef?.submit()` pattern
- `UFormField` must have `name` attr matching the schema key for errors to display
- Zod v4 enum error syntax: `z.enum([...], { error: 'message' })` not `{ message: '...' }`

---

## Code Quality & Engineering Principles

- Deep clone: `structuredClone(obj)` not `JSON.parse(JSON.stringify(obj))`
- Shared constants → `app/utils/`; reusable stateful logic → `app/composables/`
- Shared form templates → separate component with `defineModel` + `defineExpose`
- Comments: remove obvious ones; keep only those explaining non-obvious _why_
- **DRY**: before writing new logic, check if a composable or util already covers it
- **YAGNI**: don't add features, abstractions, or config options not explicitly required
- **Single Responsibility**: one composable/component = one concern; split when a file grows large
- **TDD**: write test first for utils and composables — see `vitest-testing` skill

---

## Testing (Vitest only — no Playwright)

- Unit tests for pure utils and composables
- Component tests for critical UI logic
- `pnpm test` | `pnpm test:coverage`

---

## Skills & MCP Reference

| Task                                                 | Skill                     |
| ---------------------------------------------------- | ------------------------- |
| Nuxt routing, middleware, server routes, composables | `nuxt`                    |
| Nuxt UI components, forms, overlays, theming         | `nuxt-ui`                 |
| Vue 3 Composition API patterns                       | `vue`                     |
| VueUse composables                                   | `vueuse`                  |
| Data tables (sorting, pagination, filtering)         | `tanstack-table`          |
| Vitest unit/component tests                          | `vitest-testing`          |
| Hydration, performance, deployment                   | `nuxt-v4:nuxt-production` |
| API security, rate limiting, CORS                    | `api-security-hardening`  |

> If a task isn't covered above, check your installed skills before proceeding.

**Always use MCP tools when:**

- Using advanced or unfamiliar Nuxt features → `mcp__plugin_nuxt-v4_nuxt__*`
- Using non-common Nuxt UI components (DataTable, Dashboard layout, CommandPalette, etc.) → `mcp__plugin_nuxt-ui-v4_nuxt-ui__*`

---

## Response Summary Rule

**Setiap kali melakukan perubahan (apapun), berikan ringkasan di akhir response** yang mencakup:

- File apa yang diubah
- Apa yang diubah dan mengapa
- Jelaskan secara mendetail

---

## Verification

```bash
pnpm typecheck   # vue-tsc --noEmit
pnpm lint        # eslint app/**
pnpm test        # vitest
```
