# Rise Social - Green Jobs Platform

Platform pekerjaan hijau terdepan untuk karir berkelanjutan di Asia Tenggara.

## 🚀 Fitur Utama

- **AI Career Buddy**: Rekomendasi pekerjaan dan kursus yang dipersonalisasi
- **CV & Proposal Builder**: Tools untuk membuat resume dan proposal yang profesional
- **Job Alert Emails**: Notifikasi pekerjaan hijau terbaru
- **Green Job Opportunities**: 40,000+ lowongan pekerjaan berkelanjutan
- **Educational Programs**: Program eksklusif Rise Social

## 🎨 Page Transitions

Aplikasi ini menggunakan **simple fade transition** untuk memberikan pengalaman navigasi yang smooth dan tidak mengganggu:

### Global Configuration
```typescript
// nuxt.config.ts
app: {
  pageTransition: { 
    name: 'fade', 
    mode: 'out-in' 
  },
  layoutTransition: { 
    name: 'fade', 
    mode: 'out-in' 
  }
}
```

### Fade Transition CSS
```css
/* Simple fade transition untuk semua halaman */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Keunggulan Simple Fade Transition

- ✅ **Performa Optimal**: Hanya menggunakan opacity, tidak ada transform yang berat
- ✅ **User-Friendly**: Tidak mengganggu atau membingungkan user
- ✅ **Konsisten**: Semua halaman menggunakan transisi yang sama
- ✅ **Accessible**: Ramah untuk user dengan motion sensitivity
- ✅ **Fast Loading**: Durasi singkat (0.3s) untuk responsivitas yang baik

## 🛠️ Tech Stack

- **Framework**: Nuxt.js 3
- **Styling**: Tailwind CSS + shadcn-vue
- **Icons**: Nuxt Icon
- **Images**: Nuxt Image
- **Fonts**: Nuxt Fonts
- **Transitions**: Vue Transitions + Custom CSS

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🎯 Development

### Mengapa Fade Transition?

Kami memilih fade transition karena:

1. **Simplicity**: Mudah dipahami dan tidak membingungkan user
2. **Performance**: Hanya menggunakan opacity, sangat ringan untuk browser
3. **Accessibility**: Tidak menyebabkan motion sickness atau gangguan visual
4. **Consistency**: Memberikan pengalaman yang konsisten di semua halaman
5. **Fast**: Durasi 0.3s memberikan feedback yang cepat tanpa terasa lambat

### Transition Best Practices

- ✅ Gunakan `mode: 'out-in'` untuk transisi yang smooth
- ✅ Durasi optimal: 0.3s untuk responsivitas terbaik
- ✅ Hindari transform yang kompleks untuk performa optimal
- ✅ Test di berbagai device dan koneksi internet
- ✅ Pertimbangkan accessibility untuk semua user

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

**PT. Rise Edukasi Inspirasi** - Empowering youth across Southeast Asia through green career opportunities.
