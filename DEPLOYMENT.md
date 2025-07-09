# 🚀 Deployment Guide - Rise Social Frontend

## Netlify Deployment

### ❌ Error AUTH_NO_ORIGIN

Jika Anda mendapatkan error ini saat deploy:
```
AUTH_NO_ORIGIN: No `origin` - this is an error in production
```

### ✅ Solusi

#### 1. Set Environment Variables di Netlify

Buka **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

```bash
# Required untuk NextAuth.js
NEXTAUTH_URL=https://your-site-name.netlify.app
AUTH_ORIGIN=https://your-site-name.netlify.app
NUXT_AUTH_SECRET=generate-random-secret-key-here

# Optional - Backend URL (untuk production nanti)
NUXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

#### 2. Generate AUTH_SECRET

Untuk generate random secret key:
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# https://generate-secret.vercel.app/32
```

#### 3. Update Site URL

Ganti `your-site-name` dengan nama site Netlify Anda:
- Jika site name: `rise-social-demo`
- Maka URL: `https://rise-social-demo.netlify.app`

#### 4. Deploy Ulang

Setelah set environment variables, trigger deploy ulang:
- Push code baru, atau
- Manual deploy dari Netlify dashboard

### 🔧 Local Development

Untuk development lokal, buat file `.env`:
```bash
# .env
NEXTAUTH_URL=http://localhost:3000
AUTH_ORIGIN=http://localhost:3000
NUXT_AUTH_SECRET=your-local-secret-key
NUXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 🎭 Demo Mode

Aplikasi ini menggunakan demo mode untuk frontend-only demo:
- **Login**: `demo@risesocial.org` / `password123`
- **Register**: Email/password apapun
- Tidak memerlukan backend untuk demo

### 📝 Deployment Checklist

- [ ] Set `NEXTAUTH_URL` environment variable
- [ ] Set `AUTH_ORIGIN` environment variable  
- [ ] Generate dan set `NUXT_AUTH_SECRET`
- [ ] Verify site URL benar
- [ ] Test login/logout functionality
- [ ] Check console tidak ada error AUTH_NO_ORIGIN

### 🆘 Troubleshooting

**Still getting AUTH_NO_ORIGIN?**
1. Double-check environment variables spelling
2. Ensure URLs tidak ada trailing slash
3. Verify site sudah fully deployed
4. Check Netlify functions logs untuk error details

**Demo not working?**
1. Check browser console untuk JavaScript errors
2. Verify demo credentials: `demo@risesocial.org` / `password123`
3. Try register dengan email baru

### 📚 Resources

- [Sidebase Nuxt Auth Docs](https://sidebase.io/nuxt-auth/)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/) 