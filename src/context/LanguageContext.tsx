import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../integrations/supabase/client';

export type Language = 'or' | 'hi' | 'en';

export interface TranslationDict {
  [key: string]: string;
}

const translations: Record<Language, TranslationDict> = {
  or: {
    // Shell & Navigation
    'app.name': 'ଆରୋଗ୍ୟ ସହାୟକ',
    'app.tagline': 'ଆପଣଙ୍କର ପାରିବାରିକ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.trackers': 'ଟ୍ରାକର୍',
    'nav.predictors': 'AI ପୂର୍ବାନୁମାନ',
    'nav.scanners': 'କ୍ୟାମେରା ସ୍କାନ୍',
    'nav.profile': 'ପ୍ରୋଫାଇଲ୍',
    'nav.history': 'ଇତିହାସ',
    'nav.report': 'ସାପ୍ତାହିକ ରିପୋର୍ଟ',
    'nav.landing': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',

    // Common Buttons / Labels
    'btn.save': 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
    'btn.cancel': 'ବାତିଲ କରନ୍ତୁ',
    'btn.submit': 'ଦାଖଲ କରନ୍ତୁ',
    'btn.loading': 'ଲୋଡ୍ ହେଉଛି...',
    'btn.sync': 'ସିଙ୍କ୍ କରନ୍ତୁ',
    'btn.sos': 'জরুরী ସେବା (108)',
    'btn.history_save': 'ଇତିହାସରେ ସଂରକ୍ଷଣ କରନ୍ତୁ',
    'btn.close': 'ବନ୍ଦ କରନ୍ତୁ',
    'btn.back': 'ପଛକୁ ଫେରନ୍ତୁ',
    'btn.login': 'ଲଗ୍ ଇନ୍',
    'btn.register': 'ପଞ୍ଜୀକରଣ',
    'btn.forgot': 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ?',
    'btn.reset': 'ପାସୱାର୍ଡ ରିସେଟ୍',
    'btn.skip': 'ବିନା ଲଗଇନ୍‌ରେ ପ୍ରବେଶ (ଡେଭ୍)',

    // State / Notifications
    'state.offline': 'ଆପଣ ଅଫଲାଇନ୍ ଅଛନ୍ତି - ଆପଣଙ୍କର ତଥ୍ୟ ସ୍ଥାନୀୟ ଭାବରେ ସଂରକ୍ଷିତ ହୋଇଛି',
    'state.online': 'ଆପଣ ଅନଲାଇନ୍ ଅଛନ୍ତି - ତଥ୍ୟ ସିଙ୍କ୍ ହୋଇଛି',
    'state.syncing': 'ତଥ୍ୟ ସିଙ୍କ୍ ହେଉଛି...',
    'state.error': 'କିଛି ତ୍ରୁଟି ଘଟିଲା। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
    'state.no_data': 'କୌଣସି ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ।',

    // Landing Page
    'landing.title': 'ଆରୋଗ୍ୟ ସହାୟକ ସହିତ ସୁସ୍ଥ ରୁହନ୍ତୁ',
    'landing.desc': 'ଏକ ବହୁଭାଷୀ AI ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ ଯାହା ଆପଣଙ୍କର ଦୈନନ୍ଦିନ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାକିଂ, AI ରୋଗ ପୂର୍ବାନୁମାନ ଏବଂ ଅଫଲାଇନ୍ ସ୍ୱାସ୍ଥ୍ୟ ବୈଶିଷ୍ଟ୍ୟ ସହିତ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟର ଯତ୍ନ ନିଏ।',
    'landing.get_started': 'ଆରମ୍ଭ କରନ୍ତୁ',
    'landing.features': 'ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟ ସମୂହ',
    'landing.ai_triage': 'AI ଲକ୍ଷଣ ଯାଞ୍ଚକାରୀ',
    'landing.ai_triage_desc': 'Gemini AI ଦ୍ୱାରା ଚାଳିତ ତୁରନ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ଉପଦେଶ ଓ ପ୍ରାଥମିକ ଚିକିତ୍ସା ସୂଚନା।',
    'landing.trackers': '୧୬+ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାକର୍',
    'landing.trackers_desc': 'ଜଳପାନ, ଶୋଇବା, ମନୋଦଶା, ଔଷଧ ଏବଂ ଶରୀରର ତାପମାତ୍ରା ଇତ୍ୟାଦିକୁ ସହଜରେ ଟ୍ରାକ୍ କରନ୍ତୁ।',
    'landing.cnn': 'ଅନ-ଡିଭାଇସ କ୍ୟାମେରା ସ୍କାନ',
    'landing.cnn_desc': 'TensorFlow.js ବ୍ୟବହାର କରି ଆପଣଙ୍କ ଫୋନରେ ହିଁ ସ୍କିନ୍, ଛାତି X-ray ଏବଂ ଆଖି ସ୍କାନ କରନ୍ତୁ - ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ।',

    // Dashboard
    'dash.welcome': 'ନମସ୍କାର, {name}',
    'dash.score': 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସ୍କୋର',
    'dash.today': 'ଆଜିର ସ୍ୱାସ୍ଥ୍ୟ ଚିତ୍ର',
    'dash.quick_tools': 'ତ୍ୱରିତ ସ୍ୱାସ୍ଥ୍ୟ ଉପକରଣ',
    'dash.score_desc': 'ସାମ୍ପ୍ରତିକ ଶୋଇବା, ଚାପ, ଜଳପାନ ଏବଂ ବ୍ୟାୟାମ ଆଧାରରେ ହିସାବ କରାଯାଇଛି।',
    'dash.water_logged': 'ପିଇଥିବା ପାଣି',
    'dash.sleep_logged': 'ଶୋଇବା ସମୟ',
    'dash.mood_logged': 'ମନୋଦଶା',
    'dash.temp_logged': 'ତାପମାତ୍ରା',

    // Auth
    'auth.email': 'ଇମେଲ୍ ଠିକଣା',
    'auth.password': 'ପାସୱାର୍ଡ',
    'auth.name': 'ପୂରା ନାମ',
    'auth.login_title': 'ଖାତାକୁ ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
    'auth.register_title': 'ନୂଆ ସ୍ୱାସ୍ଥ୍ୟ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
    'auth.already_account': 'ପୂର୍ବରୁ ଖାତା ଅଛି କି? ଲଗଇନ୍ କରନ୍ତୁ',
    'auth.no_account': 'ଖାତା ନାହିଁ କି? ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
    'auth.forgot_desc': 'ଆପଣଙ୍କର ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ, ଆମେ ପାସୱାର୍ଡ ରିସେଟ୍ ଲିଙ୍କ୍ ପଠାଇବୁ।',
    'auth.reset_desc': 'ନୂଆ ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ।',
    'auth.bypass_msg': 'ଡେଭଲପର ବାଇପାସ୍ ସକ୍ରିୟ ଅଛି - ବିନା ପ୍ରମାଣପତ୍ରରେ ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ',

    // Trackers general
    'tracker.water.title': 'ଜଳପାନ ଟ୍ରାକର୍',
    'tracker.water.goal': 'ଦୈନନ୍ଦିନ ଲକ୍ଷ୍ୟ (୮ ଗ୍ଲାସ୍)',
    'tracker.sleep.title': 'ନିଦ୍ରା ଟ୍ରାକର୍',
    'tracker.mood.title': 'ମନୋଦଶା ଜର୍ନାଲ୍',
    'tracker.temp.title': 'ତାପମାତ୍ରା ଲଗର୍',
    'tracker.medicine.title': 'ଔଷଧ ସ୍ମାରକୀ',
    'tracker.stress.title': 'ଚାପ ଯାଞ୍ଚକାରୀ (PSS-10)',
    'tracker.vitals.title': 'ମର୍ନିଂ ଚେକ୍-ଇନ୍',
    'tracker.breathing.title': 'ଶ୍ୱାସକ୍ରିୟା ବ୍ୟାୟାମ',
    'tracker.diet.title': 'ଆହାର ଓ ପଥ୍ୟ ସୁପାରିଶ',
    'tracker.exercise.title': 'ବ୍ୟାୟାମ ଯୋଜନା',
    'tracker.firstaid.title': 'ପ୍ରାଥମିକ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶିକା',
    'tracker.vaccine.title': 'ଟୀକାକରଣ ଟ୍ରାକର୍',
    'tracker.symptom.title': 'AI ଲକ୍ଷଣ ଯାଞ୍ଚକାରୀ',

    // Multi-tab instructions
    'tab.log': 'ଲଗ୍ ପ୍ରବେଶ',
    'tab.trend': '୭-ଦିନର ଟ୍ରେଣ୍ଡ୍',
    'tab.info': 'ସୂଚନା',

    // Screening Disclaimer
    'disclaimer.title': 'ସ୍ୱାସ୍ଥ୍ୟ ସ୍କ୍ରିନିଂ ସୂଚନା ଓ ଅସ୍ୱୀକରଣ',
    'disclaimer.text': 'ଏହା ଏକ AI ସ୍କ୍ରିନିଂ ଉପକରଣ ମାତ୍ର, କୌଣସି ଡାକ୍ତରୀ ଚିକିତ୍ସା ବା ରୋଗ ନିର୍ଣ୍ଣୟ ନୁହେଁ। ଜରୁରୀ ପରିସ୍ଥିତିରେ ତୁରନ୍ତ ଡାକ୍ତରଙ୍କ ସହିତ ପରାମର୍ଶ କରନ୍ତୁ କିମ୍ବା ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ।',

    // Language / Theme labels
    'profile.lang': 'ଭାଷା ପସନ୍ଦ',
    'profile.theme': 'ଥିମ୍',
    'profile.theme.light': 'ଆଲୋକିତ (Light)',
    'profile.theme.dark': 'ଅନ୍ଧକାର (Dark)',
    'profile.logout': 'ଲଗ୍ ଆଉଟ୍',
  },
  hi: {
    // Shell & Navigation
    'app.name': 'आरोग्य सहायक',
    'app.tagline': 'आपका पारिवारिक स्वास्थ्य साथी',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.trackers': 'ट्रैकर्स',
    'nav.predictors': 'AI पूर्वानुमान',
    'nav.scanners': 'कैमरा स्कैन',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.history': 'इतिहास',
    'nav.report': 'साप्ताहिक रिपोर्ट',
    'nav.landing': 'मुख्य पृष्ठ',

    // Common Buttons / Labels
    'btn.save': 'सहेजें',
    'btn.cancel': 'रद्द करें',
    'btn.submit': 'जमा करें',
    'btn.loading': 'लोड हो रहा है...',
    'btn.sync': 'सिंक करें',
    'btn.sos': 'आपातकालीन (108)',
    'btn.history_save': 'इतिहास में सहेजें',
    'btn.close': 'बंद करें',
    'btn.back': 'पीछे जाएं',
    'btn.login': 'लॉग इन',
    'btn.register': 'पंजीकरण',
    'btn.forgot': 'पासवर्ड भूल गए?',
    'btn.reset': 'पासवर्ड रीसेट',
    'btn.skip': 'बिना लॉगिन के प्रवेश (डेव)',

    // State / Notifications
    'state.offline': 'आप ऑफ़लाइन हैं - आपका डेटा स्थानीय रूप से सहेजा गया है',
    'state.online': 'आप ऑनलाइन हैं - डेटा सिंक हो गया है',
    'state.syncing': 'डेटा सिंक हो रहा है...',
    'state.error': 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    'state.no_data': 'कोई डेटा उपलब्ध नहीं है।',

    // Landing Page
    'landing.title': 'आरोग्य सहायक के साथ स्वस्थ रहें',
    'landing.desc': 'एक बहुभाषी AI स्वास्थ्य साथी जो दैनिक स्वास्थ्य ट्रैकिंग, AI रोग जोखिम पूर्वानुमान और ऑफ़लाइन सुविधाओं के साथ आपकी देखभाल करता है।',
    'landing.get_started': 'शुरू करें',
    'landing.features': 'मुख्य विशेषताएं',
    'landing.ai_triage': 'AI लक्षण जांचकर्ता',
    'landing.ai_triage_desc': 'Gemini AI द्वारा संचालित त्वरित स्वास्थ्य सलाह और प्राथमिक चिकित्सा जानकारी।',
    'landing.trackers': '16+ स्वास्थ्य ट्रैकर्स',
    'landing.trackers_desc': 'पानी पीने, नींद, मूड, दवा और तापमान आदि को आसानी से ट्रैक करें।',
    'landing.cnn': 'ऑन-डिवाइस कैमरा स्कैन',
    'landing.cnn_desc': 'TensorFlow.js का उपयोग करके त्वचा, छाती का एक्स-रे और आँख का स्कैन सीधे अपने फ़ोन पर करें - पूरी तरह सुरक्षित।',

    // Dashboard
    'dash.welcome': 'नमस्ते, {name}',
    'dash.score': 'आपका स्वास्थ्य स्कोर',
    'dash.today': 'आज का स्वास्थ्य स्नैपशॉट',
    'dash.quick_tools': 'त्वरित स्वास्थ्य उपकरण',
    'dash.score_desc': 'हाल की नींद, तनाव, पानी और व्यायाम के आधार पर गणना की गई।',
    'dash.water_logged': 'पिया गया पानी',
    'dash.sleep_logged': 'नींद की अवधि',
    'dash.mood_logged': 'मनोदशा',
    'dash.temp_logged': 'तापमान',

    // Auth
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूरा नाम',
    'auth.login_title': 'खाते में लॉग इन करें',
    'auth.register_title': 'नई स्वास्थ्य यात्रा शुरू करें',
    'auth.already_account': 'पहले से खाता है? लॉगिन करें',
    'auth.no_account': 'खाता नहीं है? पंजीकरण करें',
    'auth.forgot_desc': 'अपना ईमेल दर्ज करें, हम पासवर्ड रीसेट लिंक भेजेंगे।',
    'auth.reset_desc': 'नया पासवर्ड दर्ज करें।',
    'auth.bypass_msg': 'डेवलपर बाईपास सक्रिय है - बिना क्रेडेंशियल के डैशबोर्ड पर जाएं',

    // Trackers
    'tracker.water.title': 'जल ट्रैकर',
    'tracker.water.goal': 'दैनिक लक्ष्य (8 गिलास)',
    'tracker.sleep.title': 'नींद ट्रैकर',
    'tracker.mood.title': 'मूड जर्नल',
    'tracker.temp.title': 'तापमान लॉगर',
    'tracker.medicine.title': 'दवा अनुस्मारक',
    'tracker.stress.title': 'तनाव जांचकर्ता (PSS-10)',
    'tracker.vitals.title': 'मॉर्निंग चेक-इन',
    'tracker.breathing.title': 'सांस लेने का व्यायाम',
    'tracker.diet.title': 'आहार और घरेलू उपचार',
    'tracker.exercise.title': 'व्यायाम योजना',
    'tracker.firstaid.title': 'प्राथमिक चिकित्सा गाइड',
    'tracker.vaccine.title': 'टीकाकरण ट्रैकर',
    'tracker.symptom.title': 'AI लक्षण जांचकर्ता',

    // Tabs
    'tab.log': 'डेटा प्रविष्टि',
    'tab.trend': '7-दिवसीय रुझान',
    'tab.info': 'जानकारी',

    // Disclaimer
    'disclaimer.title': 'स्वास्थ्य स्क्रीनिंग अस्वीकरण',
    'disclaimer.text': 'यह केवल एक AI स्क्रीनिंग उपकरण है, कोई चिकित्सीय निदान या उपचार नहीं। आपातकालीन स्थिति में तुरंत डॉक्टर से संपर्क करें या 108 पर कॉल करें।',

    // Profile
    'profile.lang': 'भाषा प्राथमिकता',
    'profile.theme': 'थीम',
    'profile.theme.light': 'प्रकाश (Light)',
    'profile.theme.dark': 'अंधेरा (Dark)',
    'profile.logout': 'लॉग आउट',
  },
  en: {
    // Shell & Navigation
    'app.name': 'Aarogya Sahayak',
    'app.tagline': 'Your Family Health Companion',
    'nav.dashboard': 'Dashboard',
    'nav.trackers': 'Trackers',
    'nav.predictors': 'AI Predictors',
    'nav.scanners': 'Camera Scan',
    'nav.profile': 'Profile',
    'nav.history': 'History',
    'nav.report': 'Weekly Report',
    'nav.landing': 'Home',

    // Common Buttons / Labels
    'btn.save': 'Save Entry',
    'btn.cancel': 'Cancel',
    'btn.submit': 'Submit',
    'btn.loading': 'Loading...',
    'btn.sync': 'Sync Data',
    'btn.sos': 'Emergency SOS (108)',
    'btn.history_save': 'Save to Health History',
    'btn.close': 'Close',
    'btn.back': 'Back',
    'btn.login': 'Log In',
    'btn.register': 'Register',
    'btn.forgot': 'Forgot Password?',
    'btn.reset': 'Reset Password',
    'btn.skip': 'Skip Login (Dev Mode)',

    // State / Notifications
    'state.offline': "You're offline — your data is saved locally",
    'state.online': "You're online — data synchronized",
    'state.syncing': 'Syncing data to cloud...',
    'state.error': 'Something went wrong. Please try again.',
    'state.no_data': 'No records found.',

    // Landing Page
    'landing.title': 'Your Health in Safe Hands',
    'landing.desc': 'A multilingual AI preventive health companion. Track metrics, screen for risk indices, analyze scans locally - all offline-first, designed for India.',
    'landing.get_started': 'Get Started',
    'landing.features': 'Core Features',
    'landing.ai_triage': 'AI Symptom Checker',
    'landing.ai_triage_desc': 'Get immediate triage recommendation and home-care suggestions powered by Gemini AI.',
    'landing.trackers': '16+ Wellness Trackers',
    'landing.trackers_desc': 'Keep logs of hydration, sleep, stress scores, daily temperatures, and prescriptions.',
    'landing.cnn': 'Local Device Scan',
    'landing.cnn_desc': 'Run high-fidelity on-device CNN scans for skin, chest X-rays, eye health directly on your phone.',

    // Dashboard
    'dash.welcome': 'Welcome, {name}',
    'dash.score': 'Your Health Score',
    'dash.today': "Today's Snapshot",
    'dash.quick_tools': 'Quick Health Tools',
    'dash.score_desc': 'Calculated based on recent sleep duration, stress index, hydration, and exercise.',
    'dash.water_logged': 'Water Drunk',
    'dash.sleep_logged': 'Sleep Logged',
    'dash.mood_logged': 'Mood Logged',
    'dash.temp_logged': 'Temperature Logged',

    // Auth
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.login_title': 'Log In to Your Account',
    'auth.register_title': 'Start Your Preventive Health Journey',
    'auth.already_account': 'Already have an account? Log In',
    'auth.no_account': "Don't have an account? Register",
    'auth.forgot_desc': 'Enter your email address to receive a password reset link.',
    'auth.reset_desc': 'Type a new password for your account.',
    'auth.bypass_msg': 'Developer bypass active — click skip to access dashboard',

    // Trackers
    'tracker.water.title': 'Water Tracker',
    'tracker.water.goal': 'Daily Goal (8 Glasses)',
    'tracker.sleep.title': 'Sleep Tracker',
    'tracker.mood.title': 'Mood Journal',
    'tracker.temp.title': 'Body Temperature',
    'tracker.medicine.title': 'Medicine Reminder',
    'tracker.stress.title': 'Stress Checker (PSS-10)',
    'tracker.vitals.title': 'Morning Check-in',
    'tracker.breathing.title': 'Breathing Exercise',
    'tracker.diet.title': 'Diet & Traditional Remedies',
    'tracker.exercise.title': 'Exercise Recommendations',
    'tracker.firstaid.title': 'First Aid Manual',
    'tracker.vaccine.title': 'Vaccination Schedule',
    'tracker.symptom.title': 'AI Symptom Triage',

    // Tabs
    'tab.log': 'Log Value',
    'tab.trend': '7-Day Trend',
    'tab.info': 'Info Guideline',

    // Disclaimer
    'disclaimer.title': 'Preventive Screening Disclaimer',
    'disclaimer.text': 'Aarogya Sahayak provides screening indicators, not medical diagnostics or therapeutic decisions. For emergencies, consult a practitioner or dial 108/112 immediately.',

    // Profile
    'profile.lang': 'Select Language',
    'profile.theme': 'Visual Mode',
    'profile.theme.light': 'Light Style',
    'profile.theme.dark': 'Dark Mode',
    'profile.logout': 'Sign Out',
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('arogya_lang');
    return (saved as Language) || 'or'; // Default to Odia
  });

  useEffect(() => {
    if (isAuthenticated && user && user.id !== '00000000-0000-0000-0000-000000000000') {
      supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.language) {
            const lang = data.language as Language;
            setLanguageState(lang);
            localStorage.setItem('arogya_lang', lang);
          }
        });
    }
  }, [user, isAuthenticated]);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('arogya_lang', lang);
    setLanguageState(lang);
    if (isAuthenticated && user && user.id !== '00000000-0000-0000-0000-000000000000') {
      supabase
        .from('profiles')
        .update({ language: lang, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to sync language preference:', error.message);
          }
        });
    }
  }, [user, isAuthenticated]);

  const dict = useMemo(() => translations[language], [language]);

  const t = useCallback((key: string, variables?: Record<string, string>): string => {
    let text = dict[key] || translations['en'][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  }, [dict]);

  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions): string => {
    const locales: Record<Language, string> = {
      or: 'or-IN',
      hi: 'hi-IN',
      en: 'en-IN'
    };
    return new Intl.NumberFormat(locales[language], options).format(num);
  }, [language]);

  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const parsed = typeof date === 'string' ? new Date(date) : date;
    const locales: Record<Language, string> = {
      or: 'or-IN',
      hi: 'hi-IN',
      en: 'en-IN'
    };
    return new Intl.DateTimeFormat(locales[language], options).format(parsed);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    formatNumber,
    formatDate
  }), [language, setLanguage, t, formatNumber, formatDate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
