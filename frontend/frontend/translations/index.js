// frontend/translations/index.js
// Complete bilingual translations for Vonaxity
// Usage: import { t } from '@/translations'; then t(lang, 'hero.headline1')

const translations = {
  en: {
    // ── Nav ──────────────────────────────────────────────────────────────────
    nav: {
      howItWorks: 'How It Works',
      services: 'Services',
      pricing: 'Pricing',
      cities: 'Cities',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      signOut: 'Sign out',
    },

    // ── Hero ─────────────────────────────────────────────────────────────────
    hero: {
      badge: '🇦🇱 Serving Albania · Est. 2024',
      headline1: 'Care for your loved ones',
      headline2: 'wherever you are.',
      subtitle: 'Vonaxity brings professional nurse home visits to your family in Albania. Book from anywhere in the world. Trusted care, delivered to their door.',
      cta1: 'Care for a Loved One',
      cta2: 'See How It Works',
      stat1: 'Families served',
      stat2: 'Cities covered',
      stat3: 'Verified nurses',
    },

    // ── Services ──────────────────────────────────────────────────────────────
    services: {
      tag: 'What we do',
      title: 'Professional care, at home',
      subtitle: 'Our certified nurses perform a full range of non-emergency health services at your family\'s door.',
      emergency: 'Important: Vonaxity is non-emergency care only. For emergencies in Albania, call',
      immediately: 'immediately.',
      items: [
        { title: 'Blood Pressure Check', desc: 'Regular monitoring for hypertension and cardiovascular health.' },
        { title: 'Glucose Check', desc: 'Accurate blood sugar monitoring for diabetic patients.' },
        { title: 'Vitals Monitoring', desc: 'Full vitals — heart rate, temperature, oxygen, respiratory rate.' },
        { title: 'Blood Work & Sample Collection', desc: 'In-home sample collection sent to certified labs.' },
        { title: 'Welfare Check', desc: 'A caring visit to ensure your loved one is safe and well.' },
        { title: 'General Nurse Visit', desc: 'Comprehensive home nursing for any non-emergency need.' },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    pricing: {
      tag: 'Simple pricing',
      title: 'Plans for every family',
      subtitle: 'No hidden fees. Cancel anytime. 7-day free trial on all plans.',
      perMonth: 'per month',
      visitMonth: 'visit/month',
      visitsMonth: 'visits/month',
      getStarted: 'Get Started',
      mostPopular: 'MOST POPULAR',
      trialNote: '7-day free trial · Cancel anytime',
      monthly: 'Monthly',
      annual: 'Annual (Save 15%)',
    },

    // ── Cities ────────────────────────────────────────────────────────────────
    cities: {
      tag: 'Coverage',
      title: 'Available in 8 Albanian cities',
      subtitle: 'We are expanding across Albania. Don\'t see your city? Join the waitlist.',
      expansion: '🗺️ More cities coming soon — including Vlorë, Gjirokastër, Korçë and Lushnjë.',
      waitlist: 'Join the waitlist →',
    },

    // ── FAQ ───────────────────────────────────────────────────────────────────
    faq: {
      tag: 'FAQ',
      title: 'Common questions',
      viewAll: 'View all FAQs →',
      items: [
        { q: 'Is Vonaxity for emergencies?', a: 'No. Vonaxity is non-emergency care only. For medical emergencies in Albania, call 127 immediately.' },
        { q: 'Can I book from outside Albania?', a: 'Yes — that is exactly what we are built for. Book online from anywhere, a nurse visits your relative in Albania.' },
        { q: 'How are nurses verified?', a: 'Every nurse is licensed, background-checked, and verified by our team before their first visit.' },
        { q: 'Can I cancel my subscription?', a: 'Yes, anytime with no penalty. We also offer a 7-day free trial on all plans.' },
        { q: 'Which cities do you cover?', a: 'Tirana, Durrës, Elbasan, Fier, Berat, Sarandë, Kukës, and Shkodër. More cities coming soon.' },
        { q: 'How do I receive updates after a visit?', a: 'You receive a health report by email after every nurse visit, including all vitals and nurse observations.' },
        { q: 'What payment methods do you accept?', a: 'All major credit and debit cards via Stripe. Payments are secure and processed in Euros.' },
        { q: 'Can I change my plan?', a: 'Yes. Upgrade or downgrade anytime from your dashboard.' },
      ],
    },

    // ── CTA ───────────────────────────────────────────────────────────────────
    cta: {
      title: 'Your family deserves the best care.',
      subtitle: '7-day free trial. No card required. Cancel anytime.',
      btn1: 'Choose Your Plan',
      btn2: 'Talk to Us on WhatsApp',
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
      tagline: 'Home nurse visits across Albania. Built for families who care from afar.',
      services: 'Services',
      company: 'Company',
      contact: 'Contact',
      emergency: 'Emergency?',
      emergencyCall: 'Call 127 immediately',
      copyright: '© 2024 Vonaxity. All rights reserved.',
      companyLinks: ['About Us', 'Pricing', 'FAQ', 'Contact'],
    },

    // ── How It Works ──────────────────────────────────────────────────────────
    howItWorks: {
      tag: 'Simple process',
      title: 'How Vonaxity works',
      subtitle: 'From choosing a plan to receiving your first health report — here is the complete process.',
      steps: [
        { num: '01', title: 'Choose your plan', desc: 'Select Basic, Standard, or Premium. All plans include a 7-day free trial.' },
        { num: '02', title: 'Tell us about your loved one', desc: 'Enter your relative\'s name, address in Albania, city, and the services they need.' },
        { num: '03', title: 'We match a certified nurse', desc: 'Our system matches the nearest available approved nurse in your city.' },
        { num: '04', title: 'Schedule the visit', desc: 'We contact your loved one to confirm the visit time. Standard: 3–5 days. Priority: 1–2 days.' },
        { num: '05', title: 'The nurse visits at home', desc: 'The nurse arrives with all equipment and performs the agreed health services. Typically 30–60 minutes.' },
        { num: '06', title: 'You receive a health report', desc: 'Within hours you receive a full health report by email — vitals, nurse observations, and recommendations.' },
      ],
    },

    // ── About ─────────────────────────────────────────────────────────────────
    about: {
      tag: 'Our story',
      headline: 'We built Vonaxity because we needed it ourselves.',
      p1: 'In 2022, one of our founders was living in London when his mother in Tirana fell ill. He spent three weeks trying to arrange a simple nurse visit from 2,000 miles away. It was nearly impossible.',
      p2: 'He came back to Albania, built a team, and created the platform he had been looking for. Vonaxity is that platform.',
      values: [
        { icon: '❤️', title: 'Family first', desc: 'Every decision starts with: what would we want for our own parents?' },
        { icon: '🎓', title: 'Clinical excellence', desc: 'Licensed, verified nurses. No exceptions.' },
        { icon: '🌍', title: 'Built for diaspora', desc: 'We understand what it means to care from a distance.' },
        { icon: '🇦🇱', title: 'Proud Albanian', desc: 'Albania deserves world-class home healthcare. We are building it.' },
      ],
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    contact: {
      tag: 'Get in touch',
      title: 'We\'re here to help',
      subtitle: 'We respond within 24 hours in English or Albanian.',
      name: 'Your name',
      email: 'Email address',
      message: 'How can we help?',
      send: 'Send message →',
      successTitle: 'Message received!',
      successDesc: 'We\'ll get back to you within 24 hours.',
      channels: [
        { icon: '📧', label: 'Email', value: 'hello@vonaxity.com' },
        { icon: '💬', label: 'WhatsApp', value: '+355 69 000 0000' },
        { icon: '🚨', label: 'Emergency in Albania?', value: 'Call 127 immediately' },
      ],
    },

    // ── Login ─────────────────────────────────────────────────────────────────
    login: {
      title: 'Sign in',
      email: 'Email',
      password: 'Password',
      submit: 'Sign in →',
      loading: 'Signing in...',
      noAccount: 'No account?',
      signUp: 'Sign up',
      testAccounts: 'TEST ACCOUNTS',
      fill: 'Fill',
      emergency: 'Medical emergency in Albania? Call',
    },

    // ── Signup ────────────────────────────────────────────────────────────────
    signup: {
      step1Title: 'Choose your plan',
      step1Subtitle: '7-day free trial. No card required today.',
      step2Title: 'Your details',
      step3Title: 'Your loved one\'s details',
      fullName: 'Full name',
      email: 'Email',
      password: 'Password (min 8 chars)',
      phone: 'Phone (WhatsApp)',
      country: 'Your country...',
      theirName: 'Their full name',
      theirCity: 'City in Albania...',
      theirAddress: 'Their home address',
      theirPhone: 'Their phone number',
      back: '← Back',
      continue: 'Continue →',
      submit: 'Start Free Trial →',
      loading: 'Creating account...',
      alreadyAccount: 'Already have an account?',
      signIn: 'Sign in',
      emergencyNote: 'Vonaxity is non-emergency care only. For emergencies call',
    },

    // ── Dashboard ─────────────────────────────────────────────────────────────
    dashboard: {
      welcome: 'Welcome back',
      nextVisit: 'Next visit for',
      overview: 'Overview',
      visits: 'My Visits',
      subscription: 'Subscription',
      settings: 'Settings',
      plan: 'Plan',
      visitsUsed: 'Visits used',
      nextVisitLabel: 'Next visit',
      lastBP: 'Last BP',
      lovedOne: 'Loved one details',
      signOut: 'Sign out',
      upgradePremium: 'Upgrade to Premium',
    },

    // ── Nurse Panel ───────────────────────────────────────────────────────────
    nurse: {
      goodMorning: 'Good morning',
      visitsToday: 'visits today',
      first: 'First at',
      todaySchedule: 'Today\'s schedule',
      recentNotifications: 'Recent notifications',
      dashboard: 'Dashboard',
      myVisits: 'My Visits',
      completeVisit: 'Complete Visit',
      earnings: 'Earnings',
      myProfile: 'My Profile',
      onDuty: 'On duty',
      approved: '✓ Approved',
      upcoming: '⏰ Upcoming',
      completed: '✓ Completed',
      noShow: 'No Show',
      onMyWay: 'On My Way 🚗',
      arrived: '📍 Arrived',
      inProgress: '🏥 In progress',
      liveStatus: '📍 Live status',
      vitals: '📊 Vitals',
      nurseNotes: '📝 Nurse notes',
      submitReport: '✅ Submit Visit Report',
      reportSubmitted: 'Visit report submitted!',
      backToVisits: 'Back to visits',
      totalEarned: 'Total earned',
      pending: 'Pending',
      thisMonth: 'This month',
      totalVisits: 'Total completed',
      paymentHistory: 'Payment history',
      payRate: 'Pay rate',
      paidWeekly: 'Paid weekly',
      paid: '✓ Paid',
      availability: 'Availability',
      saveProfile: 'Save profile',
      changesSaved: '✓ Changes saved',
      emergencyWarning: 'Non-emergency care only. Medical emergency: call',
    },

    // ── Admin Panel ───────────────────────────────────────────────────────────
    admin: {
      overview: 'Admin Overview',
      nurses: 'Nurse Management',
      users: 'Client Management',
      visits: 'Visit Management',
      payments: 'Payments',
      analytics: 'Analytics',
      settings: 'Settings',
      totalClients: 'Total clients',
      totalNurses: 'Total nurses',
      activeSubs: 'Active subs',
      revenue: 'Revenue',
      unassigned: 'Unassigned',
      needsAttention: 'Needs attention',
      todayVisits: 'Today\'s visits',
      approve: '✓ Approve',
      reject: '✗ Reject',
      suspend: 'Suspend',
      reinstate: 'Reinstate',
      assignNurse: 'Assign Nurse',
      reassign: 'Reassign',
      cancel: 'Cancel',
      addNurse: '+ Add Nurse',
      saveSettings: 'Save settings',
      saved: '✓ Saved',
      sendNotification: 'Send notification',
      sent: '✓ Sent!',
      allUsers: 'All users',
      nursesOnly: 'Nurses only',
      clientsOnly: 'Clients only',
      payPerVisit: 'Nurse pay per visit (€)',
      trialDays: 'Trial period (days)',
    },

    // ── General UI ────────────────────────────────────────────────────────────
    ui: {
      all: 'All',
      back: '← Back',
      next: 'Next →',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Something went wrong. Please try again.',
      emergency: '⚠️ Medical emergency? Call 127',
      online: '🟢 Online',
      offline: 'Offline',
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ALBANIAN (SHQIP)
  // ════════════════════════════════════════════════════════════════════════════
  sq: {
    nav: {
      howItWorks: 'Si Funksionon',
      services: 'Shërbimet',
      pricing: 'Çmimet',
      cities: 'Qytetet',
      about: 'Rreth Nesh',
      contact: 'Kontakti',
      faq: 'Pyetjet',
      signIn: 'Hyr',
      getStarted: 'Fillo Tani',
      signOut: 'Dil',
    },

    hero: {
      badge: '🇦🇱 Duke Shërbyer Shqipërinë · Est. 2024',
      headline1: 'Kujdesuni për të dashurit tuaj',
      headline2: 'kudo që jeni.',
      subtitle: 'Vonaxity sjell vizita profesionale të infermierëve në shtëpinë e familjes suaj në Shqipëri. Rezervoni nga kudo në botë. Kujdes i besuar, i dorëzuar tek dera e tyre.',
      cta1: 'Kujdesuni për një të Dashur',
      cta2: 'Shih Si Funksionon',
      stat1: 'Familje të shërbyera',
      stat2: 'Qytete të mbuluara',
      stat3: 'Infermierë të verifikuar',
    },

    services: {
      tag: 'Çfarë ofrojmë',
      title: 'Kujdes profesional, në shtëpi',
      subtitle: 'Infermierët tanë të certifikuar kryejnë një gamë të plotë shërbimesh shëndetësore jo-urgjente tek dera e familjes suaj.',
      emergency: 'E rëndësishme: Vonaxity ofron vetëm kujdes jo-urgjent. Për urgjenca në Shqipëri, telefononi',
      immediately: 'menjëherë.',
      items: [
        { title: 'Matja e Presionit të Gjakut', desc: 'Monitorim i rregullt për hipertension dhe shëndetin kardiovaskular.' },
        { title: 'Kontrolli i Glukozës', desc: 'Monitorim i saktë i sheqerit në gjak për pacientët diabetikë.' },
        { title: 'Monitorimi i Shenjave Vitale', desc: 'Kontroll i plotë i shenjave vitale — ritmi i zemrës, temperatura, oksigjeni.' },
        { title: 'Analizat e Gjakut / Mbledhja e Mostrave', desc: 'Mbledhja e mostrave në shtëpi dhe dërgimi në laboratorë të certifikuar.' },
        { title: 'Kontrolli i Mirëqenies', desc: 'Një vizitë kujdestare për t\'u siguruar që i afërmi juaj është mirë dhe i sigurt.' },
        { title: 'Vizitë e Përgjithshme Infermierësh', desc: 'Vizitë gjithëpërfshirëse e infermierëve për çdo nevojë jo-urgjente.' },
      ],
    },

    pricing: {
      tag: 'Çmime të thjeshta',
      title: 'Plane për çdo familje',
      subtitle: 'Pa tarifa të fshehura. Anuloni kurdo. 7 ditë provë falas në të gjitha planet.',
      perMonth: 'në muaj',
      visitMonth: 'vizitë/muaj',
      visitsMonth: 'vizita/muaj',
      getStarted: 'Fillo Tani',
      mostPopular: 'MË I POPULLARIZUARI',
      trialNote: '7 ditë falas · Anuloni kurdo',
      monthly: 'Mujore',
      annual: 'Vjetore (Kurseni 15%)',
    },

    cities: {
      tag: 'Mbulimi',
      title: 'Disponueshme në 8 qytete shqiptare',
      subtitle: 'Po zgjerohemi nëpër Shqipëri. Nuk e shihni qytetin tuaj? Bashkohuni me listën e pritjes.',
      expansion: '🗺️ Qytete të tjera vijnë së shpejti — duke përfshirë Vlorën, Gjirokastrën, Korçën dhe Lushnjën.',
      waitlist: 'Bashkohuni me listën e pritjes →',
    },

    faq: {
      tag: 'Pyetjet e shpeshta',
      title: 'Pyetje të zakonshme',
      viewAll: 'Shiko të gjitha pyetjet →',
      items: [
        { q: 'A është Vonaxity për urgjenca?', a: 'Jo. Vonaxity ofron vetëm kujdes jo-urgjent. Për urgjenca mjekësore në Shqipëri, telefononi 127 menjëherë.' },
        { q: 'A mund të rezervoj nga jashtë Shqipërisë?', a: 'Po — pikërisht për këtë jemi ndërtuar. Rezervoni online nga kudo, një infermiere viziton të afërmin tuaj në Shqipëri.' },
        { q: 'Si verifikohen infermierët?', a: 'Çdo infermiere është e licencuar, e kontrolluar dhe e verifikuar nga ekipi ynë para vizitës së parë.' },
        { q: 'A mund ta anuloj abonimin tim?', a: 'Po, kurdo pa penalitete. Ofrojmë gjithashtu 7 ditë provë falas në të gjitha planet.' },
        { q: 'Cilat qytete mbuloni?', a: 'Tiranën, Durrësin, Elbasanin, Fierin, Beratin, Sarandën, Kukësin dhe Shkodrën. Qytete të tjera vijnë së shpejti.' },
        { q: 'Si marr përditësime pas vizitës?', a: 'Merrni raport shëndetësor me email pas çdo vizite infermierësh, duke përfshirë të gjitha matjet.' },
        { q: 'Çfarë metodash pagese pranoni?', a: 'Të gjitha kartat kryesore të kreditit dhe debitit nëpërmjet Stripe. Pagesat janë të sigurta dhe processohen në Euro.' },
        { q: 'A mund ta ndryshoj planin tim?', a: 'Po. Përmirësoni ose ulni planin kurdo nga paneli juaj.' },
      ],
    },

    cta: {
      title: 'Familja juaj meriton kujdesin më të mirë.',
      subtitle: '7 ditë provë falas. Pa kartë. Anuloni kurdo.',
      btn1: 'Zgjidhni Planin Tuaj',
      btn2: 'Na Kontaktoni në WhatsApp',
    },

    footer: {
      tagline: 'Vizita infermierësh në shtëpi nëpër Shqipëri. Ndërtuar për familjet që kujdesen nga larg.',
      services: 'Shërbimet',
      company: 'Kompania',
      contact: 'Kontakti',
      emergency: 'Urgjencë?',
      emergencyCall: 'Telefononi 127 menjëherë',
      copyright: '© 2024 Vonaxity. Të gjitha të drejtat e rezervuara.',
      companyLinks: ['Rreth Nesh', 'Çmimet', 'Pyetjet', 'Kontakti'],
    },

    howItWorks: {
      tag: 'Proces i thjeshtë',
      title: 'Si funksionon Vonaxity',
      subtitle: 'Nga zgjedhja e planit deri tek raporti i parë shëndetësor — ja procesi i plotë.',
      steps: [
        { num: '01', title: 'Zgjidhni planin tuaj', desc: 'Zgjidhni Bazë, Standard ose Premium. Të gjitha planet përfshijnë 7 ditë provë falas.' },
        { num: '02', title: 'Na tregoni për të afërmin tuaj', desc: 'Vendosni emrin, adresën në Shqipëri, qytetin dhe shërbimet e nevojshme.' },
        { num: '03', title: 'Ne gjejmë një infermiere të certifikuar', desc: 'Sistemi ynë gjen infermieren më të afërt të disponueshme dhe të aprovuar në qytetin tuaj.' },
        { num: '04', title: 'Planifikoni vizitën', desc: 'Ne kontaktojmë të afërmin tuaj për të konfirmuar kohën e vizitës. Standard: 3–5 ditë. Prioritar: 1–2 ditë.' },
        { num: '05', title: 'Infermierja viziton shtëpinë', desc: 'Infermierja mbërrin me të gjitha pajisjet dhe kryen shërbimet e rëna dakord. Zakonisht 30–60 minuta.' },
        { num: '06', title: 'Merrni raportin shëndetësor', desc: 'Brenda disa orësh merrni raport të plotë shëndetësor me email — matjet, vëzhgimet dhe rekomandimet.' },
      ],
    },

    about: {
      tag: 'Historia jonë',
      headline: 'E ndërtuam Vonaxity sepse na nevojitej vetë.',
      p1: 'Në vitin 2022, një nga themeluesit tanë jetonte në Londër kur nëna e tij në Tiranë u sëmur. Ai kaloi tre javë duke u munduar të organizonte një vizitë të thjeshtë infermierësh nga 2,000 milje larg. Ishte pothuajse e pamundur.',
      p2: 'Ai u kthye në Shqipëri, ndërtoi një ekip dhe krijoi platformën që po kërkonte. Vonaxity është ajo platformë.',
      values: [
        { icon: '❤️', title: 'Familja para së gjithash', desc: 'Çdo vendim fillon me: çfarë do të donim për prindërit tanë?' },
        { icon: '🎓', title: 'Ekselencë klinike', desc: 'Infermierë të licencuar dhe të verifikuar. Pa përjashtime.' },
        { icon: '🌍', title: 'Ndërtuar për diasporën', desc: 'Kuptojmë çfarë do të thotë të kujdesesh nga larg.' },
        { icon: '🇦🇱', title: 'Krenarë shqiptarë', desc: 'Shqipëria meriton kujdes shëndetësor shtëpiak të nivelit botëror. Ne po e ndërtojmë.' },
      ],
    },

    contact: {
      tag: 'Na kontaktoni',
      title: 'Jemi këtu për t\'ju ndihmuar',
      subtitle: 'Përgjigjemi brenda 24 orëve në shqip ose anglisht.',
      name: 'Emri juaj',
      email: 'Adresa e emailit',
      message: 'Si mund t\'ju ndihmojmë?',
      send: 'Dërgoni mesazhin →',
      successTitle: 'Mesazhi u mor!',
      successDesc: 'Do t\'ju kthejmë përgjigje brenda 24 orëve.',
      channels: [
        { icon: '📧', label: 'Email', value: 'hello@vonaxity.com' },
        { icon: '💬', label: 'WhatsApp', value: '+355 69 000 0000' },
        { icon: '🚨', label: 'Urgjencë në Shqipëri?', value: 'Telefononi 127 menjëherë' },
      ],
    },

    login: {
      title: 'Hyr në llogarinë tënde',
      email: 'Email',
      password: 'Fjalëkalimi',
      submit: 'Hyr →',
      loading: 'Duke hyrë...',
      noAccount: 'Nuk keni llogari?',
      signUp: 'Regjistrohu',
      testAccounts: 'LLOGARITË E TESTIT',
      fill: 'Plotëso',
      emergency: 'Urgjencë mjekësore në Shqipëri? Telefononi',
    },

    signup: {
      step1Title: 'Zgjidhni planin tuaj',
      step1Subtitle: '7 ditë provë falas. Sot nuk kërkohet pagesë.',
      step2Title: 'Të dhënat tuaja',
      step3Title: 'Të dhënat e të dashurit tuaj',
      fullName: 'Emri i plotë',
      email: 'Email',
      password: 'Fjalëkalimi (min 8 karaktere)',
      phone: 'Telefoni (WhatsApp)',
      country: 'Shteti juaj...',
      theirName: 'Emri i plotë i tyre',
      theirCity: 'Qyteti në Shqipëri...',
      theirAddress: 'Adresa e shtëpisë së tyre',
      theirPhone: 'Numri i tyre i telefonit',
      back: '← Kthehu',
      continue: 'Vazhdo →',
      submit: 'Fillo Provën Falas →',
      loading: 'Duke krijuar llogarinë...',
      alreadyAccount: 'Keni tashmë një llogari?',
      signIn: 'Hyni',
      emergencyNote: 'Vonaxity ofron vetëm kujdes jo-urgjent. Për urgjenca telefononi',
    },

    dashboard: {
      welcome: 'Mirë se u kthye',
      nextVisit: 'Vizita e ardhshme për',
      overview: 'Pasqyra',
      visits: 'Vizitat e Mia',
      subscription: 'Abonimi',
      settings: 'Cilësimet',
      plan: 'Plani',
      visitsUsed: 'Vizita të përdorura',
      nextVisitLabel: 'Vizita e ardhshme',
      lastBP: 'Presioni i fundit',
      lovedOne: 'Të dhënat e të dashurit',
      signOut: 'Dil',
      upgradePremium: 'Kalo në Premium',
    },

    nurse: {
      goodMorning: 'Mirëmëngjes',
      visitsToday: 'vizita sot',
      first: 'E para në',
      todaySchedule: 'Orari i sotëm',
      recentNotifications: 'Njoftime të fundit',
      dashboard: 'Paneli',
      myVisits: 'Vizitat e Mia',
      completeVisit: 'Përfundo Vizitën',
      earnings: 'Fitimet',
      myProfile: 'Profili Im',
      onDuty: 'Në detyrë',
      approved: '✓ E aprovuar',
      upcoming: '⏰ E ardhshme',
      completed: '✓ E përfunduar',
      noShow: 'S\'u paraqit',
      onMyWay: 'Në rrugë 🚗',
      arrived: '📍 Mbërrita',
      inProgress: '🏥 Në proces',
      liveStatus: '📍 Statusi live',
      vitals: '📊 Shenjat vitale',
      nurseNotes: '📝 Shënime infermiereje',
      submitReport: '✅ Dorëzo Raportin e Vizitës',
      reportSubmitted: 'Raporti i vizitës u dorëzua!',
      backToVisits: 'Kthehu te vizitat',
      totalEarned: 'Fituar gjithsej',
      pending: 'Në pritje',
      thisMonth: 'Këtë muaj',
      totalVisits: 'Gjithsej të përfunduara',
      paymentHistory: 'Historia e pagesave',
      payRate: 'Tarifa e pagesës',
      paidWeekly: 'Pagesa javore',
      paid: '✓ Paguar',
      availability: 'Disponueshmëria',
      saveProfile: 'Ruaj profilin',
      changesSaved: '✓ Ndryshimet u ruajtën',
      emergencyWarning: 'Vetëm kujdes jo-urgjent. Urgjencë mjekësore: telefononi',
    },

    admin: {
      overview: 'Pasqyra e Adminit',
      nurses: 'Menaxhimi i Infermierëve',
      users: 'Menaxhimi i Klientëve',
      visits: 'Menaxhimi i Vizitave',
      payments: 'Pagesat',
      analytics: 'Analitika',
      settings: 'Cilësimet',
      totalClients: 'Klientë gjithsej',
      totalNurses: 'Infermierë gjithsej',
      activeSubs: 'Abonime aktive',
      revenue: 'Të ardhurat',
      unassigned: 'Pa infermiere',
      needsAttention: 'Kërkon vëmendje',
      todayVisits: 'Vizitat e sotme',
      approve: '✓ Aprovo',
      reject: '✗ Refuzo',
      suspend: 'Pezullo',
      reinstate: 'Riaktivo',
      assignNurse: 'Cakto Infermiere',
      reassign: 'Ricakto',
      cancel: 'Anulo',
      addNurse: '+ Shto Infermiere',
      saveSettings: 'Ruaj cilësimet',
      saved: '✓ U ruajt',
      sendNotification: 'Dërgo njoftim',
      sent: '✓ U dërgua!',
      allUsers: 'Të gjithë përdoruesit',
      nursesOnly: 'Vetëm infermierët',
      clientsOnly: 'Vetëm klientët',
      payPerVisit: 'Pagesa e infermierit për vizitë (€)',
      trialDays: 'Periudha e provës (ditë)',
    },

    ui: {
      all: 'Të gjitha',
      back: '← Kthehu',
      next: 'Vazhdo →',
      save: 'Ruaj',
      cancel: 'Anulo',
      loading: 'Duke ngarkuar...',
      error: 'Diçka shkoi keq. Ju lutemi provoni përsëri.',
      emergency: '⚠️ Urgjencë mjekësore? Telefononi 127',
      online: '🟢 Online',
      offline: 'Offline',
    },
  },
};

// Helper function to get translation
export function t(lang, key) {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English
      let fallback = translations.en;
      for (const fk of keys) fallback = fallback?.[fk];
      return fallback || key;
    }
  }
  return value;
}

export default translations;
