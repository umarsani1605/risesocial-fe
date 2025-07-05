<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

// Define component props and events
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

// @sidebase/nuxt-auth composables
const { signIn, data: session, status } = useAuth();

// Local state
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

// State to toggle between login and register
const isRegisterMode = ref(false);

// Error state
const errorMessage = ref('');
const isLoading = ref(false);

// Form states
const loginForm = ref({
  email: '',
  password: '',
  keepSignedIn: false,
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// Password visibility
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Handle login menggunakan @sidebase/nuxt-auth
const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const result = await signIn('credentials', {
      email: loginForm.value.email,
      password: loginForm.value.password,
      rememberMe: loginForm.value.keepSignedIn,
      redirect: false,
    });

    if (result?.error) {
      errorMessage.value = 'Invalid email or password';
    } else {
      // Login successful
      isOpen.value = false;
      await navigateTo('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'An error occurred during login';
  } finally {
    isLoading.value = false;
  }
};

// Handle register - still using direct API call since NextAuth doesn't handle registration
const handleRegister = async () => {
  errorMessage.value = '';
  isLoading.value = false;

  // Validate passwords match
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  isLoading.value = true;

  try {
    // Split name into firstName and lastName
    const nameParts = registerForm.value.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const config = useRuntimeConfig();
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: firstName,
        lastName: lastName,
        email: registerForm.value.email,
        phone: '', // Optional field
        password: registerForm.value.password,
      },
      baseURL: config.public.backendUrl,
    });

    if (response.success && response.data) {
      // After successful registration, auto-login
      await signIn('credentials', {
        email: registerForm.value.email,
        password: registerForm.value.password,
        redirect: false,
      });

      isOpen.value = false;
      await navigateTo('/');
    } else {
      errorMessage.value = response.error || 'Registration failed';
    }
  } catch (error) {
    console.error('Register error:', error);
    errorMessage.value = error.data?.error || error.message || 'Registration failed';
  } finally {
    isLoading.value = false;
  }
};

// Toggle between login and register
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  errorMessage.value = '';
};

// Reset forms when dialog closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    loginForm.value = { email: '', password: '', keepSignedIn: false };
    registerForm.value = { name: '', email: '', password: '', confirmPassword: '' };
    isRegisterMode.value = false;
    showPassword.value = false;
    showConfirmPassword.value = false;
    errorMessage.value = '';
    isLoading.value = false;
  }
});
</script>

<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="sm:max-w-lg p-8">
      <!-- Header -->
      <DialogHeader class="mb-4">
        <DialogTitle class="text-2xl font-bold">
          {{ isRegisterMode ? 'Create Account' : 'Login to Rise Social' }}
        </DialogTitle>
      </DialogHeader>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Login Form -->
      <form v-if="!isRegisterMode" @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Email</label>
          <Input type="email" v-model="loginForm.email" class="bg-gray-50" required />
        </div>

        <!-- Password Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Password</label>
          <div class="relative">
            <Input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" class="bg-gray-50" required />
          </div>
        </div>

        <!-- Keep me signed in & Forgot password -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <Checkbox id="keep-signed-in" :checked="loginForm.keepSignedIn" @update:checked="loginForm.keepSignedIn = $event" class="bg-gray-50" />
            <label for="keep-signed-in" class="cursor-pointer text-sm"> Keep me signed in </label>
          </div>
          <button type="button" class="text-primary cursor-pointer text-sm">Forgotten password?</button>
        </div>

        <!-- Login Button -->
        <Button type="submit" class="w-full" size="lg" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </Button>

        <!-- Register Link -->
        <div class="">
          <span class="text-sm">Don't you have an account? </span>
          <button type="button" @click="toggleMode" class="text-primary cursor-pointer text-sm">Register</button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Full Name</label>
          <Input type="text" v-model="registerForm.name" class="bg-gray-50" required />
        </div>

        <!-- Email Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Email</label>
          <Input type="email" v-model="registerForm.email" class="bg-gray-50" required />
        </div>

        <!-- Password Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Password</label>
          <div class="relative">
            <Input :type="showPassword ? 'text' : 'password'" v-model="registerForm.password" class="bg-gray-50" required />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Confirm Password</label>
          <div class="relative">
            <Input :type="showConfirmPassword ? 'text' : 'password'" v-model="registerForm.confirmPassword" class="bg-gray-50" required />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Register Button -->
        <Button type="submit" class="w-full" size="lg" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </Button>

        <!-- Login Link -->
        <div class="text-center">
          <span class="text-sm">Already have an account? </span>
          <button type="button" @click="toggleMode" class="text-primary cursor-pointer text-sm">Login</button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
