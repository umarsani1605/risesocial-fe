<script setup>
import { ref, onMounted } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

definePageMeta({ layout: 'blank' });

const store = useRylsRegistrationStore();
const router = useRouter();
const { proxy } = useScriptMetaPixel();
// Composables
const { uploadHeadshot, isUploading: isUploadingFile, uploadError, uploadProgress } = useFileUpload();

onMounted(() => {
  if (store.step1.scholarshipType !== 'SELF_FUNDED') {
    return router.push('/programs/rise-young-leaders-summit/registration');
  }
});

const headshotFile = ref(/** @type {File|null} */ (null));
const headshotFileId = ref(null);

const formSchema = toTypedSchema(
  z.object({
    passportNumber: z.string().min(1, 'Required field'),
    needVisa: z.enum(['YES', 'NO'], { message: 'Please select Yes/No' }),
    headshotFile: z.string().min(1, 'Headshot file is required'),
    readPolicies: z.enum(['YES', 'NO', '']).refine((val) => val === 'YES', {
      message: 'You must agree (Yes)',
    }),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    passportNumber: store.passportNumber || '',
    needVisa: store.needVisa || '',
    headshotFile: '',
    readPolicies: store.readPolicies || '',
  },
});

const onBack = () => router.push('/programs/rise-young-leaders-summit/registration');
const onNext = form.handleSubmit(async (values) => {
  if (!headshotFileId.value) {
    alert('Please upload headshot photo first');
    return;
  }

  try {
    store.setSelfFundedData({
      passportNumber: values.passportNumber,
      needVisa: values.needVisa,
      headshotFile: headshotFileId.value,
      readPolicies: values.readPolicies,
    });

    proxy.fbq('track', 'CompleteRegistrationStep2', {
      content_name: 'Self Funded',
    });

    router.push('/programs/rise-young-leaders-summit/registration/payment');
  } catch (error) {
    alert('Failed to save your information. Please try again.');
  }
});

const onHeadshotChange = async (e, componentField) => {
  const file = e.target.files?.[0];
  if (!file) {
    headshotFile.value = null;
    headshotFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('File must be JPG, JPEG, or PNG');
    e.target.value = '';
    headshotFile.value = null;
    headshotFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be <= 10MB');
    e.target.value = '';
    headshotFile.value = null;
    headshotFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }

  headshotFile.value = file;
  componentField['onUpdate:modelValue'](file.name);

  try {
    const fileId = await uploadHeadshot(file);
    if (fileId) {
      headshotFileId.value = fileId;
    }
  } catch (error) {
    alert('Failed to upload headshot file. Please try again.');
    e.target.value = '';
    headshotFile.value = null;
    headshotFileId.value = null;
    componentField['onUpdate:modelValue']('');
  }
};
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12">
    <div class="mb-6">
      <NuxtImg
        src="/images/ryls_banner.jpg"
        alt="Rise Young Leaders Summit Japan 2025 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>
    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-6">Self Funded Registration</h1>
      <div class="text-sm space-y-2">
        Ideal for experienced professionals and executives, this Global Leadership Experience equips you with cutting-edge climate change leadership
        skills and culminates in a prestigious RYLS certification.
      </div>
    </header>

    <hr class="my-6 border-gray-200" />

    <form @submit="onNext" class="space-y-8 text-gray-700">
      <!-- Passport Number -->
      <FormField v-slot="{ componentField }" name="passportNumber">
        <FormItem>
          <FormLabel>Passport Number<span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="e.g. X1234567" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Need Visa -->
      <FormField v-slot="{ componentField }" name="needVisa">
        <FormItem>
          <FormLabel>Does your country need visa to go to Japan?<span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <RadioGroup v-bind="componentField" class="flex flex-col gap-2">
              <Label for="visa-yes" class="flex w-full items-center gap-2 cursor-pointer select-none">
                <RadioGroupItem id="visa-yes" value="YES" />
                <span class="flex-1 font-medium">Yes</span>
              </Label>
              <Label for="visa-no" class="flex w-full items-center gap-2 cursor-pointer select-none">
                <RadioGroupItem id="visa-no" value="NO" />
                <span class="flex-1 font-medium">No</span>
              </Label>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Headshot Upload -->
      <FormField v-slot="{ componentField }" name="headshotFile">
        <FormItem>
          <FormLabel>Upload your headshot photo<span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input type="file" accept="image/jpeg,image/jpg,image/png" @change="(e) => onHeadshotChange(e, componentField)" />
          </FormControl>
          <p class="text-sm text-muted-foreground">JPG, JPEG, and PNG only. Max size 10MB.</p>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Read Policies -->
      <FormField v-slot="{ componentField }" name="readPolicies">
        <FormItem>
          <FormLabel class="flex-col items-start">
            <span>I have read all the policies and agree with the policies.<span class="text-red-500">*</span></span>
            <span>
              Read the policies here:
              <a href="https://s.id/SelfFundedRYLS25" target="_blank" class="underline text-primary">https://s.id/SelfFundedRYLS25</a>
            </span>
          </FormLabel>
          <FormControl>
            <RadioGroup v-bind="componentField" class="flex flex-col gap-2">
              <Label for="policy-yes" class="flex w-full items-center gap-2 cursor-pointer select-none">
                <RadioGroupItem id="policy-yes" value="YES" />
                <span class="flex-1 font-medium">Yes</span>
              </Label>
              <Label for="policy-no" class="flex w-full items-center gap-2 cursor-pointer select-none">
                <RadioGroupItem id="policy-no" value="NO" />
                <span class="flex-1 font-medium">No</span>
              </Label>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <hr class="my-6 border-gray-200" />

      <!-- Error Messages -->
      <div v-if="uploadError" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ uploadError }}</p>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploadingFile" class="space-y-2">
        <p class="text-sm text-gray-600">Uploading headshot photo...</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" @click="onBack" class="px-6" :disabled="isUploadingFile">Back</Button>
        <Button type="submit" class="px-6" :disabled="isUploadingFile">
          {{ isUploadingFile ? 'Uploading...' : 'Next' }}
        </Button>
      </div>
    </form>
  </section>
</template>
