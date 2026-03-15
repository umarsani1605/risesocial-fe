# Frontend V2 — Development Guidelines

## Stack
- Nuxt 4 + Nuxt UI v3
- TypeScript strict
- Auto-imports aktif: semua composables, components, utils, Vue APIs (`ref`, `computed`, `watch`, dll.) — tidak perlu import manual

## Project Structure
- `app/pages/` — halaman (SSR-aware)
- `app/components/admin/` — komponen admin, dikelompokkan per fitur
- `app/composables/` — shared stateful logic
- `app/utils/` — shared constants & pure functions
- `app/types/` — TypeScript types per fitur

---

## TypeScript Types

- Tiap fitur punya file tersendiri di `app/types/` (contoh: `academy.ts`, `jobs.ts`)
- Re-export dari `app/types/index.d.ts`:
  ```ts
  export type { Academy, AcademyForm, ... } from './academy'
  ```
- Jangan taruh interface inline di dalam component — pindah ke `app/types/`

---

## API Calls

### useApi
- `useApi()` hanya handle **401** (clear token + redirect `/login`)
- **Tidak** show global error toast — setiap komponen bertanggung jawab atas toastnya sendiri

### Fetch pattern
| Context | Pattern |
|---------|---------|
| Pages (data kritis, SSR) | `await useAsyncData(key, () => api(...))` |
| Child components / tabs | `onMounted(async () => { ... })` |

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

## Loading States

- **Single async op** per komponen → pakai nama `loading`
- **Dua atau lebih** concurrent ops → nama deskriptif per operasi:
  ```ts
  const isSavingTheme = ref(false)
  const isSavingTopic = ref(false)
  ```
- Selalu reset di `finally`
- Bind ke button: `:loading="loading" :disabled="loading"`

---

## Toast Messages

- **English only** — tidak ada Bahasa Indonesia
- Success: past-tense singkat (`"Academy deleted"`, `"FAQ saved"`)
- Error: dari server (`error?.data?.message ?? 'An error occurred'`)
- Validasi: present-tense (`"Title is required"`)

---

## Code Quality

- **Deep clone**: `structuredClone(obj)` — bukan `JSON.parse(JSON.stringify(obj))`
- **Shared constants** → `app/utils/` (contoh: `academyOptions.ts`)
- **Reusable stateful logic** → composable di `app/composables/` (contoh: `useImageUpload.ts`)
- **Shared form templates** → component terpisah dengan `defineModel` + `defineExpose`
- **Komentar**: hapus yang obvious; pertahankan yang menjelaskan *alasan* non-obvious

---

## Verification Commands

```bash
# Type check
node_modules/.bin/vue-tsc --noEmit

# Lint
./node_modules/.bin/eslint "app/**/*.vue" "app/**/*.ts"
```
