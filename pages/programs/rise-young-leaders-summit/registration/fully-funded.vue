<script setup>
import { ref, onMounted } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

definePageMeta({ layout: 'blank' });

const store = useRylsRegistrationStore();
const router = useRouter();

// Composables
const { uploadEssay, isUploading: isUploadingFile, uploadError, uploadProgress } = useFileUpload();
const { submitFullyFunded, isSubmitting, submissionError, submissionSuccess, submissionId } = useRylsSubmission();

onMounted(() => {
  // if (store.step1.scholarshipType !== 'fully_funded') {
  //   return router.push('/programs/rise-young-leaders-summit/registration');
  // }
});

const essayFile = ref(/** @type {File|null} */ (null));
const essayFileId = ref(null);

const formSchema = toTypedSchema(
  z.object({
    essayTopic: z.enum(
      [
        'Green Climate – Urban solutions to adapt and thrive in a changing climate',
        'Green Curriculum – Embedding climate literacy in education',
        'Green Innovation – Tech-driven tools for climate resilience',
        'Green Action – Youth-led movements for climate justice',
        'Green Transition – Shifting to low-carbon, renewable energy',
      ],
      { message: 'Please select one option' }
    ),
    essayFile: z.string().min(1, 'Essay file is required'),
    essayDescription: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    essayTopic: store.essayTopic || '',
    essayFile: '',
    essayDescription: store.essayDescription || '',
  },
});

const onBack = () => router.push('/programs/rise-young-leaders-summit/registration');
const onNext = form.handleSubmit(async (values) => {
  console.log('Form submission - checking files:', {
    essayFile: essayFile.value?.name,
    essayFileId: essayFileId.value,
  });

  console.log('Store data before submission:', {
    step1: store.step1,
    essayTopic: store.essayTopic,
    essayFile: store.essayFile,
    essayDescription: store.essayDescription,
  });

  if (!essayFile.value || !essayFileId.value) {
    alert('Please upload essay file first');
    return;
  }

  // Save to store first
  store.setFullyFundedData({
    essayTopic: values.essayTopic,
    essayFile: essayFileId.value, // Store file ID instead of file object
    essayDescription: values.essayDescription,
  });

  console.log('Fully funded form data saved:', {
    essayTopic: values.essayTopic,
    essayFileId: essayFileId.value,
    essayDescription: values.essayDescription,
  });

  // Submit to API
  const success = await submitFullyFunded();

  if (success) {
    // Redirect to success page or show success message
    router.push(`/programs/rise-young-leaders-summit/registration/success?id=${submissionId.value}`);
  }
});

const onFileChange = async (e, componentField) => {
  const file = e.target.files?.[0];
  if (!file) {
    essayFile.value = null;
    essayFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }
  if (file.type !== 'application/pdf') {
    alert('File must be a PDF');
    e.target.value = '';
    essayFile.value = null;
    essayFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be <= 10MB');
    e.target.value = '';
    essayFile.value = null;
    essayFileId.value = null;
    componentField['onUpdate:modelValue']('');
    return;
  }

  essayFile.value = file;
  componentField['onUpdate:modelValue'](file.name);

  // Upload file immediately
  const fileId = await uploadEssay(file);
  console.log('Upload result:', { fileId, essayFileId: essayFileId.value });
  if (fileId) {
    essayFileId.value = fileId;
    console.log('Essay file uploaded successfully:', fileId);
  } else {
    console.error('Upload failed - no fileId returned');
  }
};
</script>

<template>
  <section class="mx-auto max-w-xl px-4 py-10 md:py-12">
    <div class="mb-6">
      <img
        src="/images/ryls_banner.jpg"
        alt="Rise Young Leaders Summit Japan 2025 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
        loading="lazy"
      />
    </div>
    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-6">Fully Funded Registration & Essay Submission</h1>
      <div class="text-sm space-y-2">
        <p><strong>Attention!</strong> Before answering the quiz questions, please note the following:</p>
        <ol class="list-decimal ml-5 space-y-2">
          <li>
            Make sure your internet network is smooth when filling out the form, if there are problems with the network or other technical problems,
            please contact us at <a href="mailto:risesocial.official@gmail.com" class="underline">risesocial.official@gmail.com</a>
          </li>
          <li>Make sure the file is in PDF form, otherwise we will not be able to assess your essay</li>
        </ol>
        <p>Good Luck! :D</p>
      </div>
    </header>

    <hr class="my-6 border-gray-200" />

    <form @submit="onNext" class="space-y-8 text-gray-700">
      <!-- Essay Topic -->
      <FormField v-slot="{ componentField }" name="essayTopic">
        <FormItem>
          <FormLabel>Essay Topic<span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <RadioGroup v-bind="componentField" class="flex flex-col gap-2">
              <Label for="topic-1">
                <RadioGroupItem id="topic-1" value="Green Climate – Urban solutions to adapt and thrive in a changing climate" />
                <span class="flex-1 font-medium leading-normal">Green Climate – Urban solutions to adapt and thrive in a changing climate</span>
              </Label>
              <Label for="topic-2">
                <RadioGroupItem id="topic-2" value="Green Curriculum – Embedding climate literacy in education" />
                <span class="flex-1 font-medium leading-normal">Green Curriculum – Embedding climate literacy in education</span>
              </Label>
              <Label for="topic-3">
                <RadioGroupItem id="topic-3" value="Green Innovation – Tech-driven tools for climate resilience" />
                <span class="flex-1 font-medium leading-normal">Green Innovation – Tech-driven tools for climate resilience</span>
              </Label>
              <Label for="topic-4">
                <RadioGroupItem id="topic-4" value="Green Action – Youth-led movements for climate justice" />
                <span class="flex-1 font-medium leading-normal">Green Action – Youth-led movements for climate justice</span>
              </Label>
              <Label for="topic-5">
                <RadioGroupItem id="topic-5" value="Green Transition – Shifting to low-carbon, renewable energy" />
                <span class="flex-1 font-medium leading-normal">Green Transition – Shifting to low-carbon, renewable energy</span>
              </Label>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Upload Essay -->
      <FormField v-slot="{ componentField }" name="essayFile">
        <FormItem>
          <FormLabel>Upload your essay file here!<span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input type="file" accept="application/pdf" @change="(e) => onFileChange(e, componentField)" />
          </FormControl>
          <p class="text-sm text-muted-foreground">PDF only, max 10MB</p>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Work details -->
      <FormField v-slot="{ componentField }" name="essayDescription">
        <FormItem>
          <FormLabel>Work details (insert description of your work)</FormLabel>
          <FormControl>
            <textarea
              v-bind="componentField"
              rows="5"
              class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            ></textarea>
          </FormControl>

          <p class="text-sm text-muted-foreground">You can add your essay's details or description to help us recognize your essay.</p>
          <FormMessage />
        </FormItem>
      </FormField>

      <hr class="my-6 border-gray-200" />

      <!-- Footer -->
      <div class="space-y-2">
        <div class="font-semibold">Good Luck and See you in Japan! 🇯🇵</div>
        <div class="text-sm text-muted-foreground">
          If you have questions or concerns, contact us at
          <a href="mailto:risesocial.official@gmail.com" class="underline">risesocial.official@gmail.com.</a>
        </div>
      </div>

      <!-- Error Messages -->
      <div v-if="submissionError || uploadError" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ submissionError || uploadError }}</p>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploadingFile" class="space-y-2">
        <p class="text-sm text-gray-600">Uploading essay file...</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" @click="onBack" class="px-6" :disabled="isSubmitting">Back</Button>
        <Button type="submit" class="px-6" :disabled="isSubmitting || isUploadingFile">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </Button>
      </div>
    </form>
  </section>
</template>
