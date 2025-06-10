/**
 * Composable untuk mengelola data bootcamp
 * @returns {object} Object berisi data dan methods bootcamp
 */
export const useBootcamps = () => {
  // Data bootcamp programs
  const bootcampsData = [
    {
      id: 1,
      title: 'Bootcamp ESG',
      name: 'ESG (Environmental, Social, and Governance) Comprehensive Program',
      path_slug: 'bootcamp-esg',
      description:
        'Comprehensive ESG (Environmental, Social, and Governance) program covering sustainability reporting, compliance, and strategic implementation for organizations. Master the fundamentals of ESG framework, learn to create impactful sustainability reports, and develop strategies for stakeholder engagement.',
      duration: '3 bulan',
      level: 'Intermediate',
      format: 'Online Live Classes',
      price: 2500000,
      image: '/images/bootcamp/esg-bootcamp.jpg',
      color: 'from-blue-500 to-blue-700',
      materialCount: 45,
      rating: 4.8,
      ratingCount: 127,
      certificate: true,
      syllabus: [
        {
          id: 1,
          title: 'ESG Framework & Fundamentals',
          description: 'Memahami konsep dasar ESG, standar internasional, dan regulasi yang berlaku di berbagai industri.',
        },
        {
          id: 2,
          title: 'Environmental Sustainability',
          description: 'Mempelajari aspek lingkungan dalam ESG termasuk carbon footprint, waste management, dan energy efficiency.',
        },
        {
          id: 3,
          title: 'Social Responsibility & Governance',
          description: 'Mendalami aspek sosial dan tata kelola perusahaan yang baik dalam konteks sustainability.',
        },
        {
          id: 4,
          title: 'ESG Reporting & Disclosure',
          description: 'Belajar membuat laporan ESG yang komprehensif sesuai dengan standar GRI, SASB, dan TCFD.',
        },
        {
          id: 5,
          title: 'ESG Risk Assessment & Management',
          description: 'Mengidentifikasi, menganalisis, dan mengelola risiko ESG dalam operasional bisnis.',
        },
        {
          id: 6,
          title: 'Stakeholder Engagement Strategy',
          description: 'Merancang strategi komunikasi dan engagement dengan berbagai stakeholder terkait isu ESG.',
        },
      ],
      instructor: {
        name: 'Dr. Maya Sari',
        expertise: 'ESG Strategy & Sustainability Consultant',
        avatar: '/images/teams/maya-sari.jpg',
        description:
          'Lebih dari 15 tahun pengalaman dalam sustainability consulting untuk perusahaan multinasional. Tersertifikasi GRI Trainer dan SASB Standards Specialist. Telah membantu lebih dari 50 perusahaan dalam implementasi strategi ESG.',
      },
      testimonials: [
        {
          id: 1,
          name: 'Budi Santoso',
          avatar: '/images/testimonials/budi.jpg',
          comment:
            'Bootcamp ESG yang sangat komprehensif! Materinya up-to-date dan aplikatif langsung untuk pekerjaan saya di sustainability department.',
        },
        {
          id: 2,
          name: 'Sari Dewi',
          avatar: '/images/testimonials/sari.jpg',
          comment:
            'Instruktur sangat berpengalaman dan memberikan insight praktis dari industri. Highly recommended untuk professional yang ingin career switch ke sustainability.',
        },
        {
          id: 3,
          name: 'Ahmad Rahman',
          avatar: '/images/testimonials/ahmad.jpg',
          comment: 'Program yang terstruktur dengan baik. Live session sangat interaktif dan mendapat feedback langsung dari mentor.',
        },
      ],
      faq: [
        {
          id: 1,
          question: 'Apakah bootcamp ini cocok untuk pemula?',
          answer:
            'Ya, meskipun level intermediate, kami menyediakan materi foundational di awal program. Yang penting adalah komitmen untuk belajar dan basic understanding tentang business.',
        },
        {
          id: 2,
          question: 'Bagaimana format live class-nya?',
          answer: 'Live class dilakukan 2x seminggu via Zoom, masing-masing 2 jam. Semua session akan direkam dan bisa diakses kapan saja.',
        },
        {
          id: 3,
          question: 'Apakah ada job placement guarantee?',
          answer:
            'Kami memiliki job accelerator program dengan hiring partners, namun tidak ada guarantee. Yang kami jamin adalah career coaching dan networking opportunities.',
        },
        {
          id: 4,
          question: 'Apakah mendapat sertifikat?',
          answer: 'Ya, peserta yang menyelesaikan program akan mendapat sertifikat completion dari Rise Social yang diakui industri.',
        },
      ],
    },
    {
      id: 2,
      title: 'Bootcamp Carbon Footprint',
      name: 'Carbon Accounting & Footprint Management Program',
      path_slug: 'bootcamp-carbon-footprint',
      description:
        'Learn carbon accounting, measurement, and reduction strategies. Master tools and methodologies for calculating and managing organizational carbon footprints. Become expert in Life Cycle Assessment (LCA) and carbon verification processes.',
      duration: '2 bulan',
      level: 'Beginner',
      format: 'Online Live Classes',
      price: 1800000,
      image: '/images/bootcamp/carbon-bootcamp.jpg',
      color: 'from-green-500 to-green-700',
      materialCount: 32,
      rating: 4.7,
      ratingCount: 89,
      certificate: true,
      syllabus: [
        {
          id: 1,
          title: 'Introduction to Carbon Footprint',
          description: 'Memahami konsep carbon footprint, greenhouse gas protocol, dan standar internasional dalam carbon accounting.',
        },
        {
          id: 2,
          title: 'Carbon Calculation Methodologies',
          description: 'Mempelajari berbagai metodologi perhitungan carbon footprint untuk scope 1, 2, dan 3 emissions.',
        },
        {
          id: 3,
          title: 'Life Cycle Assessment (LCA)',
          description: 'Mendalami teknik LCA untuk menganalisis dampak lingkungan produk dari cradle to grave.',
        },
        {
          id: 4,
          title: 'Carbon Reduction Strategies',
          description: 'Merancang strategi pengurangan emisi karbon yang efektif dan cost-efficient untuk organisasi.',
        },
        {
          id: 5,
          title: 'Carbon Offsetting & Credits',
          description: 'Memahami mekanisme carbon offset, carbon credits, dan voluntary carbon markets.',
        },
        {
          id: 6,
          title: 'Verification & Reporting',
          description: 'Proses verifikasi carbon footprint dan pelaporan sesuai standar internasional.',
        },
      ],
      instructor: {
        name: 'Ir. Bambang Wijaya',
        expertise: 'Carbon Management & LCA Specialist',
        avatar: '/images/teams/bambang-wijaya.jpg',
        description:
          'Carbon management expert dengan 12 tahun pengalaman di sektor energi dan manufacturing. Bersertifikat ISO 14067 Lead Auditor dan memiliki track record membantu perusahaan mencapai net zero emissions.',
      },
      testimonials: [
        {
          id: 1,
          name: 'Lisa Permata',
          avatar: '/images/testimonials/lisa.jpg',
          comment: 'Bootcamp yang sangat praktis! Saya langsung bisa apply ilmu carbon accounting di perusahaan tempat saya bekerja.',
        },
        {
          id: 2,
          name: 'Rudi Hartono',
          avatar: '/images/testimonials/rudi.jpg',
          comment: 'Materi LCA-nya sangat detail dan aplikatif. Instruktur memberikan contoh-contoh real case yang mudah dipahami.',
        },
        {
          id: 3,
          name: 'Indira Sari',
          avatar: '/images/testimonials/indira.jpg',
          comment: 'Program yang tepat untuk memulai career di sustainability. Mendapat banyak networking dan referensi job opportunities.',
        },
      ],
      faq: [
        {
          id: 1,
          question: 'Apakah perlu background teknik untuk ikut program ini?',
          answer:
            'Tidak harus. Program ini dirancang untuk berbagai background. Yang penting adalah minat pada sustainability dan kemampuan analitis dasar.',
        },
        {
          id: 2,
          question: 'Tools apa saja yang akan dipelajari?',
          answer:
            'Kami akan menggunakan SimaPro untuk LCA, Excel untuk carbon calculator, dan berbagai online tools untuk carbon footprint assessment.',
        },
        {
          id: 3,
          question: 'Apakah ada hands-on project?',
          answer: 'Ya, setiap peserta akan mengerjakan final project berupa carbon footprint assessment untuk suatu produk atau organisasi.',
        },
      ],
    },
    {
      id: 3,
      title: 'Bootcamp Sustainable Finance',
      name: 'Green Finance & Sustainable Investment Program',
      path_slug: 'bootcamp-sustainable-finance',
      description:
        'Master sustainable finance principles, green bonds, impact investing, and financial risk assessment related to climate and environmental factors. Learn to structure sustainable financial products and assess ESG risks in investment decisions.',
      duration: '4 bulan',
      level: 'Advanced',
      format: 'Online Live Classes',
      price: 3200000,
      image: '/images/bootcamp/finance-bootcamp.jpg',
      color: 'from-emerald-500 to-teal-700',
      materialCount: 58,
      rating: 4.9,
      ratingCount: 74,
      certificate: true,
      syllabus: [
        {
          id: 1,
          title: 'Sustainable Finance Fundamentals',
          description: 'Memahami konsep dasar sustainable finance, green taxonomy, dan regulasi global terkait sustainable banking.',
        },
        {
          id: 2,
          title: 'Green Bonds & Sustainable Debt',
          description: 'Mempelajari struktur green bonds, sustainability-linked loans, dan instrumen debt financing berkelanjutan lainnya.',
        },
        {
          id: 3,
          title: 'ESG Risk Assessment in Finance',
          description: 'Teknik assessment risiko ESG dalam portofolio investasi dan credit risk management.',
        },
        {
          id: 4,
          title: 'Impact Investing & Blended Finance',
          description: 'Strategi impact investing, social impact bonds, dan blended finance mechanisms.',
        },
        {
          id: 5,
          title: 'Climate Risk Modeling',
          description: 'Metodologi climate stress testing, scenario analysis, dan physical risk assessment dalam finance.',
        },
        {
          id: 6,
          title: 'Sustainable Banking Operations',
          description: 'Implementasi sustainable finance di operasional bank, credit policy, dan product development.',
        },
        {
          id: 7,
          title: 'Regulatory Compliance',
          description: 'Memahami regulasi sustainable finance dari OJK, Bank Indonesia, dan standar internasional.',
        },
        {
          id: 8,
          title: 'Financial Innovation for Sustainability',
          description: 'Mengembangkan produk finansial inovatif yang mendukung transition ke ekonomi berkelanjutan.',
        },
      ],
      instructor: {
        name: 'Dr. Andi Sutrisno, CFA',
        expertise: 'Sustainable Finance Director & ESG Investment Specialist',
        avatar: '/images/teams/andi-sutrisno.jpg',
        description:
          'Mantan Director Sustainable Finance di bank multinasional dengan 18 tahun pengalaman. Chartered Financial Analyst (CFA) dan bersertifikat Certificate in ESG Investing dari CFA Institute. Expert dalam green bond structuring dan climate risk modeling.',
      },
      testimonials: [
        {
          id: 1,
          name: 'Putri Maharani',
          avatar: '/images/testimonials/putri.jpg',
          comment:
            'Program yang sangat komprehensif untuk finance professionals. Materinya sangat advanced dan applicable langsung di banking industry.',
        },
        {
          id: 2,
          name: 'David Tantra',
          avatar: '/images/testimonials/david.jpg',
          comment: 'Instruktur dengan pengalaman real di industry. Mendapat insight mendalam tentang sustainable finance trends dan opportunities.',
        },
        {
          id: 3,
          name: 'Ratna Sari',
          avatar: '/images/testimonials/ratna.jpg',
          comment: 'Bootcamp yang worth it untuk investment banker atau credit analyst yang ingin specialize di sustainable finance.',
        },
      ],
      faq: [
        {
          id: 1,
          question: 'Apakah harus punya background finance?',
          answer: 'Ya, program ini untuk advanced level sehingga membutuhkan basic understanding finance, accounting, dan investment principles.',
        },
        {
          id: 2,
          question: 'Apakah ada partnership dengan financial institutions?',
          answer: 'Ya, kami bekerja sama dengan beberapa bank dan lembaga keuangan untuk job placement dan internship opportunities.',
        },
        {
          id: 3,
          question: 'Apakah mendapat akses ke financial modeling tools?',
          answer: 'Ya, peserta akan mendapat akses ke Bloomberg Terminal, climate risk modeling software, dan ESG rating platforms.',
        },
        {
          id: 4,
          question: 'Bagaimana format final project-nya?',
          answer:
            'Final project berupa case study lengkap: structuring green bond untuk specific company atau ESG risk assessment untuk loan portfolio.',
        },
      ],
    },
  ];

  /**
   * Mencari bootcamp berdasarkan path_slug
   * @param {string} pathSlug - Slug path bootcamp
   * @returns {object|undefined} Bootcamp object atau undefined jika tidak ditemukan
   */
  const findBootcampBySlug = (pathSlug) => {
    return bootcampsData.find((bootcamp) => bootcamp.path_slug === pathSlug);
  };

  /**
   * Format harga dalam format Rupiah
   * @param {number} price - Harga dalam angka
   * @returns {string} Harga terformat
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  /**
   * Mendapatkan bootcamp berdasarkan level
   * @param {string} level - Level bootcamp (Beginner, Intermediate, Advanced)
   * @returns {array} Array bootcamp dengan level tertentu
   */
  const getBootcampsByLevel = (level) => {
    return bootcampsData.filter((bootcamp) => bootcamp.level === level);
  };

  /**
   * Mendapatkan bootcamp populer berdasarkan rating
   * @param {number} minRating - Minimum rating
   * @returns {array} Array bootcamp dengan rating >= minRating
   */
  const getPopularBootcamps = (minRating = 4.5) => {
    return bootcampsData.filter((bootcamp) => bootcamp.rating >= minRating);
  };

  return {
    bootcampsData,
    findBootcampBySlug,
    formatPrice,
    getBootcampsByLevel,
    getPopularBootcamps,
  };
};
