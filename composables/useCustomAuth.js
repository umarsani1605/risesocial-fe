/**
 * Custom Auth Composable untuk Demo Mode
 * Menggantikan @sidebase/nuxt-auth yang bermasalah dengan URL parsing
 */

export const useCustomAuth = () => {
  // State management menggunakan useState (Nuxt)
  const user = useState('auth.user', () => null);
  const isLoggedIn = computed(() => !!user.value);
  const status = computed(() => (isLoggedIn.value ? 'authenticated' : 'unauthenticated'));

  /**
   * Demo credentials
   */
  const DEMO_CREDENTIALS = {
    email: 'demo@risesocial.org',
    password: 'password123',
  };

  /**
   * Sign in function
   */
  const signIn = async (credentials) => {
    console.log('🎭 Custom Auth: Sign in attempt');

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check demo credentials
      if (credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password) {
        const userData = {
          id: 'demo-user-001',
          email: DEMO_CREDENTIALS.email,
          name: 'Demo User',
          firstName: 'Demo',
          lastName: 'User',
          role: 'USER',
          avatar: null,
        };

        // Set user state
        user.value = userData;

        // Store in localStorage untuk persistence
        if (process.client) {
          localStorage.setItem('demo-auth-user', JSON.stringify(userData));
        }

        console.log('✅ Custom Auth: Login successful');
        return { success: true };
      }

      // Check registered users (untuk register demo)
      const registeredUsers = process.client ? JSON.parse(localStorage.getItem('demo-registered-users') || '[]') : [];

      const registeredUser = registeredUsers.find((u) => u.email === credentials.email && u.password === credentials.password);

      if (registeredUser) {
        const userData = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: `${registeredUser.firstName} ${registeredUser.lastName}`.trim(),
          firstName: registeredUser.firstName,
          lastName: registeredUser.lastName,
          role: 'USER',
          avatar: null,
        };

        user.value = userData;

        if (process.client) {
          localStorage.setItem('demo-auth-user', JSON.stringify(userData));
        }

        console.log('✅ Custom Auth: Login successful (registered user)');
        return { success: true };
      }

      console.log('❌ Custom Auth: Invalid credentials');
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Custom Auth error:', error);
      throw error;
    }
  };

  /**
   * Sign up function
   */
  const signUp = async (userData) => {
    console.log('🎭 Custom Auth: Sign up attempt');

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser = {
        id: 'demo-user-' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString(),
      };

      // Store registered user
      if (process.client) {
        const registeredUsers = JSON.parse(localStorage.getItem('demo-registered-users') || '[]');

        // Check if email already exists
        if (registeredUsers.find((u) => u.email === userData.email)) {
          throw new Error('Email already exists');
        }

        registeredUsers.push(newUser);
        localStorage.setItem('demo-registered-users', JSON.stringify(registeredUsers));
      }

      console.log('✅ Custom Auth: Registration successful');
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Custom Auth register error:', error);
      throw error;
    }
  };

  /**
   * Sign out function
   */
  const signOut = async () => {
    console.log('🎭 Custom Auth: Sign out');

    user.value = null;

    if (process.client) {
      localStorage.removeItem('demo-auth-user');
    }

    console.log('✅ Custom Auth: Signed out');
  };

  /**
   * Initialize auth state (untuk restore session)
   */
  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('demo-auth-user');
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser);
          console.log('🔄 Custom Auth: Session restored');
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('demo-auth-user');
        }
      }
    }
  };

  // Initialize on composable creation
  if (process.client && !user.value) {
    initAuth();
  }

  return {
    // State
    user: readonly(user),
    isLoggedIn,
    status,

    // Methods
    signIn,
    signUp,
    signOut,
    initAuth,

    // Legacy compatibility dengan @sidebase/nuxt-auth
    data: computed(() => ({ user: user.value })),
  };
};
