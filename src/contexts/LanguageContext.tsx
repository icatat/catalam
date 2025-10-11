'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ro' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wedding-language') as Language;
      if (saved && ['en', 'ro', 'vi'].includes(saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding-language', lang);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language][key] || translations.en[key] || key;
    
    // Replace parameters in translation
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce((str, [param, value]) => {
        return str.replace(new RegExp(`{${param}}`, 'g'), value);
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.vietnam': 'Vietnam Wedding',
    'nav.romania': 'Romania Wedding',
    'nav.contact': 'Contact',
    
    // Common
    'common.loading': 'Loading our memories...',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.name': 'Full Name',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.done': 'Done',
    'common.modify': 'Modify',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.required': '*',
    
    // Home page
    'home.title': 'Cata & Lam',
    'home.subtitle': 'Wedding Celebration 2026',
    'home.description': 'Join us for our wedding celebrations in Romania and Vietnam',
    'home.about.button': 'Read Our Story',
    'home.memories.title': 'Memories Coming Soon',
    
    // About page
    'about.title': 'Our Story',
    'about.description': 'What happens when a Romanian girls and Vietnamese guy meet at a college party in America.',
    'about.subtitle': '',
    'about.sort.newest': 'Newest First',
    'about.sort.oldest': 'Oldest First',
    'about.timeline.empty.title': 'No memories found',
    'about.timeline.empty.subtitle': 'Our timeline is still being created...',
    
    // Timeline
    'timeline.newest': 'Newest',
    'timeline.oldest': 'Oldest',
    'timeline.empty.title': 'No memories found',
    'timeline.empty.message': 'Our timeline is still being created...',
    'common.first': 'First',
    
    // Wedding pages
    'wedding.verification.loading': 'Verifying your invitation...',
    'wedding.hero.title': '{location} Wedding Celebration',
    'wedding.itinerary.title': 'Wedding Itinerary',
    'wedding.romania.description': 'Join us in the beautiful city of Oradea for our Romanian wedding celebration.',
    'wedding.vietnam.description': 'Celebrate with us in vibrant Cam Ranh for our Vietnamese wedding ceremony.',
    'wedding.venue.title': 'Wedding Venue',
    'wedding.venue.tbd': 'Venue details coming soon...',
    'wedding.location.title': 'Venue',
    'wedding.welcome.confirmed': 'We are looking forward to seeing you at our Wedding in {location}, {name}!',
    'wedding.welcome.pending': 'Welcome {name}! We would love to have you at our Wedding in {location}',
    
    // RSVP
    'rsvp.title': 'RSVP for {location} Wedding',
    'rsvp.subtitle': 'Welcome {name}! Please let us know if you\'ll be joining us for our special day in {location}.',
    'rsvp.already.title': 'You\'ve already RSVP\'d!',
    'rsvp.already.message': 'Thank you for confirming your attendance for our {location} celebration.',
    'rsvp.please.title': 'Please RSVP',
    'rsvp.please.message': 'Let us know if you\'ll be joining us for our special day in {location}.',
    'rsvp.button.now': 'RSVP Now',
    'rsvp.button.update': 'Update RSVP',
    'rsvp.modal.title': 'RSVP',
    'rsvp.modal.title.modify': 'Modify Your RSVP',
    'rsvp.modal.welcome': 'Welcome {name}!',
    'rsvp.modal.description': 'Please let us know if you\'ll be joining us for our special day in {location}',
    'rsvp.modal.already.message': 'You have already RSVP\'d for this wedding. You can modify your response below.',
    'rsvp.field.email': 'Email Address',
    'rsvp.field.phone': 'Phone Number',
    'rsvp.field.country': 'Country',
    'rsvp.field.attending': 'Will you be attending?',
    'rsvp.field.guestCount': 'Number of Guests',
    'rsvp.field.dietary': 'Dietary Restrictions',
    'rsvp.field.message': 'Message for the Couple',
    'rsvp.option.yes': 'Yes, I\'ll be there!',
    'rsvp.option.no': 'Sorry, I can\'t make it',
    'rsvp.placeholder.dietary': 'Vegetarian, allergies, etc.',
    'rsvp.placeholder.message': 'Any special message for the couple...',
    'rsvp.placeholder.phone': '123 456 7890',
    'rsvp.submitting': 'Submitting...',
    
    // RSVP Confirmation
    'confirmation.title.confirmed': 'RSVP Confirmed!',
    'confirmation.title.updated': 'RSVP Updated',
    'confirmation.message.attending': 'Thank you {name}! We\'re excited to celebrate with you in {location}.',
    'confirmation.message.not.attending': 'Thank you {name} for letting us know. We\'ll miss you at our {location} celebration.',
    'confirmation.email.sent': 'Confirmation email sent!',
    'confirmation.email.sending': 'Sending confirmation email...',
    'confirmation.email.details': 'Show email details',
    'confirmation.email.hide': 'Hide details',
    'confirmation.email.to': 'To',
    'confirmation.email.subject': 'Subject',
    'confirmation.email.check': 'Please check your inbox and spam folder',
    'confirmation.email.arrive': 'Email will arrive shortly',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'We\'d love to hear from you! Whether you have questions about our wedding celebrations, need help with your RSVP, or just want to send us a message, we\'re here for you.',
    'contact.form.title': 'Send us a Message',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.placeholder.message': 'Tell us what\'s on your mind...',
    'contact.form.sending': 'Sending...',
    'contact.form.send': 'Send Message',
    'contact.subject.rsvp': 'RSVP Help',
    'contact.subject.romania': 'Romania Wedding',
    'contact.subject.vietnam': 'Vietnam Wedding',
    'contact.subject.travel': 'Travel & Accommodation',
    'contact.subject.dietary': 'Dietary Requirements',
    'contact.subject.gifts': 'Gift Registry',
    'contact.subject.general': 'General Question',
    'contact.subject.other': 'Other',
    'contact.info.title': 'Get in Touch',
    'contact.info.locations': 'Wedding Locations',
    'contact.info.romania': 'Oradea, Romania - September 11-12, 2026',
    'contact.info.vietnam': 'Hanoi, Vietnam - September 26, 2026',
    'contact.links.title': 'Quick Links',
    'contact.links.romania': 'Romania Wedding Details & RSVP',
    'contact.links.vietnam': 'Vietnam Wedding Details & RSVP',
    'contact.links.home': 'Back to Home',
    'contact.sent.title': 'Message Sent!',
    'contact.sent.message': 'Thank you for reaching out! We\'ve received your message and will get back to you as soon as possible.',
    'contact.sent.another': 'Send Another Message',
    'contact.sent.home': 'Back to Home',
    'contact.quote': 'We can\'t wait to celebrate with you!',
    
    // Questions
    'questions.text': 'Questions? Contact us: catalam@catalam.com',
    
    // Itinerary - Romania
    'itinerary.romania.day1.title': 'Thursday, September 11th, 2026',
    'itinerary.romania.day1.subtitle': 'Welcome Day',
    'itinerary.romania.day1.welcome.title': 'Welcome Dinner',
    'itinerary.romania.day1.welcome.location': 'Restaurant Capitolium, Oradea',
    'itinerary.romania.day1.welcome.description': 'Meet and greet with family and friends',
    'itinerary.romania.day2.title': 'Friday, September 12th, 2026',
    'itinerary.romania.day2.subtitle': 'Wedding Day',
    'itinerary.romania.day2.civil.title': 'Civil Wedding Ceremony',
    'itinerary.romania.day2.civil.location': 'Oradea City Hall',
    'itinerary.romania.day2.civil.description': 'Official civil ceremony',
    'itinerary.romania.day2.celebration.title': 'Wedding Celebration',
    'itinerary.romania.day2.celebration.location': 'Camelot Resort, Oradea',
    'itinerary.romania.day2.celebration.description': 'Traditional Romanian wedding reception',
    
    // Itinerary - Vietnam
    'itinerary.vietnam.day1.title': 'Saturday, September 26th, 2026',
    'itinerary.vietnam.day1.subtitle': 'Wedding Day',
    'itinerary.vietnam.day1.ceremony.title': 'Traditional Tea Ceremony',
    'itinerary.vietnam.day1.ceremony.location': 'Family Home, Hanoi',
    'itinerary.vietnam.day1.ceremony.description': 'Traditional Vietnamese tea ceremony',
    'itinerary.vietnam.day1.reception.title': 'Wedding Reception',
    'itinerary.vietnam.day1.reception.location': 'TBD, Hanoi',
    'itinerary.vietnam.day1.reception.description': 'Celebration dinner with family and friends',
    'itinerary.vietnam.day2.title': 'Sunday, September 27th, 2026 (Optional)',
    'itinerary.vietnam.day2.subtitle': 'Cultural Activities',
    'itinerary.vietnam.day2.activities.title': 'Hanoi City Tour',
    'itinerary.vietnam.day2.activities.location': 'Various locations, Hanoi',
    'itinerary.vietnam.day2.activities.description': 'Explore Hanoi with the wedding party',
    
    // Invite Verification
    'invite.welcome.title': 'Welcome to Our {location} Wedding',
    'invite.welcome.description': 'Please enter your invite ID to continue. You should have received this unique code with your invitation.',
    'invite.field.placeholder': 'Enter your invite ID',
    'invite.button.verifying': 'Verifying...',
    'invite.button.continue': 'Continue to Wedding',
    'invite.error.empty': 'Please enter your invite ID',
    'invite.error.invalid': 'Failed to verify invite',
    'invite.error.location': 'Your invitation doesn\'t include the {location} wedding. Please check with the couple if you have multiple invitations.',
    'invite.help': 'Don\'t have an invite ID? Please contact the couple.',
    
    // Errors
    'error.rsvp': 'Sorry, there was an error submitting your RSVP. Please try again.',
    'error.email': 'An error occurred when trying to send you a confirmation email to {email}. Please try again or contact Cata & Lam directly.',
    'error.contact': 'Sorry, there was an error sending your message. Please try again.',
    'error.image': 'Failed to load image',
    
    // Timeline
    'timeline.date.unknown': 'Date Unknown',
    'timeline.tag.prefix': 'Tagged:',
    
    // Navigation
    'nav.footer.wedding': 'Wedding 2026 ✨',
    
    // Form validation
    'validation.name.required': 'Name is required',
    'validation.email.required': 'Email is required',
    'validation.email.invalid': 'Please enter a valid email',
    'validation.subject.required': 'Please select a subject',
    'validation.message.required': 'Message is required',
    'validation.message.minLength': 'Message must be at least 10 characters',
    
    // Success messages
    'success.rsvp': 'Thank you {name} for your RSVP! We will contact you soon.',
    'success.email': 'A confirmation email was sent to {email}',
    'success.reconfirm': 'Thank you for re-confirming your attendance! A confirmation email was sent to {email}',
    
    // Additional translations needed for missing keys
    'error.title': 'Error',
  },
  
  ro: {
    // Navigation
    'nav.home': 'Acasă',
    'nav.about': 'Despre Noi',
    'nav.vietnam': 'Nuntă Vietnam',
    'nav.romania': 'Nuntă România',
    'nav.contact': 'Contact',
    
    // Common
    'common.loading': 'Se încarcă amintirile noastre...',
    'common.email': 'Email',
    'common.phone': 'Telefon',
    'common.name': 'Nume Complet',
    'common.submit': 'Trimite',
    'common.cancel': 'Anulează',
    'common.close': 'Închide',
    'common.done': 'Gata',
    'common.modify': 'Modifică',
    'common.yes': 'Da',
    'common.no': 'Nu',
    'common.required': '*',
    
    // Home page
    'home.title': 'Cata & Lam',
    'home.subtitle': 'Celebrarea Nunții 2026',
    'home.description': 'Alăturați-vă la celebrările noastre de nuntă în România și Vietnam',
    'home.about.button': 'Citește Povestea Noastră',
    'home.memories.title': 'Amintiri În Curând',
    
    // About page
    'about.title': 'Povestea Noastră de Dragoste',
    'about.description': 'O călătorie a două inimi care devin una, prin culturi și continente',
    'about.subtitle': 'O călătorie a două inimi care devin una, prin culturi și continente',
    'about.sort.newest': 'Cele Mai Noi Primul',
    'about.sort.oldest': 'Cele Mai Vechi Primul',
    'about.timeline.empty.title': 'Nu s-au găsit amintiri',
    'about.timeline.empty.subtitle': 'Cronologia noastră este încă în curs de creare...',
    
    // Timeline
    'timeline.newest': 'Cele Mai Noi',
    'timeline.oldest': 'Cele Mai Vechi',
    'timeline.empty.title': 'Nu s-au găsit amintiri',
    'timeline.empty.message': 'Cronologia noastră este încă în curs de creare...',
    'common.first': 'Primul',
    
    // Wedding pages
    'wedding.verification.loading': 'Se verifică invitația...',
    'wedding.hero.title': 'Celebrarea Nunții din {location}',
    'wedding.itinerary.title': 'Programul Nunții',
    
    // RSVP
    'rsvp.title': 'Confirmarea Prezenței - Nunta {location}',
    'rsvp.subtitle': 'Bun venit {name}! Te rugăm să ne spui dacă vei fi alături de noi în ziua noastră specială din {location}.',
    'rsvp.already.title': 'Ai confirmat deja!',
    'rsvp.already.message': 'Mulțumim că ai confirmat prezența la celebrarea noastră din {location}.',
    'rsvp.please.title': 'Te rugăm să confirmi',
    'rsvp.please.message': 'Spune-ne dacă vei fi alături de noi în ziua noastră specială din {location}.',
    'rsvp.button.now': 'Confirmă Acum',
    'rsvp.button.update': 'Actualizează',
    'rsvp.modal.title': 'Confirmarea Prezenței',
    'rsvp.modal.title.modify': 'Modifică Răspunsul',
    'rsvp.modal.welcome': 'Bun venit {name}!',
    'rsvp.modal.description': 'Te rugăm să ne spui dacă vei fi alături de noi în ziua noastră specială din {location}',
    'rsvp.modal.already.message': 'Ai confirmat deja prezența. Poți modifica răspunsul mai jos.',
    'rsvp.field.email': 'Adresa de Email',
    'rsvp.field.phone': 'Număr de Telefon',
    'rsvp.field.country': 'Țara',
    'rsvp.field.attending': 'Vei participa?',
    'rsvp.field.guestCount': 'Numărul de Invitați',
    'rsvp.field.dietary': 'Restricții Alimentare',
    'rsvp.field.message': 'Mesaj pentru Cuplu',
    'rsvp.option.yes': 'Da, voi fi acolo!',
    'rsvp.option.no': 'Nu, nu pot participa',
    'rsvp.placeholder.dietary': 'Vegetarian, alergii, etc.',
    'rsvp.placeholder.message': 'Mesaj pentru cuplul ...',
    'rsvp.submitting': 'Se trimite...',
    
    // RSVP Confirmation
    'confirmation.title.confirmed': 'Confirmat!',
    'confirmation.title.updated': 'Actualizat',
    'confirmation.message.attending': 'Mulțumim {name}! Ne bucurăm să sărbătorim cu tine în {location}.',
    'confirmation.message.not.attending': 'Mulțumim {name} că ne-ai anunțat. O să ne lipsești la celebrarea din {location}.',
    'confirmation.email.sent': 'Email trimis!',
    'confirmation.email.sending': 'Se trimite email...',
    'confirmation.email.details': 'Arată detalii',
    'confirmation.email.hide': 'Ascunde detalii',
    'confirmation.email.to': 'Către',
    'confirmation.email.subject': 'Subiect',
    'confirmation.email.check': 'Te rugăm verifică inbox-ul și folderul spam',
    'confirmation.email.arrive': 'Email-ul va sosi în curând',
    
    // Contact
    'contact.title': 'Contactează-ne',
    'contact.description': 'Ne-ar plăcea să auzim de la tine! Fie că ai întrebări despre celebrările noastre de nuntă, ai nevoie de ajutor cu confirmarea sau vrei doar să ne trimiți un mesaj, suntem aici pentru tine.',
    'contact.form.title': 'Trimite-ne un Mesaj',
    'contact.form.subject': 'Subiect',
    'contact.form.message': 'Mesaj',
    'contact.form.placeholder.message': 'Spune-ne ce ai pe suflet...',
    'contact.form.sending': 'Se trimite...',
    'contact.form.send': 'Trimite Mesaj',
    'contact.info.title': 'Intră în Contact',
    'contact.info.locations': 'Locațiile Nunții',
    'contact.info.romania': 'Oradea, România - 11-12 Septembrie 2026',
    'contact.info.vietnam': 'Hanoi, Vietnam - 26 Septembrie 2026',
    'contact.links.title': 'Link-uri Rapide',
    'contact.links.romania': 'Detalii Nuntă România & Confirmarea',
    'contact.links.vietnam': 'Detalii Nuntă Vietnam & Confirmarea',
    'contact.links.home': 'Înapoi Acasă',
    'contact.sent.title': 'Mesaj Trimis!',
    'contact.sent.message': 'Mulțumim că ne-ai contactat! Am primit mesajul tău și îți vom răspunde cât mai curând posibil.',
    'contact.sent.another': 'Trimite Alt Mesaj',
    'contact.sent.home': 'Înapoi Acasă',
    'contact.quote': 'Abia așteptăm să sărbătorim cu voi!',
    
    // Questions
    'questions.text': 'Întrebări? Contactează-ne: catalam@catalam.com',
    
    // Itinerary - Romania
    'itinerary.romania.day1.title': 'Joi, 11 Septembrie 2026',
    'itinerary.romania.day1.subtitle': 'Ziua de Întâmpinare',
    'itinerary.romania.day1.welcome.title': 'Cina de Întâmpinare',
    'itinerary.romania.day1.welcome.location': 'Restaurant Capitolium, Oradea',
    'itinerary.romania.day1.welcome.description': 'Întâlnire cu familia și prietenii',
    'itinerary.romania.day2.title': 'Vineri, 12 Septembrie 2026',
    'itinerary.romania.day2.subtitle': 'Ziua Nunții',
    'itinerary.romania.day2.civil.title': 'Cununia Civilă',
    'itinerary.romania.day2.civil.location': 'Primăria Oradea',
    'itinerary.romania.day2.civil.description': 'Ceremonia civilă oficială',
    'itinerary.romania.day2.celebration.title': 'Celebrarea Nunții',
    'itinerary.romania.day2.celebration.location': 'Camelot Resort, Oradea',
    'itinerary.romania.day2.celebration.description': 'Recepția tradițională românească de nuntă',
    
    // Itinerary - Vietnam
    'itinerary.vietnam.day1.title': 'Sâmbătă, 26 Septembrie 2026',
    'itinerary.vietnam.day1.subtitle': 'Ziua Nunții',
    'itinerary.vietnam.day1.ceremony.title': 'Ceremonia Tradițională cu Ceai',
    'itinerary.vietnam.day1.ceremony.location': 'Casa de Familie, Hanoi',
    'itinerary.vietnam.day1.ceremony.description': 'Ceremonia tradițională vietnameză cu ceai',
    'itinerary.vietnam.day1.reception.title': 'Recepția de Nuntă',
    'itinerary.vietnam.day1.reception.location': 'De stabilit, Hanoi',
    'itinerary.vietnam.day1.reception.description': 'Cina de sărbătoare cu familia și prietenii',
    'itinerary.vietnam.day2.title': 'Duminică, 27 Septembrie 2026 (Opțional)',
    'itinerary.vietnam.day2.subtitle': 'Activități Culturale',
    'itinerary.vietnam.day2.activities.title': 'Tur al Orașului Hanoi',
    'itinerary.vietnam.day2.activities.location': 'Diverse locații, Hanoi',
    'itinerary.vietnam.day2.activities.description': 'Explorează Hanoi cu petrecerea de nuntă',
    
    // Invite Verification
    'invite.welcome.title': 'Bun venit la Nunta noastră din {location}',
    'invite.welcome.description': 'Te rugăm să introduci ID-ul invitației pentru a continua. Ar trebui să fi primit acest cod unic cu invitația ta.',
    'invite.field.placeholder': 'Introdu ID-ul invitației',
    'invite.button.verifying': 'Se verifică...',
    'invite.button.continue': 'Continuă la Nuntă',
    'invite.error.empty': 'Te rugăm să introduci ID-ul invitației',
    'invite.error.invalid': 'Nu s-a putut verifica invitația',
    'invite.error.location': 'Invitația ta nu include nunta din {location}. Te rugăm să verifici cu cuplul dacă ai multiple invitații.',
    'invite.help': 'Nu ai un ID de invitație? Te rugăm să contactezi cuplul.',
    
    // Errors
    'error.rsvp': 'Eroare - vă rugăm să încercați din nou!',
    'error.email': 'A apărut o eroare la trimiterea email-ului de confirmare către {email}. Te rugăm să încerci din nou sau să ne contactezi direct.',
    'error.contact': 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.',
    'error.image': 'Eroare la încărcarea imaginii',
    
    // Wedding pages - missing translations
    'wedding.romania.description': 'Alăturați-vă nouă în frumoasa cetate Oradea pentru celebrarea nunții românești.',
    'wedding.vietnam.description': 'Sărbătoriți cu noi în vibrantul Cam Ranh pentru ceremonia vietnameză.',
    'wedding.venue.title': 'Locația Nunții',
    'wedding.venue.tbd': 'Detaliile locației vor fi anunțate în curând...',
    'wedding.location.title': 'Locația din {location}',
    'wedding.welcome.confirmed': 'Ne bucurăm să te vedem la Nunta noastră din {location}, {name}!',
    'wedding.welcome.pending': 'Bun venit {name}! Ne-ar face plăcere să te avem la Nunta noastră din {location}',
    
    // RSVP placeholder phone
    'rsvp.placeholder.phone': '123 456 7890',
    
    // Contact form subjects
    'contact.subject.rsvp': 'Ajutor RSVP',
    'contact.subject.romania': 'Nunta România',
    'contact.subject.vietnam': 'Nunta Vietnam', 
    'contact.subject.travel': 'Călătorie și Cazare',
    'contact.subject.dietary': 'Restricții Alimentare',
    'contact.subject.gifts': 'Lista de Cadouri',
    'contact.subject.general': 'Întrebare Generală',
    'contact.subject.other': 'Altceva',
    
    // Timeline
    'timeline.date.unknown': 'Dată Necunoscută',
    'timeline.tag.prefix': 'Etichetat:',
    
    // Navigation
    'nav.footer.wedding': 'Nuntă 2026 ✨',
    
    // Form validation
    'validation.name.required': 'Numele este obligatoriu',
    'validation.email.required': 'Email-ul este obligatoriu',
    'validation.email.invalid': 'Te rugăm să introduci un email valid',
    'validation.subject.required': 'Te rugăm să selectezi un subiect',
    'validation.message.required': 'Mesajul este obligatoriu',
    'validation.message.minLength': 'Mesajul trebuie să aibă cel puțin 10 caractere',
    
    // Success messages
    'success.rsvp': 'Mulțumim {name} pentru confirmare! Te vom contacta în curând.',
    'success.email': 'Un email de confirmare a fost trimis la {email}',
    'success.reconfirm': 'Mulțumim pentru re-confirmare! Un email de confirmare a fost trimis la {email}',
    
    // Additional translations
    'error.title': 'Eroare',
  },
  
  vi: {
    // Navigation
    'nav.home': 'Trang Chủ',
    'nav.about': 'Về Chúng Tôi',
    'nav.vietnam': 'Đám Cưới Việt Nam',
    'nav.romania': 'Đám Cưới Romania',
    'nav.contact': 'Liên Hệ',
    
    // Common
    'common.loading': 'Đang tải kỷ niệm của chúng tôi...',
    'common.email': 'Email',
    'common.phone': 'Điện Thoại',
    'common.name': 'Họ và Tên',
    'common.submit': 'Gửi',
    'common.cancel': 'Hủy',
    'common.close': 'Đóng',
    'common.done': 'Xong',
    'common.modify': 'Sửa Đổi',
    'common.yes': 'Có',
    'common.no': 'Không',
    'common.required': '*',
    
    // Home page
    'home.title': 'Cata & Lam',
    'home.subtitle': 'Lễ Cưới 2026',
    'home.description': 'Tham gia cùng chúng tôi trong lễ cưới tại Romania và Việt Nam',
    'home.about.button': 'Đọc Câu Chuyện Của Chúng Tôi',
    'home.memories.title': 'Kỷ Niệm Sắp Ra Mắt',
    
    // About page
    'about.title': 'Câu Chuyện Tình Yêu',
    'about.description': 'Hành trình của hai trái tim hòa làm một, qua các nền văn hóa và lục địa',
    'about.subtitle': 'Hành trình của hai trái tim hòa làm một, qua các nền văn hóa và lục địa',
    'about.sort.newest': 'Mới Nhất Trước',
    'about.sort.oldest': 'Cũ Nhất Trước', 
    'about.timeline.empty.title': 'Không tìm thấy kỷ niệm',
    'about.timeline.empty.subtitle': 'Dòng thời gian của chúng tôi vẫn đang được tạo...',
    
    // Timeline
    'timeline.newest': 'Mới Nhất',
    'timeline.oldest': 'Cũ Nhất',
    'timeline.empty.title': 'Không tìm thấy kỷ niệm',
    'timeline.empty.message': 'Dòng thời gian của chúng tôi vẫn đang được tạo...',
    'common.first': 'Trước',
    
    // Wedding pages
    'wedding.verification.loading': 'Đang xác minh lời mời...',
    'wedding.hero.title': 'Lễ Cưới {location}',
    'wedding.itinerary.title': 'Chương Trình Cưới',
    
    // RSVP
    'rsvp.title': 'Xác Nhận Tham Dự - Đám Cưới {location}',
    'rsvp.subtitle': 'Chào mừng {name}! Vui lòng cho chúng tôi biết bạn có tham gia cùng chúng tôi trong ngày đặc biệt tại {location} không.',
    'rsvp.already.title': 'Bạn đã xác nhận!',
    'rsvp.already.message': 'Cảm ơn bạn đã xác nhận tham dự lễ kỷ niệm {location} của chúng tôi.',
    'rsvp.please.title': 'Vui Lòng Xác Nhận',
    'rsvp.please.message': 'Cho chúng tôi biết bạn có tham gia cùng chúng tôi trong ngày đặc biệt tại {location} không.',
    'rsvp.button.now': 'Xác Nhận Ngay',
    'rsvp.button.update': 'Cập Nhật',
    'rsvp.modal.title': 'Xác Nhận Tham Dự',
    'rsvp.modal.title.modify': 'Sửa Đổi Xác Nhận',
    'rsvp.modal.welcome': 'Chào mừng {name}!',
    'rsvp.modal.description': 'Vui lòng cho chúng tôi biết bạn có tham gia cùng chúng tôi trong ngày đặc biệt tại {location} không',
    'rsvp.modal.already.message': 'Bạn đã xác nhận tham dự đám cưới này. Bạn có thể sửa đổi phản hồi bên dưới.',
    'rsvp.field.email': 'Địa Chỉ Email',
    'rsvp.field.phone': 'Số Điện Thoại',
    'rsvp.field.country': 'Quốc Gia',
    'rsvp.field.attending': 'Bạn có tham dự không?',
    'rsvp.field.guestCount': 'Số Lượng Khách',
    'rsvp.field.dietary': 'Hạn Chế Chế Độ Ăn',
    'rsvp.field.message': 'Lời Nhắn Cho Cặp Đôi',
    'rsvp.option.yes': 'Có, tôi sẽ có mặt!',
    'rsvp.option.no': 'Xin lỗi, tôi không thể tham gia',
    'rsvp.placeholder.dietary': 'Chay, dị ứng, v.v.',
    'rsvp.placeholder.message': 'Lời nhắn đặc biệt cho cặp đôi...',
    'rsvp.submitting': 'Đang gửi...',
    
    // RSVP Confirmation
    'confirmation.title.confirmed': 'Đã Xác Nhận!',
    'confirmation.title.updated': 'Đã Cập Nhật',
    'confirmation.message.attending': 'Cảm ơn {name}! Chúng tôi rất vui mừng được ăn mừng cùng bạn tại {location}.',
    'confirmation.message.not.attending': 'Cảm ơn {name} đã cho chúng tôi biết. Chúng tôi sẽ nhớ bạn tại lễ kỷ niệm {location}.',
    'confirmation.email.sent': 'Email xác nhận đã được gửi!',
    'confirmation.email.sending': 'Đang gửi email xác nhận...',
    'confirmation.email.details': 'Hiển thị chi tiết email',
    'confirmation.email.hide': 'Ẩn chi tiết',
    'confirmation.email.to': 'Đến',
    'confirmation.email.subject': 'Chủ Đề',
    'confirmation.email.check': 'Vui lòng kiểm tra hộp thư đến và thư mục spam',
    'confirmation.email.arrive': 'Email sẽ đến trong thời gian ngắn',
    
    // Contact
    'contact.title': 'Liên Hệ Chúng Tôi',
    'contact.description': 'Chúng tôi rất muốn nghe từ bạn! Cho dù bạn có câu hỏi về lễ cưới của chúng tôi, cần help với xác nhận tham dự, hay chỉ muốn gửi tin nhắn, chúng tôi ở đây cho bạn.',
    'contact.form.title': 'Gửi Tin Nhắn Cho Chúng Tôi',
    'contact.form.subject': 'Chủ Đề',
    'contact.form.message': 'Tin Nhắn',
    'contact.form.placeholder.message': 'Cho chúng tôi biết bạn đang nghĩ gì...',
    'contact.form.sending': 'Đang gửi...',
    'contact.form.send': 'Gửi Tin Nhắn',
    'contact.info.title': 'Liên Lạc',
    'contact.info.locations': 'Địa Điểm Cưới',
    'contact.info.romania': 'Oradea, Romania - 11-12 Tháng 9, 2026',
    'contact.info.vietnam': 'Hà Nội, Việt Nam - 26 Tháng 9, 2026',
    'contact.links.title': 'Liên Kết Nhanh',
    'contact.links.romania': 'Chi Tiết Đám Cưới Romania & Xác Nhận',
    'contact.links.vietnam': 'Chi Tiết Đám Cưới Việt Nam & Xác Nhận',
    'contact.links.home': 'Về Trang Chủ',
    'contact.sent.title': 'Tin Nhắn Đã Gửi!',
    'contact.sent.message': 'Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi bạn sớm nhất có thể.',
    'contact.sent.another': 'Gửi Tin Nhắn Khác',
    'contact.sent.home': 'Về Trang Chủ',
    'contact.quote': 'Chúng tôi không thể chờ đợi để ăn mừng cùng bạn!',
    
    // Questions
    'questions.text': 'Câu hỏi? Liên hệ chúng tôi: catalam@catalam.com',
    
    // Itinerary - Romania
    'itinerary.romania.day1.title': 'Thứ Năm, 11 Tháng 9, 2026',
    'itinerary.romania.day1.subtitle': 'Ngày Chào Đón',
    'itinerary.romania.day1.welcome.title': 'Bữa Tối Chào Đón',
    'itinerary.romania.day1.welcome.location': 'Nhà hàng Capitolium, Oradea',
    'itinerary.romania.day1.welcome.description': 'Gặp gỡ gia đình và bạn bè',
    'itinerary.romania.day2.title': 'Thứ Sáu, 12 Tháng 9, 2026',
    'itinerary.romania.day2.subtitle': 'Ngày Cưới',
    'itinerary.romania.day2.civil.title': 'Lễ Cưới Dân Sự',
    'itinerary.romania.day2.civil.location': 'Tòa thị chính Oradea',
    'itinerary.romania.day2.civil.description': 'Lễ cưới dân sự chính thức',
    'itinerary.romania.day2.celebration.title': 'Lễ Kỷ Niệm Cưới',
    'itinerary.romania.day2.celebration.location': 'Camelot Resort, Oradea',
    'itinerary.romania.day2.celebration.description': 'Tiệc cưới truyền thống Romania',
    
    // Itinerary - Vietnam
    'itinerary.vietnam.day1.title': 'Thứ Bảy, 26 Tháng 9, 2026',
    'itinerary.vietnam.day1.subtitle': 'Ngày Cưới',
    'itinerary.vietnam.day1.ceremony.title': 'Lễ Trà Truyền Thống',
    'itinerary.vietnam.day1.ceremony.location': 'Nhà gia đình, Hà Nội',
    'itinerary.vietnam.day1.ceremony.description': 'Lễ trà truyền thống Việt Nam',
    'itinerary.vietnam.day1.reception.title': 'Tiệc Cưới',
    'itinerary.vietnam.day1.reception.location': 'Sẽ thông báo, Hà Nội',
    'itinerary.vietnam.day1.reception.description': 'Bữa tiệc kỷ niệm với gia đình và bạn bè',
    'itinerary.vietnam.day2.title': 'Chủ Nhật, 27 Tháng 9, 2026 (Tùy chọn)',
    'itinerary.vietnam.day2.subtitle': 'Hoạt Động Văn Hóa',
    'itinerary.vietnam.day2.activities.title': 'Tour Thành Phố Hà Nội',
    'itinerary.vietnam.day2.activities.location': 'Nhiều địa điểm, Hà Nội',
    'itinerary.vietnam.day2.activities.description': 'Khám phá Hà Nội cùng đoàn cưới',
    
    // Invite Verification
    'invite.welcome.title': 'Chào mừng đến với Đám cưới {location} của chúng tôi',
    'invite.welcome.description': 'Vui lòng nhập ID lời mời của bạn để tiếp tục. Bạn nên đã nhận được mã duy nhất này cùng với lời mời.',
    'invite.field.placeholder': 'Nhập ID lời mời',
    'invite.button.verifying': 'Đang xác minh...',
    'invite.button.continue': 'Tiếp tục đến Đám cưới',
    'invite.error.empty': 'Vui lòng nhập ID lời mời',
    'invite.error.invalid': 'Không thể xác minh lời mời',
    'invite.error.location': 'Lời mời của bạn không bao gồm đám cưới {location}. Vui lòng kiểm tra với cặp đôi nếu bạn có nhiều lời mời.',
    'invite.help': 'Không có ID lời mời? Vui lòng liên hệ với cặp đôi.',
    
    // Errors
    'error.rsvp': 'Xin lỗi, đã có lỗi khi gửi xác nhận tham dự. Vui lòng thử lại.',
    'error.email': 'Đã xảy ra lỗi khi gửi email xác nhận đến {email}. Vui lòng thử lại hoặc liên hệ trực tiếp với Cata & Lam.',
    'error.contact': 'Xin lỗi, đã có lỗi khi gửi tin nhắn. Vui lòng thử lại.',
    'error.image': 'Không thể tải hình ảnh',
    
    // Wedding pages - missing translations
    'wedding.romania.description': 'Tham gia cùng chúng tôi tại thành phố xinh đẹp Oradea cho lễ cưới Romania.',
    'wedding.vietnam.description': 'Ăn mừng với chúng tôi tại Thành phố Hồ Chí Minh sôi động cho ceremony Việt Nam.',
    'wedding.venue.title': 'Địa Điểm Cưới',
    'wedding.venue.tbd': 'Chi tiết địa điểm sẽ có sớm...',
    'wedding.location.title': 'Địa Điểm {location}',
    'wedding.welcome.confirmed': 'Chúng tôi rất mong được gặp bạn tại Lễ Cưới của chúng tôi ở {location}, {name}!',
    'wedding.welcome.pending': 'Chào mừng {name}! Chúng tôi rất mong có bạn tại Lễ Cưới của chúng tôi ở {location}',
    
    // RSVP placeholder phone
    'rsvp.placeholder.phone': '123 456 7890',
    
    // Contact form subjects
    'contact.subject.rsvp': 'Hỗ Trợ RSVP',
    'contact.subject.romania': 'Đám Cưới Romania',
    'contact.subject.vietnam': 'Đám Cưới Việt Nam',
    'contact.subject.travel': 'Du Lịch & Chỗ Ở',
    'contact.subject.dietary': 'Hạn Chế Chế Độ Ăn',
    'contact.subject.gifts': 'Danh Sách Quà Tặng',
    'contact.subject.general': 'Câu Hỏi Chung',
    'contact.subject.other': 'Khác',
    
    // Timeline  
    'timeline.date.unknown': 'Ngày Không Rõ',
    'timeline.tag.prefix': 'Được gắn thẻ:',
    
    // Navigation
    'nav.footer.wedding': 'Đám Cưới 2026 ✨',
    
    // Form validation
    'validation.name.required': 'Tên là bắt buộc',
    'validation.email.required': 'Email là bắt buộc',
    'validation.email.invalid': 'Vui lòng nhập email hợp lệ',
    'validation.subject.required': 'Vui lòng chọn chủ đề',
    'validation.message.required': 'Tin nhắn là bắt buộc',
    'validation.message.minLength': 'Tin nhắn phải có ít nhất 10 ký tự',
    
    // Success messages
    'success.rsvp': 'Cảm ơn {name} đã xác nhận! Chúng tôi sẽ liên hệ với bạn sớm.',
    'success.email': 'Email xác nhận đã được gửi đến {email}',
    'success.reconfirm': 'Cảm ơn bạn đã xác nhận lại! Email xác nhận đã được gửi đến {email}',
    
    // Additional translations
    'error.title': 'Lỗi',
  }
};