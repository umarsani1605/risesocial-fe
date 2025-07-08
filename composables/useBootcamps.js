/**
 * Composable untuk mengelola data bootcamp
 * @returns {object} Object berisi data dan methods bootcamp
 */
export const useBootcamps = () => {
  // Data bootcamp programs
  const bootcampsData = [
    {
      id: 1,
      title: 'ESG (Environmental, Social, and Governance)',
      path_slug: 'bootcamp-esg',
      description:
        'The ESG Bootcamp is an intensive program designed to equip participants with in-demand sustainability skills through 15 live classes led by ESG experts, interactive real-world case studies, and a job accelerator program. Participants will gain practical insights into Environmental, Social, and Governance (ESG) principles, sharpen their problem-solving abilities by working on industry-relevant challenges, and receive tailored career support including CV building, interview preparation, and access to ESG-related job and internship opportunities—making it ideal for students, young professionals, or career switchers looking to thrive in the sustainability sector.',
      duration: '3 bulan',
      format: 'Online Live Classes',
      category: 'ESG',
      pricing: [
        {
          id: 1,
          name: '1 Tema',
          original_price: 2390000,
          discount_price: 1390000,
        },
        {
          id: 2,
          name: '3 Tema',
          original_price: 4790000,
          discount_price: 3790000,
        },
      ],
      image: '/images/stock-image/envato-labs-ai-2e12bab4-dec4-496c-9fdb-54e9b51817d1.jpg',
      rating: 4.8,
      ratingCount: 127,
      certificate: true,
      portofolio: true,
      features: [
        {
          id: 1,
          title: 'Full Stack Material + Real Study Case',
          description: 'Equip participants with full stack material in ESG + real study case',
          icon: 'heroicons:clipboard-document-check',
        },
        {
          id: 2,
          title: 'Comprehensive Module',
          description: 'Comprehensive module, learn in 3 months with experts',
          icon: 'heroicons:clipboard-document-list',
        },
        {
          id: 3,
          title: 'Talent Showcase',
          description: "Talent showcase for companies with participant's presentation and portfolio",
          icon: 'heroicons:presentation-chart-bar',
        },
        {
          id: 4,
          title: 'Job Accelerator',
          description: 'Access to job opportunities from our hiring partners',
          icon: 'heroicons:briefcase',
        },
      ],
      topic: [
        {
          id: 1,
          title: 'Dasar-Dasar ESG',
          description: 'Memahami konsep dasar ESG, standar internasional, dan regulasi yang berlaku di berbagai industri.',
          session: [
            {
              id: 1,
              title: 'Perkenalan ESG',
            },
            {
              id: 2,
              title: 'Lingkungan (Environmental) dalam ESG',
            },
            {
              id: 3,
              title: 'Sosial (Social) dalam ESG',
            },
            {
              id: 4,
              title: 'Tata Kelola (Governance) dalam ESG',
            },
            {
              id: 5,
              title: 'Studi kasus',
            },
          ],
        },
        {
          id: 2,
          title: 'Penerapan ESG dalam Bisnis dan Korporasi',
          description: 'Mempelajari perencanaan, implementasi, hingga evaluasi ESG dalam bisnis dan korporasi.',
          session: [
            {
              id: 1,
              title: 'Pendahuluan',
            },
            {
              id: 2,
              title: 'Perencanaan ESG dalam Bisnis dan Korporasi',
            },
            {
              id: 3,
              title: 'Implementasi ESG dalam Bisnis dan Korporasi',
            },
            {
              id: 4,
              title: 'Evaluasi penerapan ESG dalam bisnis dan korporasi',
            },
            {
              id: 5,
              title: 'Studi kasus',
            },
          ],
        },
        {
          id: 3,
          title: 'Pembuatan ESG Report',
          description: 'Mendalami pembuatan ESG report yang komprehensif dan sesuai standar internasional.',
          session: [
            {
              id: 1,
              title: 'Pendahuluan',
            },
            {
              id: 2,
              title: 'Persiapan penulisan ESG Report',
            },
            {
              id: 3,
              title: 'Penulisan dan Pelaporan ESG Report',
            },
            {
              id: 4,
              title: 'Evaluasi dan Analisis ESG Report',
            },
            {
              id: 5,
              title: 'Studi Kasus',
            },
          ],
        },
      ],
      instructor: [
        {
          name: 'Dasi Agung Ospaman',
          job: 'Environmental Product Labeling Analyst at Non-Profit Organization',
          avatar: '/images/bootcamp/mas-agung.png',
          description: '',
        },
        {
          name: 'Norlina Pasaribu',
          job: 'ESG & Sustainability Specialist at Cladtek',
          avatar: '',
          description: '',
        },
        {
          name: 'Muamar',
          job: 'Sustainability & ESG Manager at Manufacture Company',
          avatar: '',
          description: '',
        },
      ],
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
   * Mendapatkan pricing tier berdasarkan ID
   * @param {object} bootcamp - Bootcamp object
   * @param {number} tierId - ID tier pricing
   * @returns {object|undefined} Pricing tier object atau undefined jika tidak ditemukan
   */
  const getPricingTier = (bootcamp, tierId) => {
    return bootcamp.pricing?.find((tier) => tier.id === tierId);
  };

  /**
   * Mendapatkan pricing tier termurah
   * @param {object} bootcamp - Bootcamp object
   * @returns {object|undefined} Pricing tier dengan harga termurah
   */
  const getCheapestTier = (bootcamp) => {
    if (!bootcamp.pricing || bootcamp.pricing.length === 0) return undefined;
    return bootcamp.pricing.reduce((cheapest, current) => (current.current_price < cheapest.current_price ? current : cheapest));
  };

  /**
   * Menghitung persentase diskon
   * @param {number} originalPrice - Harga asli
   * @param {number} currentPrice - Harga sekarang
   * @returns {number} Persentase diskon
   */
  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  /**
   * Mendapatkan features dari bootcamp
   * @param {object} bootcamp - Bootcamp object
   * @returns {array} Array features bootcamp
   */
  const getBootcampFeatures = (bootcamp) => {
    return bootcamp.features || [];
  };

  /**
   * Mendapatkan topic dari bootcamp
   * @param {object} bootcamp - Bootcamp object
   * @returns {array} Array topic bootcamp
   */
  const getBootcampTopics = (bootcamp) => {
    return bootcamp.topic || [];
  };

  /**
   * Mendapatkan topic berdasarkan ID
   * @param {object} bootcamp - Bootcamp object
   * @param {number} topicId - ID topic
   * @returns {object|undefined} Topic object atau undefined jika tidak ditemukan
   */
  const getTopicById = (bootcamp, topicId) => {
    return bootcamp.topic?.find((topic) => topic.id === topicId);
  };

  /**
   * Mendapatkan total jumlah session dari semua topic
   * @param {object} bootcamp - Bootcamp object
   * @returns {number} Total jumlah session
   */
  const getTotalSessionCount = (bootcamp) => {
    if (!bootcamp.topic) return 0;
    return bootcamp.topic.reduce((total, topic) => total + (topic.session?.length || 0), 0);
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
    getPricingTier,
    getCheapestTier,
    calculateDiscountPercentage,
    getBootcampFeatures,
    getBootcampTopics,
    getTopicById,
    getTotalSessionCount,
    getBootcampsByLevel,
    getPopularBootcamps,
  };
};
