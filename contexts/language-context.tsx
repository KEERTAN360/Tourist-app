"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    touristSpots: "Tourist Spots",
    pay: "Pay",
    documents: "Documents",
    sos: "SOS",
    services: "Services",

    // Common
    search: "Search",
    menu: "Menu",
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    share: "Share",
    call: "Call",

    // Home Page
    hello: "Hello",
    exploreKarnataka: "Explore Karnataka",
    findSpots: "Find For spots",
    famousTourGuides: "Famous Tour Guides",
    ourPicks: "Our Picks",
    recommendedHotels: "Recommended Hotels",
    tellUsAboutYourself: "Tell us about yourself",
    personalizeExperience: "Help us personalize your experience",
    aboutUs: "ABOUT US",
    trustedCompanion: "Your trusted companion for exploring the beautiful destinations of Karnataka",
    madeInBangalore: "Made in Bangalore, India",

    // Safety
    safetyScore: "Safety Score",
    verySafe: "Very Safe",
    safe: "Safe",
    moderate: "Moderate",
    caution: "Caution",
    highRisk: "High Risk",

    // Emergency
    emergency: "Emergency",
    panic: "PANIC",
    instantPanicButton: "INSTANT PANIC BUTTON",
    immediateEmergency: "Immediate emergency activation - No hold required",
    emergencyActivated: "EMERGENCY ACTIVATED",
    locationShared: "Location shared • Authorities notified",

    // Language
    language: "Language",
    selectLanguage: "Select Language",
  },

  hi: {
    // Navigation
    home: "होम",
    touristSpots: "पर्यटन स्थल",
    pay: "भुगतान",
    documents: "दस्तावेज़",
    sos: "एसओएस",
    services: "सेवाएं",

    // Common
    search: "खोजें",
    menu: "मेन्यू",
    back: "वापस",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    share: "साझा करें",
    call: "कॉल करें",

    // Home Page
    hello: "नमस्ते",
    exploreKarnataka: "कर्नाटक का अन्वेषण करें",
    findSpots: "स्थान खोजें",
    famousTourGuides: "प्रसिद्ध टूर गाइड",
    ourPicks: "हमारी पसंद",
    recommendedHotels: "अनुशंसित होटल",
    tellUsAboutYourself: "अपने बारे में बताएं",
    personalizeExperience: "अपने अनुभव को व्यक्तिगत बनाने में हमारी सहायता करें",
    aboutUs: "हमारे बारे में",
    trustedCompanion: "कर्नाटक के सुंदर गंतव्यों की खोज के लिए आपका विश्वसनीय साथी",
    madeInBangalore: "बैंगलोर, भारत में निर्मित",

    // Safety
    safetyScore: "सुरक्षा स्कोर",
    verySafe: "बहुत सुरक्षित",
    safe: "सुरक्षित",
    moderate: "मध्यम",
    caution: "सावधानी",
    highRisk: "उच्च जोखिम",

    // Emergency
    emergency: "आपातकाल",
    panic: "पैनिक",
    instantPanicButton: "तत्काल पैनिक बटन",
    immediateEmergency: "तत्काल आपातकालीन सक्रियता - कोई होल्ड आवश्यक नहीं",
    emergencyActivated: "आपातकाल सक्रिय",
    locationShared: "स्थान साझा किया गया • अधिकारियों को सूचित किया गया",

    // Language
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
  },

  kn: {
    // Navigation
    home: "ಮನೆ",
    touristSpots: "ಪ್ರವಾಸಿ ಸ್ಥಳಗಳು",
    pay: "ಪಾವತಿ",
    documents: "ದಾಖಲೆಗಳು",
    sos: "ಎಸ್‌ಒಎಸ್",
    services: "ಸೇವೆಗಳು",

    // Common
    search: "ಹುಡುಕಿ",
    menu: "ಮೆನು",
    back: "ಹಿಂದೆ",
    cancel: "ರದ್ದುಗೊಳಿಸಿ",
    save: "ಉಳಿಸಿ",
    delete: "ಅಳಿಸಿ",
    edit: "ಸಂಪಾದಿಸಿ",
    add: "ಸೇರಿಸಿ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    call: "ಕರೆ ಮಾಡಿ",

    // Home Page
    hello: "ನಮಸ್ಕಾರ",
    exploreKarnataka: "ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ",
    findSpots: "ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ",
    famousTourGuides: "ಪ್ರಸಿದ್ಧ ಪ್ರವಾಸ ಮಾರ್ಗದರ್ಶಕರು",
    ourPicks: "ನಮ್ಮ ಆಯ್ಕೆಗಳು",
    recommendedHotels: "ಶಿಫಾರಸು ಮಾಡಿದ ಹೋಟೆಲ್‌ಗಳು",
    tellUsAboutYourself: "ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ",
    personalizeExperience: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ",
    aboutUs: "ನಮ್ಮ ಬಗ್ಗೆ",
    trustedCompanion: "ಕರ್ನಾಟಕದ ಸುಂದರ ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಸహಚರ",
    madeInBangalore: "ಬೆಂಗಳೂರು, ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ",

    // Safety
    safetyScore: "ಸುರಕ್ಷತಾ ಅಂಕ",
    verySafe: "ಬಹಳ ಸುರಕ್ಷಿತ",
    safe: "ಸುರಕ್ಷಿತ",
    moderate: "ಮಧ್ಯಮ",
    caution: "ಎಚ್ಚರಿಕೆ",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",

    // Emergency
    emergency: "ತುರ್ತುಸ್ಥಿತಿ",
    panic: "ಪ್ಯಾನಿಕ್",
    instantPanicButton: "ತತ್ಕ್ಷಣ ಪ್ಯಾನಿಕ್ ಬಟನ್",
    immediateEmergency: "ತತ್ಕ್ಷಣ ತುರ್ತುಸ್ಥಿತಿ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ - ಯಾವುದೇ ಹೋಲ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ",
    emergencyActivated: "ತುರ್ತುಸ್ಥಿತಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ",
    locationShared: "ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ • ಅಧಿಕಾರಿಗಳಿಗೆ ತಿಳಿಸಲಾಗಿದೆ",

    // Language
    language: "ಭಾಷೆ",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
  },

  ml: {
    // Navigation
    home: "ഹോം",
    touristSpots: "ടൂറിസ്റ്റ് സ്പോട്ടുകൾ",
    pay: "പേയ്",
    documents: "ഡോക്യുമെന്റുകൾ",
    sos: "എസ്ഒഎസ്",
    services: "സേവനങ്ങൾ",

    // Common
    search: "തിരയുക",
    menu: "മെനു",
    back: "തിരികെ",
    cancel: "റദ്ദാക്കുക",
    save: "സേവ് ചെയ്യുക",
    delete: "ഇല്ലാതാക്കുക",
    edit: "എഡിറ്റ് ചെയ്യുക",
    add: "ചേർക്കുക",
    share: "പങ്കിടുക",
    call: "വിളിക്കുക",

    // Home Page
    hello: "നമസ്കാരം",
    exploreKarnataka: "കർണാടക പര്യവേക്ഷണം ചെയ്യുക",
    findSpots: "സ്ഥലങ്ങൾ കണ്ടെത്തുക",
    famousTourGuides: "പ്രശസ്ത ടൂർ ഗൈഡുകൾ",
    ourPicks: "ഞങ്ങളുടെ തിരഞ്ഞെടുപ്പുകൾ",
    recommendedHotels: "ശുപാർശ ചെയ്യുന്ന ഹോട്ടലുകൾ",
    tellUsAboutYourself: "നിങ്ങളെക്കുറിച്ച് പറയുക",
    personalizeExperience: "നിങ്ങളുടെ അനുഭവം വ്യക്തിഗതമാക്കാൻ ഞങ്ങളെ സഹായിക്കുക",
    aboutUs: "ഞങ്ങളെക്കുറിച്ച്",
    trustedCompanion: "കർണാടകയിലെ മനോഹരമായ ലക്ഷ്യസ്ഥാനങ്ങൾ പര്യവേക്ഷണം ചെയ്യുന്നതിനുള്ള നിങ്ങളുടെ വിശ്വസ്ത സഹചാരി",
    madeInBangalore: "ബാംഗ്ലൂർ, ഇന്ത്യയിൽ നിർമ്മിച്ചത്",

    // Safety
    safetyScore: "സുരക്ഷാ സ്കോർ",
    verySafe: "വളരെ സുരക്ഷിതം",
    safe: "സുരക്ഷിതം",
    moderate: "മിതമായ",
    caution: "ജാഗ്രത",
    highRisk: "ഉയർന്ന അപകടസാധ്യത",

    // Emergency
    emergency: "അടിയന്തരാവസ്ഥ",
    panic: "പാനിക്",
    instantPanicButton: "തൽക്ഷണ പാനിക് ബട്ടൺ",
    immediateEmergency: "ഉടനടി അടിയന്തരാവസ്ഥ സജീവമാക്കൽ - ഹോൾഡ് ആവശ്യമില്ല",
    emergencyActivated: "അടിയന്തരാവസ്ഥ സജീവമാക്കി",
    locationShared: "ലൊക്കേഷൻ പങ്കിട്ടു • അധികാരികളെ അറിയിച്ചു",

    // Language
    language: "ഭാഷ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
  },

  ta: {
    // Navigation
    home: "முகப்பு",
    touristSpots: "சுற்றுலா இடங்கள்",
    pay: "பணம் செலுத்து",
    documents: "ஆவணங்கள்",
    sos: "எஸ்ஓஎஸ்",
    services: "சேவைகள்",

    // Common
    search: "தேடு",
    menu: "மெனு",
    back: "பின்",
    cancel: "ரத்து செய்",
    save: "சேமி",
    delete: "நீக்கு",
    edit: "திருத்து",
    add: "சேர்",
    share: "பகிர்",
    call: "அழை",

    // Home Page
    hello: "வணக்கம்",
    exploreKarnataka: "கர்நாடகாவை ஆராயுங்கள்",
    findSpots: "இடங்களைக் கண்டறியுங்கள்",
    famousTourGuides: "பிரபல சுற்றுலா வழிகாட்டிகள்",
    ourPicks: "எங்கள் தேர்வுகள்",
    recommendedHotels: "பரிந்துரைக்கப்பட்ட ஹோட்டல்கள்",
    tellUsAboutYourself: "உங்களைப் பற்றி சொல்லுங்கள்",
    personalizeExperience: "உங்கள் அனுபவத்தை தனிப்பயனாக்க எங்களுக்கு உதவுங்கள்",
    aboutUs: "எங்களைப் பற்றி",
    trustedCompanion: "கர்நாடகாவின் அழகான இடங்களை ஆராய்வதற்கான உங்கள் நம்பகமான துணை",
    madeInBangalore: "பெங்களூரு, இந்தியாவில் தயாரிக்கப்பட்டது",

    // Safety
    safetyScore: "பாதுகாப்பு மதிப்பெண்",
    verySafe: "மிகவும் பாதுகாப்பானது",
    safe: "பாதுகாப்பானது",
    moderate: "மிதமான",
    caution: "எச்சரிக்கை",
    highRisk: "அதிக ஆபத்து",

    // Emergency
    emergency: "அவசரநிலை",
    panic: "பீதி",
    instantPanicButton: "உடனடி பீதி பொத்தான்",
    immediateEmergency: "உடனடி அவசரநிலை செயல்படுத்தல் - பிடிப்பு தேவையில்லை",
    emergencyActivated: "அவசரநிலை செயல்படுத்தப்பட்டது",
    locationShared: "இடம் பகிரப்பட்டது • அதிகாரிகளுக்கு தெரிவிக்கப்பட்டது",

    // Language
    language: "மொழி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
  },

  te: {
    // Navigation
    home: "హోమ్",
    touristSpots: "పర్యాటక ప్రాంతాలు",
    pay: "చెల్లింపు",
    documents: "పత్రాలు",
    sos: "ఎస్ఓఎస్",
    services: "సేవలు",

    // Common
    search: "వెతకండి",
    menu: "మెనూ",
    back: "వెనుకకు",
    cancel: "రద్దు చేయండి",
    save: "సేవ్ చేయండి",
    delete: "తొలగించండి",
    edit: "సవరించండి",
    add: "జోడించండి",
    share: "పంచుకోండి",
    call: "కాల్ చేయండి",

    // Home Page
    hello: "నమస్కారం",
    exploreKarnataka: "కర్ణాటకను అన్వేషించండి",
    findSpots: "ప్రాంతాలను కనుగొనండి",
    famousTourGuides: "ప్రసిద్ధ టూర్ గైడ్‌లు",
    ourPicks: "మా ఎంపికలు",
    recommendedHotels: "సిఫార్సు చేయబడిన హోటల్‌లు",
    tellUsAboutYourself: "మీ గురించి చెప్పండి",
    personalizeExperience: "మీ అనుభవాన్ని వ్యక్తిగతీకరించడంలో మాకు సహాయపడండి",
    aboutUs: "మా గురించి",
    trustedCompanion: "కర్ణాటకలోని అందమైన గమ్యస్థానాలను అన్వేషించడానికి మీ విశ్వసనీయ సహచరుడు",
    madeInBangalore: "బెంగళూరు, భారతదేశంలో తయారు చేయబడింది",

    // Safety
    safetyScore: "భద్రతా స్కోర్",
    verySafe: "చాలా సురక్షితం",
    safe: "సురక్షితం",
    moderate: "మధ్యస్థం",
    caution: "జాగ్రత్త",
    highRisk: "అధిక ప్రమాదం",

    // Emergency
    emergency: "అత్యవసర పరిస్థితి",
    panic: "పానిక్",
    instantPanicButton: "తక్షణ పానిక్ బటన్",
    immediateEmergency: "తక్షణ అత్యవసర పరిస్థితి క్రియాశీలత - హోల్డ్ అవసరం లేదు",
    emergencyActivated: "అత్యవసర పరిస్థితి క్రియాశీలం చేయబడింది",
    locationShared: "స్థానం పంచుకోబడింది • అధికారులకు తెలియజేయబడింది",

    // Language
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
  },

  mr: {
    // Navigation
    home: "होम",
    touristSpots: "पर्यटन स्थळे",
    pay: "पेमेंट",
    documents: "कागदपत्रे",
    sos: "एसओएस",
    services: "सेवा",

    // Common
    search: "शोधा",
    menu: "मेनू",
    back: "मागे",
    cancel: "रद्द करा",
    save: "जतन करा",
    delete: "हटवा",
    edit: "संपादित करा",
    add: "जोडा",
    share: "शेअर करा",
    call: "कॉल करा",

    // Home Page
    hello: "नमस्कार",
    exploreKarnataka: "कर्नाटकाचा शोध घ्या",
    findSpots: "ठिकाणे शोधा",
    famousTourGuides: "प्रसिद्ध टूर गाइड",
    ourPicks: "आमची निवड",
    recommendedHotels: "शिफारस केलेली हॉटेल्स",
    tellUsAboutYourself: "आपल्याबद्दल सांगा",
    personalizeExperience: "आपला अनुभव वैयक्तिकृत करण्यात आम्हाला मदत करा",
    aboutUs: "आमच्याबद्दल",
    trustedCompanion: "कर्नाटकातील सुंदर गंतव्यस्थानांचा शोध घेण्यासाठी आपला विश्वसनीय साथीदार",
    madeInBangalore: "बंगळूर, भारतात बनवले",

    // Safety
    safetyScore: "सुरक्षा स्कोअर",
    verySafe: "खूप सुरक्षित",
    safe: "सुरक्षित",
    moderate: "मध्यम",
    caution: "सावधगिरी",
    highRisk: "उच्च जोखीम",

    // Emergency
    emergency: "आणीबाणी",
    panic: "पॅनिक",
    instantPanicButton: "तत्काळ पॅनिक बटण",
    immediateEmergency: "तत्काळ आणीबाणी सक्रियकરण - होल्ड आवश्यक नाही",
    emergencyActivated: "आणीबाणी सक्रिय केली",
    locationShared: "स्थान सामायिक केले • अधिकाऱ्यांना कळवले",

    // Language
    language: "भाषा",
    selectLanguage: "भाषा निवडा",
  },

  gu: {
    // Navigation
    home: "હોમ",
    touristSpots: "પર્યટન સ્થળો",
    pay: "પેમેન્ટ",
    documents: "દસ્તાવેજો",
    sos: "એસઓએસ",
    services: "સેવાઓ",

    // Common
    search: "શોધો",
    menu: "મેનુ",
    back: "પાછળ",
    cancel: "રદ કરો",
    save: "સેવ કરો",
    delete: "ડિલીટ કરો",
    edit: "એડિટ કરો",
    add: "ઉમેરો",
    share: "શેર કરો",
    call: "કૉલ કરો",

    // Home Page
    hello: "નમસ્તે",
    exploreKarnataka: "કર્ણાટકની શોધ કરો",
    findSpots: "સ્થળો શોધો",
    famousTourGuides: "પ્રસિદ્ધ ટૂર ગાઇડ",
    ourPicks: "અમારી પસંદગી",
    recommendedHotels: "ભલામણ કરેલ હોટેલ્સ",
    tellUsAboutYourself: "તમારા વિશે કહો",
    personalizeExperience: "તમારા અનુભવને વ્યક્તિગત બનાવવામાં અમને મદદ કરો",
    aboutUs: "અમારા વિશે",
    trustedCompanion: "કર્ણાટકના સુંદર ગંતવ્યોની શોધ માટે તમારા વિશ્વસનીય સાથી",
    madeInBangalore: "બેંગલોર, ભારતમાં બનાવેલ",

    // Safety
    safetyScore: "સુરક્ષા સ્કોર",
    verySafe: "ખૂબ સુરક્ષિત",
    safe: "સુરક્ષિત",
    moderate: "મધ્યમ",
    caution: "સાવધાની",
    highRisk: "ઉચ્ચ જોખમ",

    // Emergency
    emergency: "કટોકટી",
    panic: "પેનિક",
    instantPanicButton: "તાત્કાલિક પેનિક બટન",
    immediateEmergency: "તાત્કાલિક કટોકટી સક્રિયકરણ - હોલ્ડ જરૂરી નથી",
    emergencyActivated: "કટોકટી સક્રિય કરવામાં આવી",
    locationShared: "સ્થાન શેર કર્યું • અધિકારીઓને જાણ કરી",

    // Language
    language: "ભાષા",
    selectLanguage: "ભાષા પસંદ કરો",
  },

  bn: {
    // Navigation
    home: "হোম",
    touristSpots: "পর্যটন স্থান",
    pay: "পেমেন্ট",
    documents: "নথিপত্র",
    sos: "এসওএস",
    services: "সেবা",

    // Common
    search: "খুঁজুন",
    menu: "মেনু",
    back: "পিছনে",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    add: "যোগ করুন",
    share: "শেয়ার",
    call: "কল করুন",

    // Home Page
    hello: "নমস্কার",
    exploreKarnataka: "কর্ণাটক অন্বেষণ করুন",
    findSpots: "স্থান খুঁজুন",
    famousTourGuides: "বিখ্যাত ট্যুর গাইড",
    ourPicks: "আমাদের পছন্দ",
    recommendedHotels: "প্রস্তাবিত হোটেল",
    tellUsAboutYourself: "আপনার সম্পর্কে বলুন",
    personalizeExperience: "আপনার অভিজ্ঞতা ব্যক্তিগতকরণে আমাদের সাহায্য করুন",
    aboutUs: "আমাদের সম্পর্কে",
    trustedCompanion: "কর্ণাটকের সুন্দর গন্তব্যগুলি অন্বেষণের জন্য আপনার বিশ্বস্ত সঙ্গী",
    madeInBangalore: "বেঙ্গালুরু, ভারতে তৈরি",

    // Safety
    safetyScore: "নিরাপত্তা স্কোর",
    verySafe: "খুবই নিরাপদ",
    safe: "নিরাপদ",
    moderate: "মাঝারি",
    caution: "সতর্কতা",
    highRisk: "উচ্চ ঝুঁকি",

    // Emergency
    emergency: "জরুরি অবস্থা",
    panic: "প্যানিক",
    instantPanicButton: "তাৎক্ষণিক প্যানিক বোতাম",
    immediateEmergency: "তাৎক্ষণিক জরুরি অবস্থা সক্রিয়করণ - হোল্ড প্রয়োজন নেই",
    emergencyActivated: "জরুরি অবস্থা সক্রিয় করা হয়েছে",
    locationShared: "অবস্থান শেয়ার করা হয়েছে • কর্তৃপক্ষকে জানানো হয়েছে",

    // Language
    language: "ভাষা",
    selectLanguage: "ভাষা নির্বাচন করুন",
  },

  tcy: {
    // Navigation (Tulu)
    home: "ಮನೆ",
    touristSpots: "ಪ್ರವಾಸಿ ಸ್ಥಳೊಕುಲು",
    pay: "ದುಡ್ಡು ಕೊರ್ಪುಣೆ",
    documents: "ದಾಖಲೆಲು",
    sos: "ಎಸ್‌ಒಎಸ್",
    services: "ಸೇವೆಲು",

    // Common
    search: "ನಾಡ್",
    menu: "ಮೆನು",
    back: "ಪಿರ್ಕೆ",
    cancel: "ರದ್ದು ಮಲ್ಪುಲೆ",
    save: "ಉಲಯ್",
    delete: "ದೆಪ್ಪುಲೆ",
    edit: "ಬದಲಾವಣೆ ಮಲ್ಪುಲೆ",
    add: "ಸೇರ್ಪುಲೆ",
    share: "ಪಂಚುಲೆ",
    call: "ಕೂಪ್ಪುಲೆ",

    // Home Page
    hello: "ನಮಸ್ಕಾರ",
    exploreKarnataka: "ಕರ್ನಾಟಕೊನು ನಾಡ್ಲೆ",
    findSpots: "ಜಾಗೆಲೆನ್ ನಾಡ್ಲೆ",
    famousTourGuides: "ಪ್ರಸಿದ್ಧ ಪ್ರವಾಸ ಮಾರ್ಗದರ್ಶಕೆರ್",
    ourPicks: "ನಮ್ಮ ಆಯ್ಕೆಲು",
    recommendedHotels: "ಶಿಫಾರಸು ಮಲ್ತಿನ ಹೋಟೆಲ್‌ಲು",
    tellUsAboutYourself: "ಈರೆನ್ ಬಗ್ಗೆ ಪನ್ಲೆ",
    personalizeExperience: "ಈರೆನ್ ಅನುಭವೊನು ವೈಯಕ್ತಿಕ ಮಲ್ಪೆರೆ ನಮಗೆ ಸಹಾಯ ಮಲ್ಪುಲೆ",
    aboutUs: "ನಮ್ಮ ಬಗ್ಗೆ",
    trustedCompanion: "ಕರ್ನಾಟಕೊದ ಸುಂದರ ಗಮ್ಯಸ್ಥಾನೊಕುಲೆನ್ ನಾಡ್ಪೆರೆ ಈರೆನ್ ವಿಶ್ವಾಸಾರ್ಹ ಸಹಚರ",
    madeInBangalore: "ಬೆಂಗಳೂರು, ಭಾರತೊಡು ಮಲ್ತಿನ",

    // Safety
    safetyScore: "ಸುರಕ್ಷತಾ ಅಂಕ",
    verySafe: "ಬಹಳ ಸುರಕ್ಷಿತ",
    safe: "ಸುರಕ್ಷಿತ",
    moderate: "ಮಧ್ಯಮ",
    caution: "ಎಚ್ಚರಿಕೆ",
    highRisk: "ಜಾಸ್ತಿ ಅಪಾಯ",

    // Emergency
    emergency: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ",
    panic: "ಪ್ಯಾನಿಕ್",
    instantPanicButton: "ತತ್ಕಾಲ ಪ್ಯಾನಿಕ್ ಬಟನ್",
    immediateEmergency: "ತತ್ಕಾಲ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಸಕ್રಿಯ ಮಲ್ಪುಣೆ - ಯಾವುದೇ ಹೋಲ್ಡ್ ಬೇಕಿಲ್ಲ",
    emergencyActivated: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಸಕ್ರಿಯ ಮಲ್ತಿನ",
    locationShared: "ಜಾಗೆನ್ ಪಂಚಿನ • ಅಧಿಕಾರಿಕುಲೆಗೆ ತಿಳಿಸಿನ",

    // Language
    language: "ಭಾಸೆ",
    selectLanguage: "ಭಾಸೆನ್ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    localStorage.setItem("selectedLanguage", language)
  }

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage as keyof typeof translations] || translations.en
    return languageTranslations[key as keyof typeof languageTranslations] || key
  }

  return <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>{children}</LanguageContext.Provider>
}
