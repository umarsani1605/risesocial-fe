import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

// Initialize global mock users database untuk demo
if (!(globalThis as any).__MOCK_USERS__) {
  (globalThis as any).__MOCK_USERS__ = [
    {
      id: 'demo-user-001',
      email: 'demo@risesocial.org',
      password: 'password123',
      first_name: 'Demo',
      last_name: 'User',
      role: 'USER',
      avatar: null
    }
  ];
}

// Get mock users dari global storage
const getMockUsers = () => (globalThis as any).__MOCK_USERS__ || [];

const authOptions: AuthOptions = {
  secret: useRuntimeConfig().authSecret,
  
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' }
      },
      async authorize(credentials: any) {
        try {
          // Mock authentication - untuk demo frontend saja
          console.log('🚀 DEMO MODE: Mock authentication in progress...')
          
          // Simulasi delay network
          await new Promise(resolve => setTimeout(resolve, 800))
          
          // Cari user di mock database
          const mockUsers = getMockUsers();
          const mockUser = mockUsers.find((user: any) => 
            user.email === credentials?.email && 
            user.password === credentials?.password
          );
          
          if (mockUser) {
            console.log('✅ DEMO MODE: Login successful!')
            
            // Return user object sesuai dengan NextAuth.js format
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: `${mockUser.first_name} ${mockUser.last_name}`.trim(),
              firstName: mockUser.first_name,
              lastName: mockUser.last_name,
              role: mockUser.role,
              avatar: mockUser.avatar,
              accessToken: 'demo-jwt-token-' + Date.now() // Mock token
            }
          }
          
          console.log('❌ DEMO MODE: Invalid credentials')
          return null
        } catch (error) {
          console.error('DEMO MODE Auth error:', error)
          return null
        }
      }
    }
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          id: (user as any).id,
          role: (user as any).role,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          avatar: (user as any).avatar,
          name: (user as any).name,
        }
      }

      // Return previous token if the access token has not expired yet
      return token
    },
    
    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name as string || `${token.firstName} ${token.lastName}`.trim(),
          role: token.role as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          avatar: token.avatar as string,
        },
        accessToken: token.accessToken as string,
      }
    }
  },
  
  pages: {
    signIn: '/', // Custom sign in page
    error: '/' // Error code passed in query string as ?error=
  }
}

export default NuxtAuthHandler(authOptions) 