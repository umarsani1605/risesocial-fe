<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

const { api } = useApi()
const toast = useToast()

const file = ref<File | null>(null)
const loading = ref(false)

watch(file, async (newFile) => {
  if (!newFile) return

  loading.value = true
  try {
    const fd = new FormData()
    fd.append('image', newFile)
    const res = await api<ApiResponse<{ url: string }>>('/admin/broadcasts/images', {
      method: 'POST',
      body: fd
    })

    const pos = props.getPos()
    if (typeof pos === 'number') {
      // Replace this upload-placeholder node with the actual image.
      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + 1 })
        .setImage({ src: res.data.url })
        .run()
    }
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      v-model="file"
      accept="image/*"
      label="Upload an image"
      description="PNG, JPG, WEBP or GIF (max. 5MB)"
      :preview="false"
      class="min-h-48"
    >
      <template #leading>
        <UAvatar
          :icon="loading ? 'i-lucide-loader-circle' : 'i-lucide-image'"
          size="xl"
          :ui="{ icon: [loading && 'animate-spin'] }"
        />
      </template>
    </UFileUpload>
  </NodeViewWrapper>
</template>
