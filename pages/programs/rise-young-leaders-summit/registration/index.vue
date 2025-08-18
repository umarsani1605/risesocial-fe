<script setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-vue-next';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';
import { GENDER_OPTIONS, DISCOVER_SOURCES, SCHOLARSHIP_TYPES } from '@/constants/ryls';

definePageMeta({ layout: 'blank' });

const store = useRylsRegistrationStore();
const router = useRouter();

const genderValueCodes = GENDER_OPTIONS.map((option) => option.value);
const discoverSourceValueCodes = DISCOVER_SOURCES.map((option) => option.value);
const scholarshipTypeValueCodes = SCHOLARSHIP_TYPES.map((option) => option.value);

const formSchema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(1, 'Required field'),
      email: z.string().email('Invalid email'),
      residence: z.string().min(1, 'Required field'),
      nationality: z.string().min(1, 'Required field'),
      secondNationality: z.string().optional(),
      whatsapp: z.string().min(1, 'Required field'),
      institution: z.string().min(1, 'Required field'),
      dateOfBirth: z.string().min(1, 'Required field'),
      gender: z.enum(genderValueCodes, { message: 'Please select one option' }),
      discoverSource: z.enum(discoverSourceValueCodes, { message: 'Please select one option' }),
      discoverOtherText: z.string().optional(),
      scholarshipType: z.enum(scholarshipTypeValueCodes, { message: 'Please select one option' }),
    })
    .refine(
      (data) => {
        if (data.discoverSource === 'OTHER' && (!data.discoverOtherText || !data.discoverOtherText.trim())) {
          return false;
        }
        return true;
      },
      {
        message: 'Please specify',
        path: ['discoverOtherText'],
      }
    )
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    fullName: store.step1.fullName || '',
    email: store.step1.email || '',
    residence: store.step1.residence || '',
    nationality: store.step1.nationality || '',
    secondNationality: store.step1.secondNationality || '',
    whatsapp: store.step1.whatsapp || '',
    institution: store.step1.institution || '',
    dateOfBirth: store.step1.dateOfBirth || '',
    gender: store.step1.gender || '',
    discoverSource: store.step1.discoverSource || '',
    discoverOtherText: store.step1.discoverOtherText || '',
    scholarshipType: store.step1.scholarshipType || '',
  },
});

const onNext = form.handleSubmit(
  (values) => {
    const dataToStore = values;

    store.setStep1(dataToStore);

    const base = '/programs/rise-young-leaders-summit/registration';
    if (values.scholarshipType === 'FULLY_FUNDED') {
      router.push(`${base}/payment`);
    } else if (values.scholarshipType === 'SELF_FUNDED') {
      router.push(`${base}/self-funded`);
    }
  },
  (errors) => {
    console.log('Please try again later.');
  }
);
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-10 md:py-12" data-layout="blank">
    <div class="mb-6">
      <NuxtImg
        src="/images/ryls_banner.jpg"
        alt="Rise Young Leaders Summit Japan 2025 banner"
        class="w-full rounded-xl object-cover max-h-64 md:max-h-80"
      />
    </div>
    <header class="space-y-3 my-8">
      <h1 class="text-2xl md:text-3xl font-semibold mb-6">Rise Young Leaders Summit Japan 2025 - International Climate Change Leadership Forum</h1>
      <div class="text-sm space-y-2">
        Hello Rise Peeps, please fill out this form with accurate information and make sure you have a good internet connection.
      </div>
    </header>

    <hr class="my-6 border-gray-200" />

    <form @submit="onNext" class="space-y-8 text-gray-700">
      <div class="grid grid-cols-1 gap-6">
        <!-- Full Name -->
        <FormField v-slot="{ componentField }" name="fullName">
          <FormItem>
            <FormLabel>Full Name<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Your full name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input type="email" placeholder="Your email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- City and Country of Residence -->
        <FormField v-slot="{ componentField }" name="residence">
          <FormItem>
            <FormLabel>City and Country of Residence<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="City and Country of Residence" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Nationality -->
        <FormField v-slot="{ componentField }" name="nationality">
          <FormItem>
            <FormLabel>Nationality<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Your nationality" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Second Nationality -->
        <FormField v-slot="{ componentField }" name="secondNationality">
          <FormItem>
            <FormLabel>Second Nationality (if there's any)</FormLabel>
            <FormControl>
              <Input placeholder="Second nationality" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- WhatsApp Number -->
        <FormField v-slot="{ componentField }" name="whatsapp">
          <FormItem>
            <FormLabel>WhatsApp Number<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <input
                type="tel"
                placeholder="+62xxxxxxxxxxx"
                :value="componentField.modelValue"
                @input="
                  (e) => {
                    const filteredValue = e.target.value.replace(/[^0-9+]/g, '');
                    e.target.value = filteredValue;
                    componentField['onUpdate:modelValue'](filteredValue);
                  }
                "
                @blur="componentField.onBlur"
                class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Institution -->
        <FormField v-slot="{ componentField }" name="institution">
          <FormItem>
            <FormLabel>Institution (work place/university)<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Your institution" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Date of Birth -->
        <FormField v-slot="{ componentField }" name="dateOfBirth">
          <FormItem>
            <FormLabel>Date of Birth<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <div class="relative">
                <input
                  type="date"
                  v-bind="componentField"
                  class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <CalendarDays class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Gender -->
        <FormField v-slot="{ componentField }" name="gender">
          <FormItem class="gap-3">
            <FormLabel>Gender<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <RadioGroup v-bind="componentField" class="flex flex-col gap-2">
                <Label for="gender-male">
                  <RadioGroupItem id="gender-male" value="MALE" />
                  <span class="flex-1 font-medium">Male</span>
                </Label>
                <Label for="gender-female">
                  <RadioGroupItem id="gender-female" value="FEMALE" />
                  <span class="flex-1 font-medium">Female</span>
                </Label>
                <Label for="gender-na">
                  <RadioGroupItem id="gender-na" value="PREFER_NOT_TO_SAY" />
                  <span class="flex-1 font-medium">Prefer not to say</span>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Discover (Radio) -->
        <div class="space-y-3">
          <FormField v-slot="{ componentField }" name="discoverSource">
            <FormItem class="gap-3">
              <FormLabel>Where did you find out about the Rise Young Leaders Summit 2025 program? <span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <RadioGroup v-bind="componentField" class="flex flex-col gap-2">
                  <Label v-for="option in DISCOVER_SOURCES" :key="option.value" :for="`discover-${option.value}`">
                    <RadioGroupItem :id="`discover-${option.value}`" :value="option.value" />
                    <span class="flex-1 font-medium">{{ option.label }}</span>
                  </Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-if="form.values?.discoverSource === 'OTHER'" v-slot="{ componentField }" name="discoverOtherText">
            <FormItem>
              <FormControl>
                <Input placeholder="Please specify" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Scholarship Type -->
        <FormField v-slot="{ componentField }" name="scholarshipType">
          <FormItem class="gap-3">
            <FormLabel>Which type of scholarship/invitation you choose<span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <RadioGroup v-bind="componentField" class="grid grid-cols-1 gap-3">
                <Label v-for="option in SCHOLARSHIP_TYPES" :key="option.value" :for="`scholarship-${option.value}`">
                  <RadioGroupItem :id="`scholarship-${option.value}`" :value="option.value" />
                  <span class="flex-1 font-medium leading-normal">{{ option.label }}</span>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" class="px-6">Next</Button>
        </div>
      </div>
    </form>
  </section>
</template>
