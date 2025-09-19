export const seoData = {
  home: {
    title: 'Home - Unique Experiences',
    description: 'Discover unique experiences and create unforgettable memories with our curated collection of adventures worldwide. Book drone adventures, storytelling sessions, expert workshops, and gaming events.',
    keywords: 'experiences, adventure booking, drone photography, storytelling sessions, expert workshops, gaming events, unique activities, wandercall',
    url: '/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "wandercall - Home",
      "description": "Discover unique experiences and create unforgettable memories with our curated collection of adventures worldwide.",
      "url": "https://wandercall.com/",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Experiences",
        "itemListElement": [
          {
            "@type": "Product",
            "name": "Drone Adventure",
            "description": "Aerial photography and videography experiences"
          },
          {
            "@type": "Product", 
            "name": "Storytelling Session",
            "description": "Professional storytelling and content creation"
          },
          {
            "@type": "Product",
            "name": "Learn from Experts", 
            "description": "Educational workshops and masterclasses"
          },
          {
            "@type": "Product",
            "name": "Gamer Bash",
            "description": "Gaming tournaments and community events"
          }
        ]
      }
    }
  },
  
  about: {
    title: 'About Us - Our Story & Mission',
    description: 'Learn about wandercall\'s mission to connect experiencers with extraordinary experiences. Founded in 2020, we\'ve served 50K+ happy customers across India with curated adventures.',
    keywords: 'about wandercall, company story, experience mission, experience marketplace, adventure tourism company, experience startup india',
    url: '/about',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About wandercall",
      "description": "Learn about wandercall's mission to connect experiencers with extraordinary experiences.",
      "url": "https://wandercall.com/about"
    }
  },
  
  contact: {
    title: 'Contact Us - Get Support & Help',
    description: 'Get in touch with wandercall support team. Email us at teamwandercall@gmail.com or call +91 8733942557. We\'re here to help with bookings, questions, and support.',
    keywords: 'contact wandercall, customer support, help center, experience support, booking assistance, wandercall phone number, wandercall email',
    url: '/contact',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact wandercall",
      "description": "Get in touch with wandercall support team for bookings, questions, and assistance.",
      "url": "https://wandercall.com/contact"
    }
  },
  
  terms: {
    title: 'Terms & Conditions - Legal Information',
    description: 'Read wandercall\'s terms and conditions, privacy policy, liability waivers, and cancellation policies. Understand your rights and responsibilities when using our platform.',
    keywords: 'wandercall terms conditions, privacy policy, legal information, liability waiver, cancellation policy, refund policy, user agreement',
    url: '/terms-and-conditions',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms & Conditions",
      "description": "wandercall's terms and conditions, privacy policy, and legal information.",
      "url": "https://wandercall.com/terms-and-conditions"
    }
  },
  
  booking: {
    title: 'Book Experience - Secure Booking Platform',
    description: 'Book your adventure experience securely with wandercall. Easy 3-step booking process with secure payment via Cashfree. Book drone adventures, workshops, and unique activities.',
    keywords: 'book experience, secure booking, adventure booking, experience reservation, experience booking platform, cashfree payment, wandercall booking',
    url: '/booking',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Book Experience",
      "description": "Book your adventure experience securely with wandercall's easy 3-step booking process.",
      "url": "https://wandercall.com/booking"
    }
  }
};

export const getPageSEO = (page) => {
  return seoData[page] || seoData.home;
};