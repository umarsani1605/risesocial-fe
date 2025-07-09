// Mock register endpoint untuk demo mode
// Menambahkan user baru ke mock database agar bisa login

// Import mock users dari auth handler (share reference)
const MOCK_USERS: any[] = (globalThis as any).__MOCK_USERS__ || [];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  console.log('🎭 DEMO MODE: Mock register endpoint called');
  
  // Simulasi delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if email already exists
  const existingUser = MOCK_USERS.find(user => user.email === body.email);
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already exists'
    });
  }
  
  // Create new mock user
  const newUser = {
    id: 'demo-user-' + Date.now(),
    email: body.email,
    password: body.password,
    first_name: body.firstName || 'New',
    last_name: body.lastName || 'User',
    role: 'USER',
    avatar: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to mock database
  MOCK_USERS.push(newUser);
  
  // Store globally untuk diakses auth handler
  (globalThis as any).__MOCK_USERS__ = MOCK_USERS;
  
  console.log('✅ DEMO MODE: User registered successfully:', newUser.email);
  
  return {
    success: true,
    data: {
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      },
      token: 'demo-jwt-token-' + Date.now(),
      expiresIn: '1 day'
    },
    message: 'User registered successfully'
  };
}); 