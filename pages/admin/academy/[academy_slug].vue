<script setup>
import { ref, computed, shallowRef, watch } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import PricingDialog from '@/components/academies/PricingDialog.vue';
import FeatureDialog from '@/components/academies/FeatureDialog.vue';
import InstructorDialog from '@/components/academies/InstructorDialog.vue';
import TopicDialog from '@/components/academies/TopicDialog.vue';
import TopicsTable from '@/components/academies/TopicsTable.vue';
import SessionDialog from '@/components/academies/SessionDialog.vue';
import TestimonialDialog from '@/components/academies/TestimonialDialog.vue';
import FaqDialog from '@/components/academies/FaqDialog.vue';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin-dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});

// Image URL state (needed for validation)
const imageUrl = ref('');

// Zod schema for validation
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    duration: z.string().min(1, 'Duration is required'),
    category: z.string().min(1, 'Category is required'),
    format: z.string().min(1, 'Format is required'),
    status: z.string().min(1, 'Status is required'),
    certificate: z.union([z.boolean(), z.null()]).refine((val) => val !== null, {
      message: 'Certificate option is required',
    }),
    portfolio: z.union([z.boolean(), z.null()]).refine((val) => val !== null, {
      message: 'Portfolio option is required',
    }),
    image: z
      .any()
      .refine(
        (file) => {
          // For edit page, allow null if there's existing image_url
          if (!file && imageUrl.value) return true;
          if (!file) return false;
          return file instanceof File;
        },
        {
          message: 'Image is required',
        }
      )
      .refine(
        (file) => {
          if (!file) return true;
          return file.type.startsWith('image/');
        },
        {
          message: 'File must be an image',
        }
      )
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= 10 * 1024 * 1024; // 10MB
        },
        {
          message: 'Image size must be less than 10MB',
        }
      ),
  })
);

// Form setup with vee-validate (will be initialized after academy data loads)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    description: '',
    duration: '',
    category: '',
    format: '',
    status: '',
    certificate: null,
    portfolio: null,
    image: null,
  },
});

// File upload state
const isImageUploading = ref(false);

const route = useRoute();

const {
  data: academy,
  pending,
  error,
  refresh,
} = await useAPI(`/admin/academies/${route.params.academy_slug}`, {
  key: `admin-academy-${route.params.academy_slug}`,
  transform: (response) => {
    console.log('Academy API response:', response);
    return response?.data || null;
  },
  default: () => null,
});

// Debug logging
watch(
  academy,
  (newAcademy) => {
    console.log('Academy data changed:', newAcademy);
    if (newAcademy) {
      console.log('Academy ID:', newAcademy.id);
    }
  },
  { immediate: true }
);

// Error logging
watch(
  error,
  (newError) => {
    if (newError) {
      console.error('Academy API error:', newError);
    }
  },
  { immediate: true }
);

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'default';
    case 'DRAFT':
      return 'secondary';
    case 'ARCHIVED':
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const pricingDialogOpen = ref(false);
const pricingDialogMode = ref('add');
const selectedPricing = ref(null);

const featureDialogOpen = ref(false);
const featureDialogMode = ref('add');
const selectedFeature = ref(null);

const instructorDialogOpen = ref(false);
const instructorDialogMode = ref('add');
const selectedInstructor = ref(null);

const topicDialogOpen = ref(false);
const topicDialogMode = ref('add');
const selectedTopic = ref(null);

const testimonialDialogOpen = ref(false);
const testimonialDialogMode = ref('add');
const selectedTestimonial = ref(null);

const faqDialogOpen = ref(false);
const faqDialogMode = ref('add');
const selectedFaq = ref(null);

const sessionDialogOpen = ref(false);
const sessionDialogMode = ref('add');
const selectedSession = ref(null);
const selectedTopicForSession = ref(null);

const basicInfoPending = ref(false);
const imageFile = ref(null);
const imageFileInputRef = ref(null);
const displayTitle = ref(''); // State terpisah untuk title di header

// Delete confirmation dialog states
const deleteDialogOpen = ref(false);
const deleteDialogPending = ref(false);
const deleteItem = shallowRef(null);
const deleteType = ref('');

// Functions for delete dialog
const getDeleteDialogTitle = () => {
  const type = deleteType.value;
  if (!type) return 'Confirmation';

  const titles = {
    pricing: 'Delete Pricing',
    feature: 'Delete Feature',
    instructor: 'Delete Instructor',
    topic: 'Delete Topic',
    session: 'Delete Session',
    testimonial: 'Delete Testimonial',
    faq: 'Delete FAQ',
  };

  return titles[type] || 'Confirmation';
};

const getDeleteDialogContent = () => {
  const item = deleteItem.value;
  const type = deleteType.value;

  if (!item || !type) return 'Are you sure you want to delete this item?';

  const itemName = item.name || item.title || item.question || 'this item';
  return `Are you sure you want to delete "${itemName}"?`;
};

const onEdit = () => {
  toast.info('Edit functionality coming soon');
};

const onBack = async () => {
  await navigateTo('/admin/academy');
};

// Basic Information form functions dengan optimistic update
const saveBasicInfo = form.handleSubmit(
  async (values) => {
    if (!academy.value) {
      toast.error('Academy data not loaded. Please refresh the page.');
      return;
    }

    if (!academy.value.id) {
      toast.error('Academy ID not found. Please refresh the page.');
      return;
    }

    try {
      basicInfoPending.value = true;
      isImageUploading.value = true;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('status', values.status);
      formData.append('category', values.category);
      formData.append('duration', values.duration);
      formData.append('format', values.format);
      formData.append('certificate', values.certificate);
      formData.append('portfolio', values.portfolio);
      formData.append('description', values.description);

      // Add image file if available
      if (imageFile.value) {
        formData.append('image', imageFile.value);
      } else if (imageUrl.value && !imageUrl.value.startsWith('blob:')) {
        // Keep existing image URL if no new file
        formData.append('image_url', imageUrl.value);
      }

      // Optimistic update
      academy.value.title = values.title;
      academy.value.status = values.status;
      academy.value.category = values.category;
      academy.value.duration = values.duration;
      academy.value.format = values.format;
      academy.value.certificate = values.certificate;
      academy.value.portfolio = values.portfolio;
      academy.value.description = values.description;

      console.log('Updating academy with ID:', academy.value.id);
      console.log('FormData keys:', Array.from(formData.keys()));

      const response = await $api(`/admin/academies/${academy.value.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.success === false) {
        toast.error(response.message || 'Failed to update academy');
        refresh(); // Rollback optimistic update
        return;
      }

      // Update image_url from response if available
      if (response.data?.image_url) {
        academy.value.image_url = response.data.image_url;
        imageUrl.value = response.data.image_url;
      }

      if (response.data?.path_slug && response.data.path_slug !== route.params.academy_slug) {
        const newSlug = response.data.path_slug;

        academy.value.path_slug = newSlug;

        await navigateTo(`/admin/academy/${newSlug}`, { replace: true });
      } else {
        refresh();
      }

      toast.success('Academy updated successfully');
    } catch (error) {
      console.error('Update basic info error:', error);

      // Handle error response dari API
      if (error?.data?.success === false) {
        toast.error(error.data.message || 'Failed to update academy');
      } else {
        toast.error(error?.data?.message || 'Failed to update academy');
      }

      refresh(); // Rollback optimistic update
    } finally {
      basicInfoPending.value = false;
      isImageUploading.value = false;
    }
  },
  (errors) => {
    console.log('Validation errors:', errors);
    toast.error('Please fill in all required fields');
  }
);

const onDelete = () => {
  deleteDialogOpen.value = true;
};

watch(
  academy,
  (newAcademy) => {
    if (newAcademy) {
      // Update form values
      form.setValues({
        title: newAcademy.title || '',
        status: newAcademy.status || '',
        category: newAcademy.category || '',
        duration: newAcademy.duration || '',
        format: newAcademy.format || '',
        certificate: newAcademy.certificate ?? null,
        portfolio: newAcademy.portfolio ?? null,
        description: newAcademy.description || '',
        image: null, // Initialize image field
      });
      imageUrl.value = newAcademy.image_url || '';
      displayTitle.value = newAcademy.title || ''; // Inisialisasi display title
    }
  },
  { immediate: true }
);

// Image handlers dengan upload functionality
const onPickImage = () => {
  imageFileInputRef.value?.click();
};

const onImageFileChange = (event) => {
  const files = event?.target?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  imageFile.value = file;

  // Update form field value for validation
  form.setFieldValue('image', file);

  // Cleanup previous object URL
  if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl.value);
  }

  // Preview image
  try {
    const previewUrl = URL.createObjectURL(file);
    imageUrl.value = previewUrl;
  } catch (e) {
    console.error('Preview image failed:', e);
    toast.error('Failed to preview image');
  }
};

// Pricing actions
const onAddPricing = () => {
  pricingDialogMode.value = 'add';
  selectedPricing.value = null;
  pricingDialogOpen.value = true;
};

const onEditPricing = (price) => {
  pricingDialogMode.value = 'edit';
  selectedPricing.value = price;
  pricingDialogOpen.value = true;
};

const onDeletePricing = (price) => {
  deleteItem.value = price;
  deleteType.value = 'pricing';
  deleteDialogOpen.value = true;
};

// Feature actions
const onAddFeature = () => {
  featureDialogMode.value = 'add';
  selectedFeature.value = null;
  featureDialogOpen.value = true;
};

const onEditFeature = (feature) => {
  featureDialogMode.value = 'edit';
  selectedFeature.value = feature;
  featureDialogOpen.value = true;
};

const onDeleteFeature = (feature) => {
  deleteItem.value = feature;
  deleteType.value = 'feature';
  deleteDialogOpen.value = true;
};

// Instructor actions
const onAddInstructor = () => {
  instructorDialogMode.value = 'add';
  selectedInstructor.value = null;
  instructorDialogOpen.value = true;
};

const onEditInstructor = (instructor) => {
  instructorDialogMode.value = 'edit';
  selectedInstructor.value = instructor;
  instructorDialogOpen.value = true;
};

const onDeleteInstructor = (instructor) => {
  deleteItem.value = instructor;
  deleteType.value = 'instructor';
  deleteDialogOpen.value = true;
};

// Topic actions
const onAddTopic = () => {
  topicDialogMode.value = 'add';
  selectedTopic.value = null;
  topicDialogOpen.value = true;
};

const onEditTopic = (topic) => {
  topicDialogMode.value = 'edit';
  selectedTopic.value = topic;
  topicDialogOpen.value = true;
};

const onDeleteTopic = (topic) => {
  deleteItem.value = topic;
  deleteType.value = 'topic';
  deleteDialogOpen.value = true;
};

// Testimonial actions
const onAddTestimonial = () => {
  testimonialDialogMode.value = 'add';
  selectedTestimonial.value = null;
  testimonialDialogOpen.value = true;
};

const onEditTestimonial = (testimonial) => {
  testimonialDialogMode.value = 'edit';
  selectedTestimonial.value = testimonial;
  testimonialDialogOpen.value = true;
};

const onDeleteTestimonial = (testimonial) => {
  deleteItem.value = testimonial;
  deleteType.value = 'testimonial';
  deleteDialogOpen.value = true;
};

// FAQ actions
const onAddFaq = () => {
  faqDialogMode.value = 'add';
  selectedFaq.value = null;
  faqDialogOpen.value = true;
};

const onEditFaq = (faq) => {
  faqDialogMode.value = 'edit';
  selectedFaq.value = faq;
  faqDialogOpen.value = true;
};

const onDeleteFaq = (faq) => {
  deleteItem.value = faq;
  deleteType.value = 'faq';
  deleteDialogOpen.value = true;
};

// Session actions
const onAddSession = (topic) => {
  sessionDialogMode.value = 'add';
  selectedSession.value = null;
  selectedTopicForSession.value = topic;
  sessionDialogOpen.value = true;
};

const onEditSession = (session, topic) => {
  sessionDialogMode.value = 'edit';
  selectedSession.value = session;
  selectedTopicForSession.value = topic;
  sessionDialogOpen.value = true;
};

const onDeleteSession = (session, topic) => {
  deleteItem.value = { ...session, topic };
  deleteType.value = 'session';
  deleteDialogOpen.value = true;
};

// Dialog success handler
const sortByOrder = () => {
  if (!academy.value) return;
  const b = academy.value;
  if (Array.isArray(b.pricing)) b.pricing.sort((a, b) => a.order - b.order);
  if (Array.isArray(b.features)) b.features.sort((a, b) => a.order - b.order);
  if (Array.isArray(b.instructors)) b.instructors.sort((a, b) => a.order - b.order);
  if (Array.isArray(b.topics)) b.topics.sort((a, b) => a.order - b.order);
  if (Array.isArray(b.testimonials)) b.testimonials.sort((a, b) => a.order - b.order);
  if (Array.isArray(b.faqs)) b.faqs.sort((a, b) => a.order - b.order);
};

const onDialogSuccess = () => {
  sortByOrder();
  refresh();
};

// Delete confirmation handler dengan optimistic updates
const onConfirmDelete = async () => {
  if (!deleteItem.value || !deleteType.value) return;

  try {
    deleteDialogPending.value = true;

    let endpoint = '';
    let successMessage = '';

    switch (deleteType.value) {
      case 'pricing':
        endpoint = `/admin/academies/${academy.value.id}/pricing/${deleteItem.value.id}`;
        successMessage = 'Pricing deleted successfully';
        break;
      case 'feature':
        endpoint = `/admin/academies/${academy.value.id}/features/${deleteItem.value.id}`;
        successMessage = 'Feature deleted successfully';
        break;
      case 'instructor':
        endpoint = `/admin/academies/${academy.value.id}/instructors/${deleteItem.value.id}`;
        successMessage = 'Instructor removed successfully';
        break;
      case 'topic':
        endpoint = `/admin/academies/${academy.value.id}/topics/${deleteItem.value.id}`;
        successMessage = 'Topic deleted successfully';
        break;
      case 'testimonial':
        endpoint = `/admin/academies/${academy.value.id}/testimonials/${deleteItem.value.id}`;
        successMessage = 'Testimonial deleted successfully';
        break;
      case 'faq':
        endpoint = `/admin/academies/${academy.value.id}/faqs/${deleteItem.value.id}`;
        successMessage = 'FAQ deleted successfully';
        break;
      case 'session':
        endpoint = `/admin/academies/${academy.value.id}/topics/${deleteItem.value.topic.id}/sessions/${deleteItem.value.id}`;
        successMessage = 'Session deleted successfully';
        break;
      default:
        throw new Error('Unknown delete type');
    }

    // 1. Optimistic update: hapus item dari UI langsung
    if (academy.value) {
      const collections = {
        pricing: 'pricing',
        feature: 'features',
        instructor: 'instructors',
        topic: 'topics',
        session: 'sessions',
        testimonial: 'testimonials',
        faq: 'faqs',
      };
      const key = collections[deleteType.value];
      if (key && Array.isArray(academy.value?.[key])) {
        if (deleteType.value === 'session') {
          // Handle session deletion from nested structure
          const topicId = deleteItem.value.topic.id;
          const sessionId = deleteItem.value.id;
          const topic = academy.value?.topics?.find((t) => t.id === topicId);
          if (topic && Array.isArray(topic.sessions)) {
            topic.sessions = topic.sessions.filter((s) => s.id !== sessionId);
          }
        } else {
          const idKey = 'id';
          academy.value[key] = academy.value?.[key]?.filter((item) => item[idKey] !== deleteItem.value.id);
        }
        sortByOrder();
      }
    }

    // 2. Call API di background
    await $api(endpoint, {
      method: 'DELETE',
    });

    // 3. Success feedback
    toast.success(successMessage);
    deleteDialogOpen.value = false;

    // 4. Refresh data di background untuk sinkronisasi
    refresh();
  } catch (error) {
    console.error('Delete error:', error);
    toast.error(error?.data?.message || `Failed to delete ${deleteType.value}`);

    // Rollback optimistic update jika error
    refresh();
  } finally {
    deleteDialogPending.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 pr-18 w-full h-full">
    <div class="relative">
      <div v-if="pending" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p class="text-sm text-gray-600">Loading academy...</p>
        </div>
      </div>

      <div v-if="academy" class="space-y-6">
        <section class="mb-10">
          <div class="flex items-center gap-4 mb-6">
            <Button @click="onBack" variant="outline" class="flex items-center gap-2 shadow-none">
              <Icon name="lucide:arrow-left" size="18" />
              Back
            </Button>
            <div class="font-medium">Edit Academy</div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="lucide:info" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Basic Information</span>
            </div>
            <Button @click="saveBasicInfo" :disabled="basicInfoPending">
              <Icon name="lucide:save" size="16" />
              Save Academy
            </Button>
          </div>

          <div class="space-y-6">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-1">
                <FormField v-slot="{ componentField, errorMessage }" name="image">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-muted-foreground">
                      Academy Image
                      <span class="text-red-500">*</span>
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <div
                        class="w-full aspect-square rounded-lg overflow-hidden relative transition-colors"
                        :class="errorMessage ? 'border-2 border-red-500' : 'border border-gray-300'"
                      >
                        <img
                          v-if="imageUrl || academy?.image_url"
                          :src="imageUrl || academy?.image_url"
                          alt="Academy Image"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-xl transition-colors"
                          :class="errorMessage ? 'border-red-500' : 'border-gray-300'"
                        >
                          <div class="text-center">
                            <Icon name="lucide:image" size="48" class="mx-auto mb-2" />
                            <p>No image selected</p>
                          </div>
                        </div>
                      </div>
                      <input
                        ref="imageFileInputRef"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onImageFileChange"
                        v-bind="componentField"
                      />
                      <Button variant="outline" size="sm" class="w-full mt-2" @click="onPickImage" :class="errorMessage ? 'border-red-500' : ''">
                        <Icon name="lucide:image" size="16" />
                        {{ imageFile ? 'Change Image' : 'Upload Image' }}
                      </Button>
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
              <div class="flex-4 space-y-4">
                <FormField v-slot="{ componentField }" name="title">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-muted-foreground">
                      Title
                      <span class="text-red-500">*</span>
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" class="mt-1 w-full" placeholder="Enter academy title" />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-muted-foreground">
                      Description
                      <span class="text-red-500">*</span>
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea v-bind="componentField" class="mt-1 w-full min-h-48" placeholder="Enter academy description" />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField, errorMessage }" name="duration">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Duration
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="mt-1 w-full" :class="errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        <SelectItem value="2 months">2 Months</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                        <SelectItem value="4 months">4 Months</SelectItem>
                        <SelectItem value="5 months">5 Months</SelectItem>
                        <SelectItem value="6 months">6 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="category">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Category
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" class="mt-1 w-full" placeholder="Enter category" />
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="format">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Format
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" class="mt-1 w-full" placeholder="e.g., Online Live Classes" />
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="status">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Status
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="mt-1 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="certificate">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Certificate
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="mt-1 w-full">
                        <SelectValue placeholder="Select certificate option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem :value="true">Yes</SelectItem>
                        <SelectItem :value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="portfolio">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-muted-foreground">
                    Portfolio
                    <span class="text-red-500">*</span>
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="mt-1 w-full">
                        <SelectValue placeholder="Select portfolio option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem :value="true">Yes</SelectItem>
                        <SelectItem :value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
          </div>
        </section>
        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:currency-dollar-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Pricing</span>
            </div>
            <Button size="sm" @click="onAddPricing">
              <Icon name="lucide:plus" size="16" />
              Add Pricing
            </Button>
          </div>

          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-18">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Discount Price</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="academy?.pricing?.length">
                  <TableRow v-for="price in academy?.pricing" :key="price.id">
                    <TableCell class="w-18">{{ price.order }}</TableCell>
                    <TableCell>{{ price.name }}</TableCell>
                    <TableCell>{{ formatCurrency(price.original_price) }}</TableCell>
                    <TableCell>{{ formatCurrency(price.discount_price) }}</TableCell>
                    <TableCell class="px-4 sticky right-0 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" @click="onEditPricing(price)">
                          <Icon name="lucide:edit" class="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          class="hover:bg-destructive/90 hover:text-destructive-foreground"
                          @click="onDeletePricing(price)"
                        >
                          <Icon name="lucide:trash-2" class="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell :colspan="5" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="text-muted-foreground">No pricing data available</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:clipboard-document-check-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Featured Benefits</span>
            </div>
            <Button size="sm" @click="onAddFeature">
              <Icon name="lucide:plus" size="16" />
              Add Feature
            </Button>
          </div>

          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-18">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="academy?.features?.length">
                  <TableRow v-for="feature in academy?.features" :key="feature.id">
                    <TableCell class="w-18">{{ feature.order }}</TableCell>
                    <TableCell>{{ feature.title }}</TableCell>
                    <TableCell class="max-w-xs truncate" :title="feature.description">{{ feature.description }}</TableCell>
                    <TableCell>
                      <Icon :name="feature.icon" size="20" class="text-primary" />
                    </TableCell>
                    <TableCell class="px-4 sticky right-0 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" @click="onEditFeature(feature)">
                          <Icon name="lucide:edit" class="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          class="hover:bg-destructive/90 hover:text-destructive-foreground"
                          @click="onDeleteFeature(feature)"
                        >
                          <Icon name="lucide:trash-2" class="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell :colspan="5" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="text-muted-foreground">No features available</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:users-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Instructors</span>
            </div>
            <Button size="sm" @click="onAddInstructor">
              <Icon name="lucide:plus" size="16" />
              Add Instructor
            </Button>
          </div>
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-18">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="academy?.instructors?.length">
                  <TableRow v-for="instructorData in academy?.instructors" :key="instructorData.id">
                    <TableCell class="w-18">{{ instructorData.order }}</TableCell>
                    <TableCell>{{ instructorData.name || '-' }}</TableCell>
                    <TableCell class="max-w-xs truncate" :title="instructorData.job_title">{{ instructorData.job_title || '-' }}</TableCell>
                    <TableCell class="max-w-xs truncate" :title="instructorData.description">{{ instructorData.description || '-' }}</TableCell>
                    <TableCell class="px-4 sticky right-0 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" @click="onEditInstructor(instructorData)">
                          <Icon name="lucide:edit" class="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          class="hover:bg-destructive/90 hover:text-destructive-foreground"
                          @click="onDeleteInstructor(instructorData)"
                        >
                          <Icon name="lucide:trash-2" class="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell :colspan="5" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="text-muted-foreground">No instructors available</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:book-open-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Topics</span>
            </div>
            <Button size="sm" @click="onAddTopic">
              <Icon name="lucide:plus" size="16" />
              Add Topic
            </Button>
          </div>
          <TopicsTable
            v-if="academy?.id"
            :topics="academy?.topics || []"
            :academy-id="academy.id"
            @add-topic="onAddTopic"
            @edit-topic="onEditTopic"
            @delete-topic="onDeleteTopic"
            @add-session="onAddSession"
            @edit-session="onEditSession"
            @delete-session="onDeleteSession"
          />
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:chat-bubble-oval-left-ellipsis-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Testimonials</span>
            </div>
            <Button size="sm" @click="onAddTestimonial">
              <Icon name="lucide:plus" size="16" />
              Add Testimonial
            </Button>
          </div>
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-18">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="academy?.testimonials?.length">
                  <TableRow v-for="testimonial in academy?.testimonials" :key="testimonial.id">
                    <TableCell class="w-18">{{ testimonial.order }}</TableCell>
                    <TableCell>{{ testimonial.name }}</TableCell>
                    <TableCell class="max-w-xs truncate" :title="testimonial.comment">{{ testimonial.comment }}</TableCell>
                    <TableCell class="px-4 sticky right-0 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" @click="onEditTestimonial(testimonial)">
                          <Icon name="lucide:edit" class="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          class="hover:bg-destructive/90 hover:text-destructive-foreground"
                          @click="onDeleteTestimonial(testimonial)"
                        >
                          <Icon name="lucide:trash-2" class="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell :colspan="4" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="text-muted-foreground">No testimonials available</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:question-mark-circle-solid" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">FAQs</span>
            </div>
            <Button size="sm" @click="onAddFaq">
              <Icon name="lucide:plus" size="16" />
              Add FAQ
            </Button>
          </div>
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-18">Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="academy?.faqs?.length">
                  <TableRow v-for="faq in academy?.faqs" :key="faq.id">
                    <TableCell class="w-18">{{ faq.order }}</TableCell>
                    <TableCell class="font-medium max-w-xs truncate" :title="faq.question">{{ faq.question }}</TableCell>
                    <TableCell class="max-w-xs truncate" :title="faq.answer">{{ faq.answer }}</TableCell>
                    <TableCell class="px-4 sticky right-0 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" @click="onEditFaq(faq)">
                          <Icon name="lucide:edit" class="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          class="hover:bg-destructive/90 hover:text-destructive-foreground"
                          @click="onDeleteFaq(faq)"
                        >
                          <Icon name="lucide:trash-2" class="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableRow v-else>
                  <TableCell :colspan="4" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="text-muted-foreground">No FAQs available</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>

    <PricingDialog
      v-if="academy?.id"
      :open="pricingDialogOpen"
      :mode="pricingDialogMode"
      :data="selectedPricing"
      :academy-id="academy.id"
      @update:open="pricingDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <FeatureDialog
      v-if="academy?.id"
      :open="featureDialogOpen"
      :mode="featureDialogMode"
      :data="selectedFeature"
      :academy-id="academy.id"
      @update:open="featureDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <InstructorDialog
      v-if="academy?.id"
      :open="instructorDialogOpen"
      :mode="instructorDialogMode"
      :data="selectedInstructor"
      :academy-id="academy.id"
      @update:open="instructorDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <TopicDialog
      v-if="academy?.id"
      :open="topicDialogOpen"
      :mode="topicDialogMode"
      :data="selectedTopic"
      :academy-id="academy.id"
      @update:open="topicDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <TestimonialDialog
      v-if="academy?.id"
      :open="testimonialDialogOpen"
      :mode="testimonialDialogMode"
      :data="selectedTestimonial"
      :academy-id="academy.id"
      @update:open="testimonialDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <FaqDialog
      v-if="academy?.id"
      :open="faqDialogOpen"
      :mode="faqDialogMode"
      :data="selectedFaq"
      :academy-id="academy.id"
      @update:open="faqDialogOpen = $event"
      @success="onDialogSuccess"
    />

    <SessionDialog
      v-if="academy?.id && selectedTopicForSession?.id"
      :open="sessionDialogOpen"
      :mode="sessionDialogMode"
      :data="selectedSession"
      :topic-id="selectedTopicForSession.id"
      :academy-id="academy.id"
      @update:open="sessionDialogOpen = $event"
      @success="onDialogSuccess"
    />

    <DeleteConfirmDialog
      v-model="deleteDialogOpen"
      :title="getDeleteDialogTitle()"
      :pending="deleteDialogPending"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="onConfirmDelete"
    >
      <p>{{ getDeleteDialogContent() }}</p>
      <p>This action cannot be undone.</p>
    </DeleteConfirmDialog>

    <!-- Error state -->
    <div v-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-2">Error Loading Academy</h3>
        <p class="text-muted-foreground mb-4">{{ error.message || 'Failed to load academy data' }}</p>
        <Button @click="refresh" variant="outline">
          <Icon name="lucide:refresh-cw" size="16" class="mr-2" />
          Try Again
        </Button>
      </div>
    </div>

    <!-- Not found state -->
    <div v-if="!pending && !academy && !error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-2">Academy Not Found</h3>
        <p class="text-muted-foreground mb-4">The academy you're looking for doesn't exist.</p>
        <Button as="a" href="/admin/academy" variant="outline">
          <Icon name="lucide:arrow-left" size="16" class="mr-2" />
          Back to Academies
        </Button>
      </div>
    </div>
  </div>
</template>
