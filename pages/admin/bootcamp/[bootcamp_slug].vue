<script setup>
import { ref, computed, shallowRef, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import PricingDialog from '@/components/bootcamps/PricingDialog.vue';
import FeatureDialog from '@/components/bootcamps/FeatureDialog.vue';
import InstructorDialog from '@/components/bootcamps/InstructorDialog.vue';
import TopicDialog from '@/components/bootcamps/TopicDialog.vue';
import TopicsTable from '@/components/bootcamps/TopicsTable.vue';
import SessionDialog from '@/components/bootcamps/SessionDialog.vue';
import TestimonialDialog from '@/components/bootcamps/TestimonialDialog.vue';
import FaqDialog from '@/components/bootcamps/FaqDialog.vue';
import { toast } from 'vue-sonner';

definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});

// File upload composable
const { uploadBootcampImage, isUploading: isImageUploading, uploadError: imageUploadError } = useFileUpload();

const route = useRoute();

const {
  data: bootcamp,
  pending,
  error,
  refresh,
} = await useAPI(`/admin/bootcamps/${route.params.bootcamp_slug}`, {
  key: `admin-bootcamp-${route.params.bootcamp_slug}`,
  transform: (response) => {
    console.log('Bootcamp API response:', response);
    return response?.data || null;
  },
  default: () => null,
});

// Debug logging
watch(
  bootcamp,
  (newBootcamp) => {
    console.log('Bootcamp data changed:', newBootcamp);
    if (newBootcamp) {
      console.log('Bootcamp ID:', newBootcamp.id);
    }
  },
  { immediate: true }
);

// Error logging
watch(
  error,
  (newError) => {
    if (newError) {
      console.error('Bootcamp API error:', newError);
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
const imageUrl = ref('');
const imageFile = ref(null);
const imageFileInputRef = ref(null);
const basicInfoForm = ref({
  title: '',
  status: '',
  category: '',
  duration: '',
  format: '',
  certificate: false,
  portfolio: false,
  description: '',
});

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

// Basic Information form functions
const saveBasicInfo = async () => {
  if (!bootcamp.value) {
    toast.error('Bootcamp data not loaded. Please refresh the page.');
    return;
  }

  if (!bootcamp.value.id) {
    toast.error('Bootcamp ID not found. Please refresh the page.');
    return;
  }

  try {
    basicInfoPending.value = true;

    const payload = {
      title: basicInfoForm.value.title,
      status: basicInfoForm.value.status,
      category: basicInfoForm.value.category,
      duration: basicInfoForm.value.duration,
      format: basicInfoForm.value.format,
      certificate: basicInfoForm.value.certificate,
      portfolio: basicInfoForm.value.portfolio,
      description: basicInfoForm.value.description,
      image_url: imageUrl.value || bootcamp.value.image_url || '',
    };

    console.log('Updating bootcamp with ID:', bootcamp.value.id);
    console.log('Payload:', payload);

    await $api(`/admin/bootcamps/${bootcamp.value.id}`, {
      method: 'PUT',
      body: payload,
    });

    toast.success('Basic information updated successfully');
    refresh(); // Refresh data
  } catch (error) {
    console.error('Update basic info error:', error);
    toast.error(error?.data?.message || 'Failed to update basic information');
  } finally {
    basicInfoPending.value = false;
  }
};

const onDelete = () => {
  deleteDialogOpen.value = true;
};

watch(
  bootcamp,
  (newBootcamp) => {
    if (newBootcamp) {
      basicInfoForm.value = {
        title: newBootcamp.title || '',
        status: newBootcamp.status || '',
        category: newBootcamp.category || '',
        duration: newBootcamp.duration || '',
        format: newBootcamp.format || '',
        certificate: newBootcamp.certificate || false,
        portfolio: newBootcamp.portfolio || false,
        description: newBootcamp.description || '',
      };
      imageUrl.value = newBootcamp.image_url || '';
    }
  },
  { immediate: true }
);

// Image handlers dengan upload functionality
const onPickImage = () => {
  imageFileInputRef.value?.click();
};

const onImageFileChange = async (event) => {
  const files = event?.target?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  imageFile.value = file;

  // Cleanup previous object URL
  if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl.value);
  }

  // Preview image
  let previewUrl = null;
  try {
    previewUrl = URL.createObjectURL(file);
    imageUrl.value = previewUrl;
  } catch (e) {
    console.error('Preview image failed:', e);
  }

  // Upload image
  try {
    const uploadedUrl = await uploadBootcampImage(file);
    if (uploadedUrl) {
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      imageUrl.value = uploadedUrl;
      toast.success('Gambar berhasil diupload');
    } else if (imageUploadError.value) {
      toast.error(imageUploadError.value);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    toast.error('Upload gambar gagal');
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
  if (!bootcamp.value) return;
  const b = bootcamp.value;
  if (Array.isArray(b.pricing)) b.pricing.sort((a, b) => a.tier_order - b.tier_order);
  if (Array.isArray(b.features)) b.features.sort((a, b) => a.feature_order - b.feature_order);
  if (Array.isArray(b.instructors)) b.instructors.sort((a, b) => a.instructor_order - b.instructor_order);
  if (Array.isArray(b.topics)) b.topics.sort((a, b) => a.topic_order - b.topic_order);
  if (Array.isArray(b.testimonials)) b.testimonials.sort((a, b) => a.testimonial_order - b.testimonial_order);
  if (Array.isArray(b.faqs)) b.faqs.sort((a, b) => a.faq_order - b.faq_order);
};

const onDialogSuccess = () => {
  sortByOrder();
  refresh();
};

// Delete confirmation handler
const onConfirmDelete = async () => {
  if (!deleteItem.value || !deleteType.value) return;

  try {
    deleteDialogPending.value = true;

    let endpoint = '';
    let successMessage = '';

    switch (deleteType.value) {
      case 'pricing':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/pricing/${deleteItem.value.id}`;
        successMessage = 'Pricing deleted successfully';
        break;
      case 'feature':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/features/${deleteItem.value.id}`;
        successMessage = 'Feature deleted successfully';
        break;
      case 'instructor':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/instructors/${deleteItem.value.instructor_id}`;
        successMessage = 'Instructor removed successfully';
        break;
      case 'topic':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/topics/${deleteItem.value.id}`;
        successMessage = 'Topic deleted successfully';
        break;
      case 'testimonial':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/testimonials/${deleteItem.value.id}`;
        successMessage = 'Testimonial deleted successfully';
        break;
      case 'faq':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/faqs/${deleteItem.value.id}`;
        successMessage = 'FAQ deleted successfully';
        break;
      case 'session':
        endpoint = `/admin/bootcamps/${bootcamp.value.id}/topics/${deleteItem.value.topic.id}/sessions/${deleteItem.value.id}`;
        successMessage = 'Session deleted successfully';
        break;
      default:
        throw new Error('Unknown delete type');
    }

    await $api(endpoint, {
      method: 'DELETE',
    });

    toast.success(successMessage);
    deleteDialogOpen.value = false;
    if (bootcamp.value) {
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
      if (key && Array.isArray(bootcamp.value?.[key])) {
        if (deleteType.value === 'session') {
          // Handle session deletion from nested structure
          const topicId = deleteItem.value.topic.id;
          const sessionId = deleteItem.value.id;
          const topic = bootcamp.value?.topics?.find((t) => t.id === topicId);
          if (topic && Array.isArray(topic.sessions)) {
            topic.sessions = topic.sessions.filter((s) => s.id !== sessionId);
          }
        } else {
          const idKey = deleteType.value === 'instructor' ? 'instructor_id' : 'id';
          bootcamp.value[key] = bootcamp.value?.[key]?.filter(
            (item) => item[idKey] !== (deleteType.value === 'instructor' ? deleteItem.value.instructor_id : deleteItem.value.id)
          );
        }
        sortByOrder();
      }
    }
    refresh();
  } catch (error) {
    console.error('Delete error:', error);
    toast.error(error?.data?.message || `Failed to delete ${deleteType.value}`);
  } finally {
    deleteDialogPending.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <div v-if="pending" class="fixed top-14 left-0 right-0 z-30">
        <div class="h-1 w-full bg-primary/20"><div class="h-1 w-1/2 bg-primary animate-pulse"></div></div>
      </div>
      <div v-if="!pending && bootcamp" class="space-y-6">
        <section class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <Button as="a" href="/admin/bootcamp" variant="outline" class="flex items-center gap-2">
              <Icon name="lucide:arrow-left" size="18" />
              Back
            </Button>
            <Button @click="saveBasicInfo" :disabled="basicInfoPending">
              <Icon name="lucide:circle-check" size="16" />
              {{ basicInfoPending ? 'Saving...' : 'Save Info' }}
            </Button>
          </div>

          <div class="space-y-6">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-1">
                <div class="w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative">
                  <img
                    v-if="imageUrl || bootcamp?.image_url"
                    :src="imageUrl || bootcamp?.image_url"
                    alt="Bootcamp Image"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                    <div class="text-center">
                      <Icon name="lucide:image" size="48" class="mx-auto mb-2" />
                      <p>No image selected</p>
                    </div>
                  </div>

                  <!-- Loading overlay -->
                  <div v-if="isImageUploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="text-white text-center">
                      <Icon name="lucide:loader-2" size="24" class="animate-spin mx-auto mb-2" />
                      <p>Uploading...</p>
                    </div>
                  </div>
                </div>

                <!-- Error message -->
                <div v-if="imageUploadError" class="mt-2 text-sm text-red-600">
                  {{ imageUploadError }}
                </div>

                <div class="mt-3 flex gap-2">
                  <input ref="imageFileInputRef" type="file" accept="image/*" class="hidden" @change="onImageFileChange" />
                  <Button variant="outline" size="sm" class="w-full" @click="onPickImage" :disabled="isImageUploading">
                    <Icon name="lucide:image" size="16" />
                    {{ isImageUploading ? 'Uploading...' : 'Upload Image' }}
                  </Button>
                </div>
              </div>
              <div class="flex-4 space-y-4">
                <div>
                  <Label class="text-sm font-medium text-muted-foreground">Title</Label>
                  <Input v-model="basicInfoForm.title" class="mt-1 w-full" placeholder="Enter bootcamp title" />
                </div>
                <div>
                  <Label class="text-sm font-medium text-muted-foreground">Description</Label>
                  <Textarea v-model="basicInfoForm.description" class="mt-1 w-full min-h-36" placeholder="Enter bootcamp description" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Duration</Label>
                <Input v-model="basicInfoForm.duration" class="mt-1 w-full" placeholder="e.g., 3 bulan" />
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Category</Label>
                <Input v-model="basicInfoForm.category" class="mt-1 w-full" placeholder="Enter category" />
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Format</Label>
                <Input v-model="basicInfoForm.format" class="mt-1 w-full" placeholder="e.g., Online Live Classes" />
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Status</Label>
                <Select v-model="basicInfoForm.status">
                  <SelectTrigger class="mt-1 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Certificate</Label>
                <Select v-model="basicInfoForm.certificate">
                  <SelectTrigger class="mt-1 w-full">
                    <SelectValue placeholder="Select certificate option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="true">Yes</SelectItem>
                    <SelectItem :value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Portfolio</Label>
                <Select v-model="basicInfoForm.portfolio">
                  <SelectTrigger class="mt-1 w-full">
                    <SelectValue placeholder="Select portfolio option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="true">Yes</SelectItem>
                    <SelectItem :value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:currency-dollar-solid" size="18" class="text-white" />
              </div>
              <span>Pricing</span>
            </div>
            <Button size="sm" @click="onAddPricing">
              <Icon name="lucide:plus" size="16" />
              Add Pricing
            </Button>
          </div>

          <div v-if="bootcamp?.pricing?.length" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Discount Price</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="price in bootcamp?.pricing" :key="price.id">
                  <TableCell>{{ price.tier_order }}</TableCell>
                  <TableCell>{{ price.name }}</TableCell>
                  <TableCell>{{ formatCurrency(price.original_price) }}</TableCell>
                  <TableCell>{{ formatCurrency(price.discount_price) }}</TableCell>
                  <TableCell class="px-4 sticky right-0 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" @click="onEditPricing(price)">
                        <Icon name="lucide:edit" class="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDeletePricing(price)">
                        <Icon name="lucide:trash-2" class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:dollar-sign" class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pricing data available</p>
          </div>
        </section>
        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:clipboard-document-check-solid" size="18" class="text-white" />
              </div>
              <span>Featured Benefits</span>
            </div>
            <Button size="sm" @click="onAddFeature">
              <Icon name="lucide:plus" size="16" />
              Add Feature
            </Button>
          </div>

          <div v-if="bootcamp?.features?.length" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="feature in bootcamp?.features" :key="feature.id">
                  <TableCell>{{ feature.feature_order }}</TableCell>
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
                      <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDeleteFeature(feature)">
                        <Icon name="lucide:trash-2" class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:check-circle" class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No features available</p>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:users-solid" size="18" class="text-white" />
              </div>
              <span>Instructors</span>
            </div>
            <Button size="sm" @click="onAddInstructor">
              <Icon name="lucide:plus" size="16" />
              Add Instructor
            </Button>
          </div>
          <div v-if="bootcamp?.instructors?.length" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="instructorData in bootcamp?.instructors" :key="instructorData.instructor_id">
                  <TableCell>{{ instructorData.instructor_order }}</TableCell>
                  <TableCell>{{ instructorData.name || '-' }}</TableCell>
                  <TableCell class="max-w-xs truncate" :title="instructorData.job_title">{{ instructorData.job_title || '-' }}</TableCell>
                  <TableCell class="max-w-xs truncate" :title="instructorData.description">{{ instructorData.description || '-' }}</TableCell>
                  <TableCell class="px-4 sticky right-0 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" @click="onEditInstructor(instructorData)">
                        <Icon name="lucide:edit" class="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDeleteInstructor(instructorData)">
                        <Icon name="lucide:trash-2" class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:users" class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No instructors available</p>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:book-open-solid" size="18" class="text-white" />
              </div>
              <span>Topics</span>
            </div>
            <Button size="sm" @click="onAddTopic">
              <Icon name="lucide:plus" size="16" />
              Add Topic
            </Button>
          </div>
          <TopicsTable
            v-if="bootcamp?.id"
            :topics="bootcamp?.topics || []"
            :bootcamp-id="bootcamp.id"
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
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:chat-bubble-oval-left-ellipsis-solid" size="18" class="text-white" />
              </div>
              <span>Testimonials</span>
            </div>
            <Button size="sm" @click="onAddTestimonial">
              <Icon name="lucide:plus" size="16" />
              Add Testimonial
            </Button>
          </div>
          <div v-if="bootcamp?.testimonials?.length" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="testimonial in bootcamp?.testimonials" :key="testimonial.id">
                  <TableCell>{{ testimonial.testimonial_order }}</TableCell>
                  <TableCell>{{ testimonial.name }}</TableCell>
                  <TableCell class="max-w-xs truncate" :title="testimonial.comment">{{ testimonial.comment }}</TableCell>
                  <TableCell class="px-4 sticky right-0 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" @click="onEditTestimonial(testimonial)">
                        <Icon name="lucide:edit" class="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDeleteTestimonial(testimonial)">
                        <Icon name="lucide:trash-2" class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:message-circle" class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No testimonials available</p>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="heroicons:question-mark-circle-solid" size="18" class="text-white" />
              </div>
              <span>FAQs</span>
            </div>
            <Button size="sm" @click="onAddFaq">
              <Icon name="lucide:plus" size="16" />
              Add FAQ
            </Button>
          </div>
          <div v-if="bootcamp?.faqs?.length" class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead class="px-4 sticky right-0 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="faq in bootcamp?.faqs" :key="faq.id">
                  <TableCell>{{ faq.faq_order }}</TableCell>
                  <TableCell class="font-medium max-w-xs truncate" :title="faq.question">{{ faq.question }}</TableCell>
                  <TableCell class="max-w-xs truncate" :title="faq.answer">{{ faq.answer }}</TableCell>
                  <TableCell class="text-muted-foreground text-sm">{{ new Date(faq.created_at).toLocaleDateString() }}</TableCell>
                  <TableCell class="px-4 sticky right-0 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" @click="onEditFaq(faq)">
                        <Icon name="lucide:edit" class="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDeleteFaq(faq)">
                        <Icon name="lucide:trash-2" class="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="lucide:help-circle" class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No FAQs available</p>
          </div>
        </section>
      </div>
    </div>

    <PricingDialog
      v-if="bootcamp?.id"
      :open="pricingDialogOpen"
      :mode="pricingDialogMode"
      :data="selectedPricing"
      :bootcamp-id="bootcamp.id"
      @update:open="pricingDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <FeatureDialog
      v-if="bootcamp?.id"
      :open="featureDialogOpen"
      :mode="featureDialogMode"
      :data="selectedFeature"
      :bootcamp-id="bootcamp.id"
      @update:open="featureDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <InstructorDialog
      v-if="bootcamp?.id"
      :open="instructorDialogOpen"
      :mode="instructorDialogMode"
      :data="selectedInstructor"
      :bootcamp-id="bootcamp.id"
      @update:open="instructorDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <TopicDialog
      v-if="bootcamp?.id"
      :open="topicDialogOpen"
      :mode="topicDialogMode"
      :data="selectedTopic"
      :bootcamp-id="bootcamp.id"
      @update:open="topicDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <TestimonialDialog
      v-if="bootcamp?.id"
      :open="testimonialDialogOpen"
      :mode="testimonialDialogMode"
      :data="selectedTestimonial"
      :bootcamp-id="bootcamp.id"
      @update:open="testimonialDialogOpen = $event"
      @success="onDialogSuccess"
    />
    <FaqDialog
      v-if="bootcamp?.id"
      :open="faqDialogOpen"
      :mode="faqDialogMode"
      :data="selectedFaq"
      :bootcamp-id="bootcamp.id"
      @update:open="faqDialogOpen = $event"
      @success="onDialogSuccess"
    />

    <SessionDialog
      v-if="bootcamp?.id && selectedTopicForSession?.id"
      :open="sessionDialogOpen"
      :mode="sessionDialogMode"
      :data="selectedSession"
      :topic-id="selectedTopicForSession.id"
      :bootcamp-id="bootcamp.id"
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

    <!-- Loading state -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading bootcamp...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Icon name="lucide:alert-circle" size="48" class="text-destructive mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Error Loading Bootcamp</h3>
        <p class="text-muted-foreground mb-4">{{ error.message || 'Failed to load bootcamp data' }}</p>
        <Button @click="refresh" variant="outline">
          <Icon name="lucide:refresh-cw" size="16" class="mr-2" />
          Try Again
        </Button>
      </div>
    </div>

    <!-- Not found state -->
    <div v-if="!pending && !bootcamp && !error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Icon name="lucide:search-x" size="48" class="text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Bootcamp Not Found</h3>
        <p class="text-muted-foreground mb-4">The bootcamp you're looking for doesn't exist.</p>
        <Button as="a" href="/admin/bootcamp" variant="outline">
          <Icon name="lucide:arrow-left" size="16" class="mr-2" />
          Back to Bootcamps
        </Button>
      </div>
    </div>
  </div>
</template>
