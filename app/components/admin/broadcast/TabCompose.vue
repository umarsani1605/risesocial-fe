<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'
import { TextAlign } from '@tiptap/extension-text-align'
import { CtaButton } from './CtaButtonExtension'
import { ImageUpload } from './EditorImageUploadExtension'

const emit = defineEmits<{ sent: [] }>()

const { canEdit } = useAdminPermission('admin.broadcast')
const compose = useAdminBroadcastCompose()
const formRef = useTemplateRef('formRef')

onMounted(() => {
  compose.loadSenders()
  compose.loadSegmentCounts()
})

const editorExtensions = [
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  CtaButton,
  ImageUpload
]

// The Editor component does not forward `onCreate`, so the editor instance is
// captured from a toolbar handler (which always receives a valid editor).
let activeEditor: Editor | undefined

// CTA button modal state.
const ctaOpen = ref(false)
const ctaLabel = ref('')
const ctaHref = ref('')

function openCtaModal() {
  ctaLabel.value = ''
  ctaHref.value = ''
  ctaOpen.value = true
}

function confirmCta() {
  const label = ctaLabel.value.trim()
  const href = ctaHref.value.trim()
  if (activeEditor && label && href) {
    activeEditor.chain().focus().setCtaButton({ label, href }).run()
  }
  ctaOpen.value = false
}

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  ctaButton: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      activeEditor = editor
      openCtaModal()
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const toolbarItems = [
  [
    { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', tooltip: { text: 'Heading 1' } },
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'Heading 2' } },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', tooltip: { text: 'Heading 3' } }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Bullet list' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Numbered list' } }
  ],
  [
    {
      kind: 'textAlign',
      align: 'left',
      icon: 'i-lucide-align-left',
      tooltip: { text: 'Align left' }
    },
    {
      kind: 'textAlign',
      align: 'center',
      icon: 'i-lucide-align-center',
      tooltip: { text: 'Align center' }
    },
    {
      kind: 'textAlign',
      align: 'right',
      icon: 'i-lucide-align-right',
      tooltip: { text: 'Align right' }
    }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Link' } },
    { kind: 'ctaButton', icon: 'i-lucide-mouse-pointer-click', tooltip: { text: 'Insert button' } },
    { kind: 'imageUpload', icon: 'i-lucide-image', tooltip: { text: 'Insert image' } }
  ]
] satisfies EditorToolbarItem<typeof customHandlers>[][]

const PREVIEW_PLACEHOLDER = '<p style="color:#9ca3af;">Email body</p>'

// Static shell (shared with the History detail view). The body lives in
// `#preview-body` and is patched imperatively on change, so no flicker.
const scaffoldHtml = buildBroadcastPreviewDoc()

const previewFrame = useTemplateRef<HTMLIFrameElement>('previewFrame')
const frameReady = ref(false)

function patchPreview() {
  const el = previewFrame.value?.contentDocument?.getElementById('preview-body')
  if (el) el.innerHTML = renderBroadcastPreviewBody(compose.form.body_text || PREVIEW_PLACEHOLDER)
}

function onFrameLoad() {
  frameReady.value = true
  patchPreview()
}

watch(
  () => compose.form.body_text,
  () => {
    if (frameReady.value) patchPreview()
  }
)

async function onSubmit() {
  const ok = await compose.send()
  if (ok) {
    compose.reset()
    emit('sent')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold">Compose Email</h2>
      <UButton
        v-if="canEdit"
        label="Send Email"
        leading-icon="i-ph-paper-plane-tilt-fill"
        color="primary"
        :loading="compose.sending"
        :disabled="!compose.canSend"
        @click="formRef?.submit()"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: form -->
      <UForm
        ref="formRef"
        :schema="compose.schema"
        :state="compose.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <fieldset :disabled="!canEdit" class="space-y-4">
          <UFormField name="segment" label="Recipient" required>
            <USelect
              v-model="compose.form.segment"
              :items="compose.segmentOptions"
              placeholder="Select recipient group"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="compose.form.segment === 'custom_list'"
            name="custom_emails"
            label="Email list"
            required
          >
            <UTextarea
              v-model="compose.form.custom_emails"
              :rows="4"
              placeholder="Separate addresses with a new line, comma, or semicolon."
              class="w-full"
            />
          </UFormField>

          <!-- Live count for the custom list (fixed segments show their count in the picker) -->
          <div v-if="compose.form.segment === 'custom_list'" class="text-sm">
            <span v-if="compose.preview.loading" class="text-muted">Counting…</span>
            <span v-else-if="compose.preview.error" class="text-error">{{
              compose.preview.error
            }}</span>
            <span v-else class="text-muted">
              <span class="font-medium text-default">{{ compose.preview.count }}</span> recipient(s)
            </span>
          </div>
          <UAlert
            v-if="compose.preview.blocked"
            color="error"
            variant="soft"
            icon="i-ph-warning-circle-fill"
            :title="`Exceeds the daily limit of ${compose.preview.limit}`"
            description="Brevo's free tier allows up to 300 emails per day. Narrow the recipient group to send."
          />

          <UFormField name="sender_email" label="Sender" required>
            <USelect
              v-model="compose.form.sender_email"
              :items="compose.senderOptions"
              :loading="compose.loadingSenders"
              placeholder="Select a sender"
              class="w-full"
            />
          </UFormField>

          <UFormField name="subject" label="Subject" required>
            <UInput v-model="compose.form.subject" placeholder="Email subject" class="w-full" />
          </UFormField>

          <UFormField name="body_text" label="Body" required>
            <UEditor
              v-model="compose.form.body_text"
              content-type="html"
              :extensions="editorExtensions"
              :handlers="customHandlers"
              :editable="canEdit"
              :placeholder="{ placeholder: 'Write your email…', mode: 'firstLine' }"
              :ui="{
                root: 'rounded-lg border border-default divide-y divide-default',
                content: 'text-sm',
                base: 'px-3! sm:px-3! py-2.5! min-h-64 max-h-[40rem] resize-y overflow-auto'
              }"
            >
              <template #default="{ editor }">
                <UEditorToolbar
                  v-if="canEdit"
                  :editor="editor"
                  :items="toolbarItems"
                  class="px-1 py-1 overflow-x-auto"
                />
                <UEditorToolbar
                  v-if="canEdit"
                  :editor="editor"
                  :items="toolbarItems"
                  layout="bubble"
                />
              </template>
            </UEditor>
          </UFormField>
        </fieldset>
      </UForm>

      <!-- Right: live preview (fills the column so its height tracks the form/editor) -->
      <div class="flex flex-col gap-2 h-full min-h-0">
        <h3 class="text-sm font-medium text-muted shrink-0">Email Preview</h3>
        <div class="rounded-lg border border-default overflow-hidden bg-elevated flex-1 min-h-96">
          <iframe
            ref="previewFrame"
            :srcdoc="scaffoldHtml"
            title="Email preview"
            sandbox="allow-same-origin"
            class="w-full h-full border-0"
            @load="onFrameLoad"
          />
        </div>
      </div>
    </div>

    <UModal v-model:open="ctaOpen" title="Insert button">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Button label" required>
            <UInput v-model="ctaLabel" placeholder="Register Now" class="w-full" />
          </UFormField>
          <UFormField label="Target URL" required>
            <UInput
              v-model="ctaHref"
              type="url"
              placeholder="https://risesocial.org"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="ctaOpen = false" />
          <UButton
            label="Insert"
            color="primary"
            :disabled="!ctaLabel.trim() || !ctaHref.trim()"
            @click="confirmCta"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
