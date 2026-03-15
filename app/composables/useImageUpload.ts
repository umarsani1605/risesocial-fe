export function useImageUpload(initialUrl: string | null = null) {
  const file = ref<File | null>(null)
  const previewUrl = ref<string | null>(initialUrl)
  const inputRef = ref<HTMLInputElement | null>(null)

  function onChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]
    if (!f) return
    file.value = f
    previewUrl.value = URL.createObjectURL(f)
  }

  function remove() {
    file.value = null
    previewUrl.value = null
    if (inputRef.value) inputRef.value.value = ''
  }

  return { file, previewUrl, inputRef, onChange, remove }
}
