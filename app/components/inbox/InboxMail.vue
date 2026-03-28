<script setup lang="ts">
import { format } from 'date-fns'
import type { Mail } from '~/types'

defineProps<{
  mail: Mail
}>()

const emits = defineEmits(['close'])

const dropdownItems = [[{
  label: 'Mark as unread',
  icon: 'i-ph-check-circle-bold'
}, {
  label: 'Mark as important',
  icon: 'i-ph-warning-bold'
}], [{
  label: 'Star thread',
  icon: 'i-ph-star-bold'
}, {
  label: 'Mute thread',
  icon: 'i-ph-pause-circle-bold'
}]]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    reply.value = ''

    toast.add({
      title: 'Email sent',
      description: 'Your email has been sent successfully',
      icon: 'i-ph-check-circle-bold',
      color: 'success'
    })

    loading.value = false
  }, 1000)
}
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar
      :title="mail.subject"
      :toggle="false"
    >
      <template #leading>
        <UButton
          icon="i-ph-x-bold"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Archive">
          <UButton
            icon="i-ph-tray-bold"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Reply">
          <UButton
            icon="i-ph-arrow-bend-up-left-bold"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton
            icon="i-ph-dots-three-vertical-bold"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <UAvatar
          v-bind="mail.from.avatar"
          :alt="mail.from.name"
          size="3xl"
        />

        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            {{ mail.from.name }}
          </p>
          <p class="text-muted">
            {{ mail.from.email }}
          </p>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        {{ format(new Date(mail.date), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <p class="whitespace-pre-wrap">
        {{ mail.body }}
      </p>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard
        variant="subtle"
        class="mt-auto"
        :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
      >
        <template #header>
          <UIcon
            name="i-ph-arrow-bend-up-left-bold"
            class="size-5"
          />

          <span class="text-sm truncate">
            Reply to {{ mail.from.name }} ({{ mail.from.email }})
          </span>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            color="neutral"
            variant="none"
            required
            autoresize
            placeholder="Write your reply..."
            :rows="4"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-between">
            <UTooltip text="Attach file">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-ph-paperclip-bold"
              />
            </UTooltip>

            <div class="flex items-center justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                label="Save draft"
              />
              <UButton
                type="submit"
                color="neutral"
                :loading="loading"
                label="Send"
                icon="i-ph-paper-plane-tilt-bold"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
