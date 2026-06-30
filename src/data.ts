/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Language, 
  TranslationDict, 
  CivicIssue, 
  LedgerTransaction, 
  LocalBusiness, 
  CommunityEvent, 
  AchievementPost, 
  Badge, 
  VotingPoll,
  UserProfile
} from './types';

import { TRANSLATIONS as ALL_TRANSLATIONS } from './translations';

export const TRANSLATIONS: Record<Language, TranslationDict> = ALL_TRANSLATIONS;

const DEPRECATED_TRANSLATIONS = {
  en: {
    appName: "Civitas",
    tagline: "Empowering neighborhoods through civic reporting, transparency, and commerce",
    navHome: "Home & Map",
    navLedger: "Ledger",
    navBusiness: "Local Business",
    navEvents: "Events",
    navAchievements: "Achievements",
    navNews: "Sunday Newspaper",
    navVoting: "Community Vote",
    navProfile: "My Profile",
    
    // Home / Map
    activeIssues: "Active Neighborhood Issues",
    reportAnIssue: "Report New Issue",
    categoryPothole: "Pothole Repair",
    categoryStreetlight: "Streetlight Malfunction",
    categoryGarbage: "Uncontrolled Garbage",
    categoryWaterLeak: "Water Pipeline Leak",
    categoryOther: "Other Civic Issues",
    allCategories: "All Categories",
    statusAll: "All Statuses",
    statusReported: "Reported",
    statusAuthorityContacted: "Authority Contacted",
    statusInProgress: "In Progress",
    statusResolved: "Resolved",
    severityLow: "Low Priority",
    severityMedium: "Medium Priority",
    severityHigh: "Critical/High",
    
    // Issue report form
    title: "Issue Title",
    description: "Detailed Description",
    category: "Category",
    severity: "Severity Level",
    location: "Location",
    attachProof: "Attach Photo/File (Proof)",
    submitReport: "Submit Report to Authority",
    voiceInputLabel: "Voice Report (Speak details)",
    voiceInputListening: "Listening... speak now",
    
    // Details
    authorityNotified: "Official Department Dispatched",
    assignedTo: "Assigned Representative",
    proofAttached: "Verified Proof Attached",
    noProofAttached: "No proof attached yet",
    resolutionDispute: "Is this issue genuinely resolved?",
    disputeAction: "No, dispute claim",
    confirmAction: "Yes, confirm resolution",
    comments: "Discussion Feed",
    addComment: "Post Comment",
    commentPlaceholder: "Ask a question or offer to help...",
    
    // Ledger
    ledgerTitle: "Civic Ledger & Audit",
    ledgerSubtitle: "Track exactly where your ward's development funds are spent",
    totalFundsAllocated: "Funds Allocated (FY 2026)",
    totalFundsSpent: "Total Funds Spent",
    auditTransparency: "Active Community Audits",
    transactionDetails: "Expense Breakdown",
    questionTransaction: "Raise Dispute / Ask for Clarification",
    flaggedForAuthority: "Flagged for auditor review",
    vendor: "Vendor Contracted",
    receipt: "Official Receipt/Doc",
    
    // Business
    businessTitle: "Home Business Directory",
    businessSubtitle: "Support local home-based entrepreneurs and women-led ventures",
    messageOwner: "Chat & Order",
    callOwner: "Call directly",
    searchPlaceholder: "Search services (e.g. food, tailoring, cakes...)",
    ownerName: "Business Owner",
    
    // Events
    eventsTitle: "Community Events Hub",
    eventsSubtitle: "Join hands with neighbors for local initiatives and campaigns",
    rsvpGoing: "Going",
    rsvpInterested: "Interested",
    rsvpNotGoing: "Not Going",
    attendees: "Neighbors RSVP'd",
    organizer: "Organized by",
    
    // Newspaper
    newspaperTitle: "The Sunday Chronicle",
    newspaperSubtitle: "Your weekly digest of civic victories, local commerce, and neighborhood events",
    weeklyDigest: "Weekly News Digest",
    resolvedThisWeek: "Civic Issues Solved",
    ledgerHighlights: "Funds Accounted For",
    featuredEntrepreneur: "Entrepreneur of the Week",
    
    // Achievements
    achievementsTitle: "Civic Heroes Wall",
    achievementsSubtitle: "Celebrating neighbors who actively improve our community every day",
    shareAchievement: "Share Your Contribution",
    userPoints: "Hero Points",
    userLevel: "Level",
    likes: "Applause",
    
    // Voting
    votingTitle: "Civic Voting & Polls",
    votingSubtitle: "Decide on local ward budgets, pending resolutions, and community initiatives",
    deadline: "Deadline to vote",
    castVote: "Cast Vote",
    yourVoteCast: "Your vote has been verified on-ledger",
    activePolls: "Active Ward Votes",
    pastPolls: "Past Voting Results",
    
    // Accessibility
    readAloud: "Read Aloud",
    stopReadAloud: "Stop Speech"
  },
  hi: {
    appName: "कम्युनिटी हीरो",
    tagline: "नागरिक रिपोर्टिंग, वित्तीय पारदर्शिता और स्थानीय व्यवसाय के माध्यम से पड़ोस का सशक्तिकरण",
    navHome: "होम और मानचित्र",
    navLedger: "बहीखाता / पारदर्शिता",
    navBusiness: "स्थानीय व्यवसाय",
    navEvents: "कार्यक्रम",
    navAchievements: "उपलब्धियां",
    navNews: "साप्ताहिक समाचार पत्र",
    navVoting: "सामुदायिक मतदान",
    navProfile: "मेरी प्रोफाइल",
    
    // Home / Map
    activeIssues: "सक्रिय नागरिक शिकायतें",
    reportAnIssue: "नई समस्या दर्ज करें",
    categoryPothole: "सड़क के गड्ढे",
    categoryStreetlight: "स्ट्रीटलाइट खराब",
    categoryGarbage: "कचरे का ढेर",
    categoryWaterLeak: "पानी की पाइपलाइन लीक",
    categoryOther: "अन्य नागरिक समस्याएं",
    allCategories: "सभी श्रेणियां",
    statusAll: "सभी स्थितियां",
    statusReported: "शिकायत दर्ज",
    statusAuthorityContacted: "अधिकारी से संपर्क किया",
    statusInProgress: "कार्य प्रगति पर",
    statusResolved: "समाधान हो गया",
    severityLow: "कम प्राथमिकता",
    severityMedium: "मध्यम प्राथमिकता",
    severityHigh: "अति महत्वपूर्ण/उच्च",
    
    // Issue report form
    title: "समस्या का शीर्षक",
    description: "विस्तृत विवरण",
    category: "श्रेणी",
    severity: "गंभीरता का स्तर",
    location: "स्थान",
    attachProof: "फोटो/दस्तावेज़ संलग्न करें (प्रमाण)",
    submitReport: "अधिकारी को रिपोर्ट भेजें",
    voiceInputLabel: "आवाज द्वारा रिपोर्ट (विवरण बोलें)",
    voiceInputListening: "सुन रहा हूँ... अब बोलें",
    
    // Details
    authorityNotified: "संबद्ध विभाग को भेजा गया",
    assignedTo: "नियुक्त प्रतिनिधि",
    proofAttached: "सत्यापित प्रमाण संलग्न है",
    noProofAttached: "कोई प्रमाण संलग्न नहीं है",
    resolutionDispute: "क्या यह समस्या वास्तव में हल हो गई है?",
    disputeAction: "नहीं, आपत्ति दर्ज करें",
    confirmAction: "हाँ, पुष्टि करें",
    comments: "सामुदायिक चर्चा",
    addComment: "टिप्पणी लिखें",
    commentPlaceholder: "प्रश्न पूछें या मदद की पेशकश करें...",
    
    // Ledger
    ledgerTitle: "नागरिक बहीखाता और ऑडिट",
    ledgerSubtitle: "ट्रैक करें कि आपके वार्ड के विकास कोष कहाँ खर्च हो रहे हैं",
    totalFundsAllocated: "आवंटित बजट (वर्ष 2026)",
    totalFundsSpent: "कुल खर्च किया गया बजट",
    auditTransparency: "सक्रिय सामुदायिक ऑडिट",
    transactionDetails: "खर्च का ब्यौरा",
    questionTransaction: "संदेह उठाएं / स्पष्टीकरण मांगें",
    flaggedForAuthority: "ऑडिटर समीक्षा के लिए चिह्नित",
    vendor: "अनुबंधित ठेकेदार",
    receipt: "आधिकारिक रसीद/दस्तावेज",
    
    // Business
    businessTitle: "स्थानीय व्यापार निर्देशिका",
    businessSubtitle: "घरेलू उद्यमियों और महिला स्वयं सहायता समूहों का समर्थन करें",
    messageOwner: "चैट और ऑर्डर",
    callOwner: "सीधे कॉल करें",
    searchPlaceholder: "सेवाएं खोजें (जैसे भोजन, सिलाई, केक...)",
    ownerName: "व्यवसाय मालिक",
    
    // Events
    eventsTitle: "सामुदायिक कार्यक्रम केंद्र",
    eventsSubtitle: "स्थानीय पहलों और अभियानों के लिए पड़ोसियों के साथ हाथ मिलाएं",
    rsvpGoing: "जा रहा हूँ",
    rsvpInterested: "रुचि रखता हूँ",
    rsvpNotGoing: "नहीं जा रहा",
    attendees: "पड़ोसियों का RSVP",
    organizer: "आयोजक",
    
    // Newspaper
    newspaperTitle: "साप्ताहिक समाचार पत्र",
    newspaperSubtitle: "वार्ड की नागरिक जीत, स्थानीय व्यापार और पड़ोस के कार्यक्रमों का साप्ताहिक सारांश",
    weeklyDigest: "साप्ताहिक समाचार संक्षेप",
    resolvedThisWeek: "हल की गईं शिकायतें",
    ledgerHighlights: "लेखा-जोखा हाइलाइट्स",
    featuredEntrepreneur: "सप्ताह के सर्वश्रेष्ठ उद्यमी",
    
    // Achievements
    achievementsTitle: "नागरिक हीरोज वॉल",
    achievementsSubtitle: "उन पड़ोसियों का सम्मान जो हर दिन हमारे समाज को बेहतर बनाते हैं",
    shareAchievement: "अपना योगदान साझा करें",
    userPoints: "हीरो अंक",
    userLevel: "स्तर",
    likes: "प्रशंसा",
    
    // Voting
    votingTitle: "नागरिक मतदान और सर्वेक्षण",
    votingSubtitle: "वार्ड के बजट, लंबित प्रस्तावों और सामुदायिक पहलों पर निर्णय लें",
    deadline: "मतदान की अंतिम तिथि",
    castVote: "वोट डालें",
    yourVoteCast: "आपका वोट सत्यापित कर लिया गया है",
    activePolls: "सक्रिय वार्ड मतदान",
    pastPolls: "पिछले मतदान के परिणाम",
    
    // Accessibility
    readAloud: "बोलकर सुनाएं",
    stopReadAloud: "आवाज बंद करें"
  },
  kn: {
    appName: "ಕಮ್ಯೂನಿಟಿ ಹೀರೋ",
    tagline: "ನಾಗರಿಕ ವರದಿ, ಹಣಕಾಸು ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಸ್ಥಳೀಯ ವ್ಯಾಪಾರದ ಮೂಲಕ ನೆರೆಹೊರೆಯ ಸಬಲೀಕರಣ",
    navHome: "ಮುಖಪುಟ ಮತ್ತು ನಕ್ಷೆ",
    navLedger: "ಖರ್ಚು ವೆಚ್ಚಗಳ ಪಟ್ಟಿ",
    navBusiness: "ಸ್ಥಳೀಯ ಉದ್ಯಮ",
    navEvents: "ಕಾರ್ಯಕ್ರಮಗಳು",
    navAchievements: "ಸಾಧನೆಗಳು",
    navNews: "ಸಾಪ್ತಾಹಿಕ ಪತ್ರಿಕೆ",
    navVoting: "ಜನಮತ ಸಂಗ್ರಹ",
    navProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    
    // Home / Map
    activeIssues: "ಸಕ್ರಿಯ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು",
    reportAnIssue: "ಹೊಸ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    categoryPothole: "ರಸ್ತೆ ಗುಂಡಿ ದುರಸ್ತಿ",
    categoryStreetlight: "ಬೀದಿ ದೀಪ ದುರಸ್ತಿ",
    categoryGarbage: "ಕಸದ ರಾಶಿ",
    categoryWaterLeak: "ನೀರಿನ ಪೈಪ್ ಸೋರಿಕೆ",
    categoryOther: "ಇತರ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    statusAll: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    statusReported: "ವರದಿಯಾಗಿದೆ",
    statusAuthorityContacted: "ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಲಾಗಿದೆ",
    statusInProgress: "ಕೆಲಸ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    statusResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    severityLow: "ಕಡಿಮೆ ಆದ್ಯತೆ",
    severityMedium: "ಮಧ್ಯಮ ಆದ್ಯತೆ",
    severityHigh: "ಅತಿ ಮುಖ್ಯ/ಹೆಚ್ಚು",
    
    // Issue report form
    title: "ಸಮಸ್ಯೆಯ ಶೀರ್ಷಿಕೆ",
    description: "ವಿವರವಾದ ಮಾಹಿತಿ",
    category: "ವರ್ಗ",
    severity: "ಗಂಭೀರತೆಯ ಮಟ್ಟ",
    location: "ಸ್ಥಳ",
    attachProof: "ಫೋಟೋ/ದಾಖಲೆ ಲಗತ್ತಿಸಿ (ಪುರಾವೆ)",
    submitReport: "ಅಧಿಕಾರಿಗಳಿಗೆ ವರದಿ ಸಲ್ಲಿಸಿ",
    voiceInputLabel: "ಧ್ವನಿ ವರದಿ (ಮಾತನಾಡಿ ವಿವರ ನೀಡಿ)",
    voiceInputListening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    
    // Details
    authorityNotified: "ಸಂಬಂಧಿತ ಇಲಾಖೆಗೆ ರವಾನಿಸಲಾಗಿದೆ",
    assignedTo: "ನಿಯೋಜಿತ ಪ್ರತಿನಿಧಿ",
    proofAttached: "ಪರಿಶೀಲಿಸಿದ ಪುರಾವೆ ಲಗತ್ತಿಸಲಾಗಿದೆ",
    noProofAttached: "ಯಾವುದೇ ಪುರಾವೆ ಲಗತ್ತಿಸಿಲ್ಲ",
    resolutionDispute: "ಈ ಸಮಸ್ಯೆ ನಿಜವಾಗಿಯೂ ಪರಿಹಾರವಾಗಿದೆಯೇ?",
    disputeAction: "ಇಲ್ಲ, ಆಕ್ಷೇಪ ವ್ಯಕ್ತಪಡಿಸಿ",
    confirmAction: "ಹೌದು, ದೃಢೀಕರಿಸಿ",
    comments: "ಚರ್ಚಾವೇದಿಕೆ",
    addComment: "ಅಭಿಪ್ರಾಯ ಹಂಚಿಕೊಳ್ಳಿ",
    commentPlaceholder: "ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಸಹಾಯ ಮಾಡಲು ಮುಂದೆ ಬನ್ನಿ...",
    
    // Ledger
    ledgerTitle: "ನಾಗರಿಕ ಲೆಡ್ಜರ್ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ",
    ledgerSubtitle: "ನಿಮ್ಮ ವಾರ್ಡ್‌ನ ಅಭಿವೃದ್ಧಿ ನಿಧಿಗಳು ಎಲ್ಲಿ ಖರ್ಚಾಗುತ್ತಿವೆ ಎಂಬುದನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    totalFundsAllocated: "ಹಂಚಿಕೆಯಾದ ಒಟ್ಟು ಬಜೆಟ್ (ವರ್ಷ 2026)",
    totalFundsSpent: "ಖರ್ಚಾದ ಒಟ್ಟು ಮೊತ್ತ",
    auditTransparency: "ಸಕ್ರಿಯ ಸಮುದಾಯ ಆಡಿಟ್‌ಗಳು",
    transactionDetails: "ಖರ್ಚು ವೆಚ್ಚಗಳ ವಿವರಣೆ",
    questionTransaction: "ಸಂದೇಹ ವ್ಯಕ್ತಪಡಿಸಿ / ವಿವರಣೆ ಕೇಳಿ",
    flaggedForAuthority: "ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಲಾಗಿದೆ",
    vendor: "ಗುತ್ತಿಗೆದಾರರು",
    receipt: "ಅಧಿಕೃತ ರಶೀದಿ/ದಾಖಲೆ",
    
    // Business
    businessTitle: "ಸ್ಥಳೀಯ ವ್ಯಾಪಾರ ಕೈಪಿಡಿ",
    businessSubtitle: "ಮನೆಯಲ್ಲೇ ಉದ್ಯಮ ನಡೆಸುವ ಸ್ಥಳೀಯ ಮಹಿಳಾ ಉದ್ಯಮಿಗಳನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಿ",
    messageOwner: "ಚಾಟ್ ಮಾಡಿ ಮತ್ತು ಆರ್ಡರ್ ನೀಡಿ",
    callOwner: "ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ",
    searchPlaceholder: "ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: ಊಟ, ಹೊಲಿಗೆ, ಕೇಕ್...)",
    ownerName: "ಉದ್ಯಮದ ಮಾಲೀಕರು",
    
    // Events
    eventsTitle: "ಸಮುದಾಯ ಕಾರ್ಯಕ್ರಮಗಳ ಕೇಂದ್ರ",
    eventsSubtitle: "ನೆರೆಹೊರೆಯವರೊಂದಿಗೆ ಜೊತೆಯಾಗಿ ಸಾರ್ವಜನಿಕ ಕಾರ್ಯಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ",
    rsvpGoing: "ಹೋಗುತ್ತಿದ್ದೇನೆ",
    rsvpInterested: "ಆಸಕ್ತಿ ಇದೆ",
    rsvpNotGoing: "ಹೋಗುತ್ತಿಲ್ಲ",
    attendees: "ಆರ್‌ಎಸ್‌ವಿಪಿ ಮಾಡಿದ ನೆರೆಹೊರೆಯವರು",
    organizer: "ಆಯೋಜಕರು",
    
    // Newspaper
    newspaperTitle: "ಸಾಪ್ತಾಹಿಕ ವಾರ್ತಾ ಪತ್ರಿಕೆ",
    newspaperSubtitle: "ನಮ್ಮ ವಾರ್ಡ್‌ನ ಸಾಧನೆಗಳು, ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳ ಸಾಪ್ತಾಹಿಕ ಪತ್ರಿಕೆ",
    weeklyDigest: "ವಾರದ ಮುಖ್ಯಾಂಶಗಳು",
    resolvedThisWeek: "ಪರಿಹರಿಸಲಾದ ಸಮಸ್ಯೆಗಳು",
    ledgerHighlights: "ಬಜೆಟ್ ಖರ್ಚು ವೆಚ್ಚಗಳ ಹೈಲೈಟ್ಸ್",
    featuredEntrepreneur: "ವಾರದ ವಿಶಿಷ್ಟ ಉದ್ಯಮಿ",
    
    // Achievements
    achievementsTitle: "ನಾಗರಿಕ ಹೀರೋಗಳ ಗೋಡೆ",
    achievementsSubtitle: "ನೆರೆಹೊರೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಶ್ರಮಿಸುತ್ತಿರುವ ನಾಗರಿಕರನ್ನು ಗೌರವಿಸಿ",
    shareAchievement: "ನಿಮ್ಮ ಕೊಡುಗೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
    userPoints: "ಹೀರೋ ಅಂಕಗಳು",
    userLevel: "ಹಂತ",
    likes: "ಮೆಚ್ಚುಗೆ",
    
    // Voting
    votingTitle: "ನಾಗರಿಕ ಮತದಾನ ಮತ್ತು ಪೋಲ್ಸ್",
    votingSubtitle: "ಸ್ಥಳೀಯ ವಾರ್ಡ್ ಬಜೆಟ್‌ಗಳು ಮತ್ತು ವಿವಿಧ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳಿಗೆ ನೀವೇ ನಿರ್ಧರಿಸಿ",
    deadline: "ಮತದಾನದ ಕೊನೆಯ ದಿನಾಂಕ",
    castVote: "ಮತ ಚಲಾಯಿಸಿ",
    yourVoteCast: "ನಿಮ್ಮ ಮತವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ",
    activePolls: "ಸಕ್ರಿಯ ವಾರ್ಡ್ ಮತದಾನಗಳು",
    pastPolls: "ಹಿಂದಿನ ಮತದಾನಗಳ ಫಲಿತಾಂಶಗಳು",
    
    // Accessibility
    readAloud: "ಓದಿ ತಿಳಿಸಿ",
    stopReadAloud: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ"
  }
};

export const MOCK_BADGES: Badge[] = [
  { id: 'badge_reported_5', name: 'Civic Star', description: 'Reported 5 validated neighborhood issues', iconName: 'Star', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'badge_resolved_3', name: 'Pothole Patrol', description: 'Helped resolve 3 road potholes', iconName: 'Hammer', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'badge_clean_up', name: 'Green Guardian', description: 'Organized or attended a sanitation campaign', iconName: 'Leaf', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'badge_local_buy', name: 'Local Champion', description: 'Placed orders with 5 home businesses', iconName: 'ShoppingBag', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'badge_auditor', name: 'Civic Auditor', description: 'Flagged or audited 3 financial ledger spent items', iconName: 'ShieldAlert', color: 'bg-red-100 text-red-800 border-red-300' }
];

export const MOCK_ISSUES: CivicIssue[] = [
  {
    id: "iss_001",
    title: "Major Pothole on 80 Feet Road Bypass",
    description: "Deep pothole right in the middle of 80 Feet Road (near Koramangala block 4 intersection). It fills with water when it rains and has already caused two minor bike skids.",
    category: "pothole",
    severity: "high",
    status: "in_progress",
    latitude: 12.9348,
    longitude: 77.6253,
    reportedBy: "Girish A.",
    reportedDate: "2026-06-25",
    authorityDepartment: "Bruhat Bengaluru Mahanagara Palike (BBMP) - Road Infrastructure Dept",
    authorityContactPerson: "Sub-Divisional Engineer Mr. K. Srinivasa",
    proofs: {
      reported: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400",
      contacted: "Official complaint BBMP-C4029 approved.",
      progress: "https://images.unsplash.com/photo-1599740831244-42ea2d63cc69?auto=format&fit=crop&q=80&w=400",
    },
    comments: [
      { id: "c_1", authorName: "Ananya Hegde", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", text: "This pothole is indeed super dangerous. Thanks for reporting, Girish!", timestamp: "2026-06-25 15:30" },
      { id: "c_2", authorName: "Siddharth Rao", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", text: "BBMP engineers were seen marking this yesterday. Glad action is being taken.", timestamp: "2026-06-28 09:12" }
    ]
  },
  {
    id: "iss_002",
    title: "Completely Blacked-out Streetlights on 5th Cross",
    description: "All 4 streetlights on 5th Cross Road, Indiranagar, have been non-functional for over a week. The street is pitch black after 7 PM, creating safety issues for women and elderly walking home.",
    category: "streetlight",
    severity: "high",
    status: "resolved",
    latitude: 12.9784,
    longitude: 77.6408,
    reportedBy: "Nandini Kumar",
    reportedDate: "2026-06-20",
    authorityDepartment: "Bescom Electric Infrastructure Ward 8",
    authorityContactPerson: "Lineman Overseer Prasad Swamy",
    proofs: {
      reported: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&q=80&w=400",
      contacted: "Complaint ref #BESCOM-8910 logged.",
      progress: "Work order assigned to Substation 4 on June 22.",
      resolved: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=400"
    },
    comments: [
      { id: "c_3", authorName: "Vikram Sen", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", text: "Great news, they fixed this last night! The whole street is beautifully lit now.", timestamp: "2026-06-24 21:00" }
    ],
    isResolvedConfirmedByCommunity: true,
    votesToConfirm: 12,
    votesToDispute: 1
  },
  {
    id: "iss_003",
    title: "Illegal Garbage Dumping & Burning at Corner Park",
    description: "Commercial garbage and construction debris are being dumped nightly near the corner of HSR Layout Sector 2 Children's Park. Locals are also burning plastic trash here early mornings.",
    category: "garbage",
    severity: "medium",
    status: "reported",
    latitude: 12.9121,
    longitude: 77.6445,
    reportedBy: "Ramesh J.",
    reportedDate: "2026-06-28",
    authorityDepartment: "BBMP Solid Waste Management (SWM) - South Zone",
    authorityContactPerson: "Health Inspector Mrs. Manjula Gowda",
    proofs: {
      reported: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400"
    },
    comments: [
      { id: "c_4", authorName: "Kiran Shah", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100", text: "The plastic smoke triggers asthma for kids playing in the park. This needs immediate municipal intervention!", timestamp: "2026-06-29 07:45" }
    ]
  },
  {
    id: "iss_004",
    title: "Severe Water Pipeline Burst near Metro Station",
    description: "Substantial drinking water leak from the main pipeline supply under the pathway near Trinity Metro station. Thousands of liters of water are pooling on the road.",
    category: "water_leak",
    severity: "high",
    status: "authority_contacted",
    latitude: 12.9730,
    longitude: 77.6175,
    reportedBy: "Sanjay Dev",
    reportedDate: "2026-06-29",
    authorityDepartment: "Bangalore Water Supply and Sewerage Board (BWSSB)",
    authorityContactPerson: "Assistant Engineer Ms. Preeti Nair",
    proofs: {
      reported: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400",
      contacted: "BWSSB Central Helpline ticket ID: WAT-4402."
    },
    comments: []
  }
];

export const MOCK_LEDGER: LedgerTransaction[] = [
  {
    id: "tx_001",
    title: "Ward 151 Road Repair & Pothole Patching",
    amount: 155000,
    date: "2026-06-15",
    category: "Road Repair",
    vendor: "A.K. Builders & Infrastructure Pvt Ltd",
    description: "Standard asphalt patching, grading and thermal sealing of 12 recurring heavy potholes across 80 Feet Road and adjacent crosses in Ward 151, Koramangala.",
    relatedIssueId: "iss_001",
    receiptUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400",
    comments: [
      { id: "lc_1", authorName: "Rohan Kamath", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", text: "Wait, ₹1.55 Lakhs for just 12 potholes? That averages over ₹12,000 per pothole! Seems highly inflated.", timestamp: "2026-06-16 11:30" },
      { id: "lc_2", authorName: "Sub-Divisional Engineer Mr. K. Srinivasa (Official)", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100", text: "Dear Rohan, the cost includes asphalt grade materials, hiring of specialized compactors, road block management, and a 2-year maintenance durability warranty from the vendor.", timestamp: "2026-06-18 14:02", authorRole: "BBMP Engineer" }
    ]
  },
  {
    id: "tx_002",
    title: "Streetlight LED Replacement Drive",
    amount: 45000,
    date: "2026-06-22",
    category: "Electricals",
    vendor: "Surya Lightings & Electricals Bangalore",
    description: "Replacement of 35 old sodium vapor bulbs with energy-efficient 40W LED units on Indiranagar 5th and 12th Cross roads, reducing power consumption by 45%.",
    relatedIssueId: "iss_002",
    receiptUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400",
    comments: []
  },
  {
    id: "tx_003",
    title: "Public Park Cleanliness Drive and Garbage Bin Installation",
    amount: 28000,
    date: "2026-06-27",
    category: "Sanitation",
    vendor: "Green Bengaluru Eco Services NGO",
    description: "Deployment of 4 local workers for complete cleanup of Corner Park debris, installation of 3 dry-wet segregated steel dustbins with concrete anchor bases.",
    relatedIssueId: "iss_003",
    receiptUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    comments: [
      { id: "lc_3", authorName: "Radha Deshpande", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", text: "Very good initiative. I noticed the bins are in place, but can we request a security camera to prevent midnight dumping?", timestamp: "2026-06-28 18:22" }
    ],
    isQuestioned: true
  }
];

export const MOCK_BUSINESSES: LocalBusiness[] = [
  {
    id: "biz_001",
    name: "Annapurna Homemade Caterers",
    ownerName: "Sudha Murthy & Seema Raj",
    category: "food",
    description: "Nutritious, authentic South Indian lunch box (tiffin) and dinner catering. Prepared fresh every morning using locally sourced organic spices. Specialty: Soft ragi mudde, holige, and traditional Karnataka thalis.",
    photoUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300",
    phoneNumber: "+91 98450 12345",
    whatsappNumber: "919845012345",
    location: "Koramangala 3rd Block, Bengaluru",
    rating: 4.9,
    products: [
      { id: "prod_001", name: "Daily Lunch Tiffin Box", price: 80, description: "Includes 3 Roti, Rice, Sambhar, Rasam, Palya (Veg Sabzi) and Buttermilk.", imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300" },
      { id: "prod_002", name: "Special Ragi Mudde Thali", price: 120, description: "Fresh steamed ragi mudde served with delicious traditional Karnataka bas saaru and chutney.", imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300" },
      { id: "prod_003", name: "Puran Poli / Holige (Set of 4)", price: 100, description: "Delicious, sweet flatbread stuffed with sweet lentil-jaggery paste. Made with pure ghee.", imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300" }
    ],
    reviews: [
      { id: "rev_001", userName: "Aditya Kumar", rating: 5, comment: "Incredibly delicious and tastes exactly like home food. Extremely light on the stomach!", date: "2026-06-25" },
      { id: "rev_002", userName: "Priyanka Naik", rating: 4, comment: "Very punctual with the delivery. Ragi mudde is extremely fresh and soft.", date: "2026-06-28" }
    ]
  },
  {
    id: "biz_002",
    name: "Mayura Designer Blouses & Embroidery",
    ownerName: "Kavitha Shridhar",
    category: "tailoring",
    description: "Expert bridal blouse tailoring, hand embroidery, aari works, and custom dress alterations. Over 15 years of experience creating bespoke attire for local festivals and weddings.",
    photoUrl: "https://images.unsplash.com/photo-1520004481444-1060956b910e?auto=format&fit=crop&q=80&w=300",
    phoneNumber: "+91 94481 98765",
    whatsappNumber: "919448198765",
    location: "Indiranagar 2nd Stage, Bengaluru",
    rating: 4.8,
    products: [
      { id: "prod_004", name: "Aari Work Bridal Blouse Stitching", price: 2500, description: "Premium bridal stitching with heavy hand embroidery, custom bead design and customized fit.", imageUrl: "https://images.unsplash.com/photo-1520004481444-1060956b910e?auto=format&fit=crop&q=80&w=300" },
      { id: "prod_005", name: "Designer Salwar Suit Stitching", price: 800, description: "Custom salwar suit or anarkali stitching with perfect fittings and neck linings.", imageUrl: "https://images.unsplash.com/photo-1520004481444-1060956b910e?auto=format&fit=crop&q=80&w=300" }
    ],
    reviews: [
      { id: "rev_003", userName: "Srinidhi Reddy", rating: 5, comment: "Kavitha did an exceptional job with my bridal blouse! The embroidery work is extremely neat.", date: "2026-06-12" }
    ]
  },
  {
    id: "biz_003",
    name: "Siri Handicrafts & Terracotta Dolls",
    ownerName: "Latha Manjunath (Nirmala SHG)",
    category: "crafts",
    description: "Eco-friendly handmade clay pottery, custom terracotta dolls, hand-painted lamps, and organic coconut shell products. 100% biodegradable and sourced from local artisans.",
    photoUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
    phoneNumber: "+91 80234 56789",
    location: "HSR Layout Sector 1, Bengaluru",
    rating: 4.7,
    products: [
      { id: "prod_006", name: "Hand-Painted Diya Set (Set of 6)", price: 150, description: "Beautiful organic clay diyas painted with traditional eco-friendly colors.", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300" },
      { id: "prod_007", name: "Terracotta Ganesha Idol", price: 450, description: "100% natural soluble clay Ganesha idol for festivals or home decor.", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300" }
    ],
    reviews: [
      { id: "rev_004", userName: "Rohan Gowda", rating: 4, comment: "Amazing quality pottery. Highly recommend the festive clay lamps!", date: "2026-06-20" }
    ]
  },
  {
    id: "biz_004",
    name: "Sharda Home Math & Science Academy",
    ownerName: "Prof. G. Shardadevi",
    category: "tutoring",
    description: "Personalized home tuitions and group classes for classes VI to XII (State, CBSE, and ICSE boards). Special emphasis on clearing core concepts, mathematics formulas, and exam preparations.",
    photoUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300",
    phoneNumber: "+91 98862 33445",
    location: "Jayanagar 4th T Block, Bengaluru",
    rating: 5.0,
    products: [
      { id: "prod_008", name: "Monthly Batch (Mathematics Class X)", price: 1200, description: "Daily 1-hour coaching batch with detailed tests and doubt clearance sessions.", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300" }
    ],
    reviews: [
      { id: "rev_005", userName: "Meera Hegde", rating: 5, comment: "Sharda Ma'am is excellent. My daughter scored 98% in CBSE mathematics under her expert mentorship!", date: "2026-06-22" }
    ]
  }
];

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "evt_001",
    title: "Sector 2 Park Cleanup & Segregation Drive",
    description: "Join hands this Saturday morning to clean our main children's park. We will pick up plastic debris, install the newly allocated BBMP waste bins, and plant 15 native flower saplings. Free refreshments will be provided by local businesses!",
    date: "2026-07-04",
    time: "07:30 AM - 10:30 AM",
    location: "HSR Layout Sector 2 Children's Park",
    organizer: "HSR Sector 2 Resident Welfare Association (RWA) & Green Bengaluru",
    attendeesCount: 24,
    userRsvpStatus: 'going',
    comments: [
      { id: "ec_1", authorName: "Seema Raj", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", text: "Annapurna Caterers will supply hot coffee and tea for all volunteers! Thank you!", timestamp: "2026-06-29 10:00" },
      { id: "ec_2", authorName: "Karthik Gowda", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", text: "I'm bringing my kids as well, great way to teach civic duty.", timestamp: "2026-06-29 14:15" }
    ]
  },
  {
    id: "evt_002",
    title: "Community Monsoon Health & Dengue Awareness Camp",
    description: "Monsoon is here and cases of viral fevers are rising. This camp offers free blood sugar, pressure checkups, and consultations with Dr. Vivek Anand. Learn practical methods to prevent water stagnation and mosquito breeding in your overhead tanks.",
    date: "2026-07-11",
    time: "09:00 AM - 01:00 PM",
    location: "Ward Community Center hall, Koramangala",
    organizer: "Koramangala Health Volunteers & Apollo Clinic Staff",
    attendeesCount: 45,
    userRsvpStatus: null,
    comments: []
  },
  {
    id: "evt_003",
    title: "Sammilana: Local Women-Led Business Fair",
    description: "An exhibition celebrating over 35 local home-run enterprises. Browse hand-made fabrics, delicious organic snack stalls, custom pottery, clothing designs, and live craft tutorial stalls.",
    date: "2026-07-19",
    time: "10:00 AM - 08:30 PM",
    location: "BDA Complex Open Grounds, Indiranagar",
    organizer: "Nirmala Self-Help Group (SHG) Guild & Civitas App",
    attendeesCount: 112,
    userRsvpStatus: 'interested',
    comments: []
  }
];

export const MOCK_ACHIEVEMENTS: AchievementPost[] = [
  {
    id: "ach_001",
    userName: "Girish A. (You)",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    title: "Pothole Resolved on 80 Feet Road!",
    description: "Extremely happy to share that the massive pothole near Koramangala 4th block which I reported 5 days ago on Civitas has been completely asphalt-sealed today! Big thanks to Sub-divisional Engineer Mr. K. Srinivasa and the BBMP repair crew for their rapid action. Let's keep our roads safe!",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400",
    likes: 34,
    timestamp: "2026-06-29 18:45",
    badgeId: "badge_resolved_3",
    comments: [
      { id: "ac_1", authorName: "Siddharth Rao", text: "Amazing job! This app actually gets things done.", timestamp: "2026-06-29 19:00" },
      { id: "ac_2", authorName: "Radha Deshpande", text: "Thank goodness! I almost crashed my scooter there last week. Hero indeed!", timestamp: "2026-06-29 19:40" }
    ]
  },
  {
    id: "ach_002",
    userName: "Nandini Kumar",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    title: "Indiranagar 5th Cross is Dark No More!",
    description: "BESCOM crews worked until midnight yesterday replacing all blacked-out sodium bulbs on our lane with bright new LEDs. We can now walk comfortably at night. Thank you for voting up our community ticket, everyone! Collective action wins.",
    imageUrl: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=400",
    likes: 56,
    timestamp: "2026-06-24 10:30",
    badgeId: "badge_reported_5",
    comments: []
  },
  {
    id: "ach_003",
    userName: "Latha Manjunath",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    title: "Siri Handicrafts reaches 100 orders milestone!",
    description: "With immense joy, we announce that our terracotta and eco-friendly handicrafts SHG business has completed over 100 direct home orders, with 60+ coming directly from supportive neighbors on Civitas. Your purchase enables 8 local women to earn a livelihood with dignity.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400",
    likes: 82,
    timestamp: "2026-06-20 12:15",
    badgeId: "badge_local_buy",
    comments: [
      { id: "ac_3", authorName: "Kavitha Shridhar", text: "So proud of you Latha! Your clay lamps are stunning.", timestamp: "2026-06-20 14:00" }
    ]
  }
];

export const MOCK_POLLS: VotingPoll[] = [
  {
    id: "pol_001",
    title: "Allocation of Ward 151 Surplus Budget (₹2,50,000)",
    description: "Our ward has a surplus development fund of ₹2.5 Lakhs. BBMP has proposed three projects. Cast your vote to decide where these public funds should be directed directly by July 15, 2026.",
    options: [
      { id: "opt_1", text: "Solar-powered lights for HSR Children's park and jogging path", votes: 48 },
      { id: "opt_2", text: "Digital CCTV cameras at 5 critical intersections for women security", votes: 82 },
      { id: "opt_3", text: "Segregated composting bins and leaf-composters for Sector 2 residences", votes: 23 }
    ],
    deadline: "2026-07-15",
    isActive: true,
    totalVotes: 153,
    userVotedOptionId: "opt_2"
  },
  {
    id: "pol_002",
    title: "Speed Breaker Construction near HSR DAV School gate",
    description: "Parents have requested three high-quality rubberized speed bumps outside the primary school entrance to slow down commercial logistics trucks during school delivery hours.",
    options: [
      { id: "opt_a", text: "Yes, approve speed bumps immediately", votes: 110 },
      { id: "opt_b", text: "No, use speed warning signs instead", votes: 14 }
    ],
    deadline: "2026-07-05",
    isActive: true,
    totalVotes: 124,
    userVotedOptionId: undefined
  },
  {
    id: "pol_003",
    title: "Renovation of Community Library Hall",
    description: "Ward budget allocation for digital e-book readers and air conditioning inside the neighborhood library.",
    options: [
      { id: "opt_x", text: "Approve ₹1.8L Renovations", votes: 94 },
      { id: "opt_y", text: "Reject / Postpone to next financial year", votes: 18 }
    ],
    deadline: "2026-06-15",
    isActive: false,
    totalVotes: 112,
    userVotedOptionId: "opt_x"
  }
];

export const MOCK_NEWS_DIGEST = {
  date: "Sunday, June 28, 2026",
  volume: "Vol. 4 // Issue 26",
  headline: "THE ROAD TOWARDS TRANSIT SAFETY: BBMP & COMMUNITY REPAIR ACTIVE ROADS",
  editorNote: "This week saw unprecedented civic coordination as over 3 critical major works were resolved, backed by absolute budget ledger audits from our local residents. Local handcrafts and home bakeries saw a record 40% rise in sales through our community business portal.",
  solvedThisWeekCount: 3,
  resolvedIssuesList: [
    { title: "Indiranagar 5th Cross Streetlights", date: "June 23", details: "All 4 streetlights resolved by BESCOM." },
    { title: "Sewer Line De-clogging", date: "June 25", details: "Main drain cleaned on 12th Main, Ward 151." },
    { title: "Park Boundary Wall Repairs", date: "June 27", details: "Masonry rebuilt, protecting play area from vehicles." }
  ],
  ledgerSummary: "Total public spent logged: ₹2,28,000 across road patching, electrical replacement and park bins. Resident audits flagged 1 item, which municipal engineer clarified in the public feed, maintaining absolute transparency.",
  featuredBusiness: {
    name: "Annapurna Homemade Caterers",
    owner: "Sudha Murthy & Seema Raj",
    impact: "Supplied nutritious, hygienic meals to 85 senior citizens and provided complimentary breakfasts to 24 park-cleanup volunteers this week."
  },
  upcomingEvent: {
    title: "Sector 2 Park Cleanup & Segregation Drive",
    date: "July 4 (Saturday), 07:30 AM",
    description: "A major volunteer-driven sanitation push to install segregated steel garbage bins."
  }
};

export const DEFAULT_PROFILE: UserProfile = {
  name: "Girish A.",
  email: "girishajuluru@gmail.com",
  points: 420,
  level: 4,
  language: "en",
  voiceAccessEnabled: false,
  badges: ["badge_reported_5", "badge_resolved_3"],
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
};
