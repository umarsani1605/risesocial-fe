import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

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
          const config = useRuntimeConfig()
          
          // Call backend Fastify untuk login
          const response: any = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
              email: credentials?.email,
              password: credentials?.password,
              rememberMe: credentials?.rememberMe === 'true'
            },
            baseURL: config.public.backendUrl,
          })

          console.log("response login: " + JSON.stringify(response))

          if (response.success && response.data) {
            // Return user object sesuai dengan NextAuth.js format
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: `${response.data.user.first_name} ${response.data.user.last_name}`.trim(),
              firstName: response.data.user.first_name,
              lastName: response.data.user.last_name,
              role: response.data.user.role,
              avatar: response.data.user.avatar,
              accessToken: response.data.token
            }
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
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