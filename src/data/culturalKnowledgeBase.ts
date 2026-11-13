import type {
  BusinessScenario,
  CountryProfileSummary,
  CulturalKnowledgeEntry,
  DemoScenarioPreset,
  TargetCountry,
} from '../types/culturebridge.ts';

export const SCENARIO_OPTIONS: {
  value: BusinessScenario;
  label: string;
  description: string;
}[] = [
  {
    value: 'first_contact',
    label: 'First-Contact Email',
    description: 'Initial outreach introducing your company and exploring partnership.',
  },
  {
    value: 'product_intro',
    label: 'Product Introduction',
    description: 'Presenting product specs, certifications (Halal/ISO), and export capacity.',
  },
  {
    value: 'quotation',
    label: 'Quotation & Terms',
    description: 'Sharing FOB/CIF pricing, MOQ, payment terms, and sample availability.',
  },
  {
    value: 'follow_up',
    label: 'Follow-Up Reminder',
    description: 'Checking in respectfully after sending a proposal or quotation.',
  },
  {
    value: 'meeting_request',
    label: 'Meeting Scheduling',
    description: 'Proposing an online video call or in-person trade visit.',
  },
  {
    value: 'negotiation',
    label: 'Price & Volume Negotiation',
    description: 'Discussing MOQ flexibility, unit pricing, and long-term supply terms.',
  },
  {
    value: 'decline_offer',
    label: 'Declining / Counter-Offer',
    description: 'Turning down unfavorable terms gracefully while preserving goodwill.',
  },
];

export const COUNTRY_SUMMARIES: Record<TargetCountry, CountryProfileSummary> = {
  UAE: {
    country: 'UAE',
    officialName: 'United Arab Emirates (Dubai & Abu Dhabi)',
    commercialHubs: ['Dubai (Jebel Ali / DMCC)', 'Abu Dhabi', 'Sharjah'],
    workWeek: 'Monday – Friday (Friday afternoon prayer break ~12:00–14:30 GST)',
    decisionStyle: 'Consultative and hierarchical; senior directors often validate strategic fit after initial commercial screening.',
    relationshipPriority: 'Warmth, mutual respect, and long-term partnership framing precede aggressive pricing talk.',
    keyEtiquettePoints: [
      'Open with courteous personal goodwill before presenting commercial asks.',
      'Highlight international readiness: Halal/ISO/HACCP certifications and reliable logistics.',
      'Frame timelines collaboratively rather than demanding urgent replies.',
      'Avoid abrupt refusal; pair constraints with constructive alternatives.',
    ],
    sources: [
      'UAE Ministry of Economy — Commercial Etiquette & Trade Protocol (2025)',
      'Dubai Chamber of Commerce — Cross-Border SME Onboarding Guide',
      'GCC Business Culture & Arabic Pragmatics Review',
    ],
    lastUpdated: '2026-11-10',
  },
  Qatar: {
    country: 'Qatar',
    officialName: 'State of Qatar (Doha)',
    commercialHubs: ['Doha', 'Hamad Port', 'Lusail'],
    workWeek: 'Sunday – Thursday (Friday–Saturday weekend)',
    decisionStyle: 'Relationship-anchored and deliberate; trust and credibility of leadership carry decisive weight.',
    relationshipPriority: 'Dignity, patience, and personal rapport are foundational; transactional pressure can stall momentum.',
    keyEtiquettePoints: [
      'Respect the Sunday–Thursday business calendar when proposing deadlines or calls.',
      'Maintain formal titles and unhurried, respectful tone in early correspondence.',
      'Demonstrate steady reliability, traceability, and commitment to long-term cooperation.',
      'Give partners space to consult internally without pressuring for immediate sign-off.',
    ],
    sources: [
      'Qatar Chamber — International Trade & Partner Engagement Protocol',
      'Invest Qatar — Business Culture & Executive Communication Reference',
      'GCC Business Culture & Arabic Pragmatics Review',
    ],
    lastUpdated: '2026-11-10',
  },
};

const UAE_ARABIC_PHRASES = [
  {
    arabic: 'السلام عليكم ورحمة الله وبركاته',
    transliteration: 'As-salamu alaykum wa rahmatullahi wa barakatuh',
    englishMeaning: 'Peace and blessings be upon you',
    whenToUse: 'Optional warm respectful opening when addressing a Muslim business leader you have rapport with.',
  },
  {
    arabic: 'نتطلع إلى تعاون مثمر ومستدام',
    transliteration: 'Natatalla‘ ila ta‘awun muthmir wa mustadam',
    englishMeaning: 'We look forward to a fruitful and sustainable partnership',
    whenToUse: 'Ideal closing sentiment emphasizing long-term mutual benefit.',
  },
];

const QATAR_ARABIC_PHRASES = [
  {
    arabic: 'مع خالص التحية والتقدير',
    transliteration: 'Ma‘a khalis al-tahiyya wa al-taqdir',
    englishMeaning: 'With sincere greetings and appreciation',
    whenToUse: 'Formal, dignified closing phrase suited for senior Qatari executives.',
  },
  {
    arabic: 'نتمنى لكم دوام التوفيق والنجاح',
    transliteration: 'Natamanna lakum dawam al-tawfiq wa al-najah',
    englishMeaning: 'We wish you continued success and prosperity',
    whenToUse: 'Courteous opening or closing goodwill wish.',
  },
];

const BASE_NUANCE_NOTE =
  'Guidance reflects common Gulf commercial norms across multicultural teams in the UAE and Qatar. Individual partners vary by company culture, nationality, and personal style—treat these insights as contextual preparation rather than rigid rules.';

export const CULTURAL_KNOWLEDGE_BASE: CulturalKnowledgeEntry[] = [
  // UAE Entries
  {
    id: 'uae-first-contact',
    country: 'UAE',
    scenario: 'first_contact',
    scenarioLabel: 'First-Contact Email',
    communicationStyle: [
      'Warm, polished, and formally respectful',
      'Indirect transition from rapport to commercial request',
      'High-context appreciation of the partner’s market standing',
    ],
    relationshipNorms: [
      'Establish credibility and genuine interest in mutual growth before asking for price or order commitments.',
      'Mentioning readiness for quality standards (e.g., ISO, HACCP, Halal) builds instant reassurance.',
    ],
    recommendations: [
      'Begin with a respectful salutation and warm greeting ("I hope this message finds you well").',
      'Acknowledge the partner’s esteemed presence in the UAE market.',
      'Present a concise introduction of your Vietnamese manufacturing strength and invite an exploratory conversation.',
    ],
    thingsToAvoid: [
      'Demanding immediate pricing feedback or order quantities in the very first message.',
      'Overly abrupt Vietnamese-to-English literal phrasing ("Mong nhận được phản hồi sớm về giá cả").',
      'Generic mass-email tone that feels transactional rather than partnership-oriented.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'Dubai Chamber Cross-Border Trade Etiquette (2025)',
      'CultureBridge Arabic-Vietnamese Business Corpus',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-product-intro',
    country: 'UAE',
    scenario: 'product_intro',
    scenarioLabel: 'Product Introduction',
    communicationStyle: [
      'Confident yet humble and solution-focused',
      'Clear structure highlighting quality assurance and supply consistency',
    ],
    relationshipNorms: [
      'UAE importers evaluate both product quality and supplier reliability for re-export or retail distribution.',
      'Offering product samples or a digital catalog shows seriousness without pressure.',
    ],
    recommendations: [
      'Highlight export readiness: certifications, packaging standards, and consistent origin supply.',
      'Connect your product benefits to UAE consumer or hospitality demand.',
      'Offer to share a specification sheet or arrange sample dispatch at their convenience.',
    ],
    thingsToAvoid: [
      'Exaggerated superlatives ("best in the world", "cheapest price") without verifiable standards.',
      'Sending dense technical blocks without explaining commercial relevance.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'UAE Ministry of Economy Trade Guide',
      'Gulf Food & Beverage Import Protocol Review',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-quotation',
    country: 'UAE',
    scenario: 'quotation',
    scenarioLabel: 'Quotation & Terms',
    communicationStyle: [
      'Transparent, structured, and accommodating',
      'Framing terms as a starting point for constructive alignment',
    ],
    relationshipNorms: [
      'In UAE commerce, an initial quotation is often seen as the opening frame for dialogue rather than a rigid take-it-or-leave-it ultimatum.',
      'Clarity on Incoterms (FOB Ho Chi Minh / CIF Jebel Ali) signals export maturity.',
    ],
    recommendations: [
      'Present FOB/CIF pricing, MOQ, and lead time in clean, scannable terms.',
      'Express openness to discussing volume tiers or trial shipment options.',
      'Invite questions gently without imposing tight 24-hour expiry threats unless genuinely required.',
    ],
    thingsToAvoid: [
      'Rigid ultimatums ("Price valid only today, confirm immediately").',
      'Hidden surcharges or ambiguous port/Incoterms specifications.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'Dubai Jebel Ali Logistics & Import Desk Guidelines',
      'GCC B2B Commercial Negotiation Review',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-follow-up',
    country: 'UAE',
    scenario: 'follow_up',
    scenarioLabel: 'Follow-Up Reminder',
    communicationStyle: [
      'Patient, gracious, and face-saving',
      'Assumes positive intent and busy executive schedules',
    ],
    relationshipNorms: [
      'Silence in GCC business rarely means outright rejection; internal approvals and multi-stakeholder reviews take time.',
      'A gentle check-in offering extra value (e.g., updated catalog or sample availability) preserves dignity.',
    ],
    recommendations: [
      'Express polite understanding of their busy schedule.',
      'Briefly reference the previous email and offer additional helpful information.',
      'Keep the call-to-action soft and respectful.',
    ],
    thingsToAvoid: [
      'Accusatory reminders ("Why haven’t you replied yet?" / "Following up again urgently").',
      'Sending reminders on Friday afternoon during prayer hours.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'UAE Commercial Correspondence Best Practices',
      'CultureBridge Arabic-Vietnamese Business Corpus',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-meeting-request',
    country: 'UAE',
    scenario: 'meeting_request',
    scenarioLabel: 'Meeting Scheduling',
    communicationStyle: [
      'Deferential to the partner’s calendar and timezone (GST / UTC+4)',
      'Clear purpose statement without sounding pushy',
    ],
    relationshipNorms: [
      'Face-to-face or video meetings are highly valued in UAE business to build personal trust.',
      'Proposing 2–3 flexible windows in Gulf Standard Time (GST) demonstrates consideration.',
    ],
    recommendations: [
      'Propose a brief 20–30 minute introductory call with clear agenda points.',
      'Offer multiple time slots converted into UAE local time (GST).',
      'Leave room for them to suggest a more convenient alternative.',
    ],
    thingsToAvoid: [
      'Sending a bare calendar link with no personal context ("Book a slot on my Calendly").',
      'Scheduling conflicts with Friday midday prayer hours.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'Dubai Chamber Executive Protocol Guide',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-negotiation',
    country: 'UAE',
    scenario: 'negotiation',
    scenarioLabel: 'Price & Volume Negotiation',
    communicationStyle: [
      'Collaborative, dignified, and win-win oriented',
      'Balances firmness on quality costs with creative commercial flexibility',
    ],
    relationshipNorms: [
      'UAE buyers often test supplier flexibility on price or MOQ to gauge long-term commitment.',
      'Concessions should be linked clearly to volume, payment terms, or multi-shipment commitment.',
    ],
    recommendations: [
      'Acknowledge their target price respectfully before explaining cost drivers (raw material, certification, logistics).',
      'Offer conditional alternatives: e.g., tiered pricing at higher volume or a smaller trial shipment.',
      'Keep the tone calm and relationship-preserving at every turn.',
    ],
    thingsToAvoid: [
      'Blunt rejections ("Impossible, our price is final").',
      'Emotional defensiveness or cutting corners on quality without clarity.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'GCC Cross-Cultural Negotiation Handbook',
      'CultureBridge Arabic-Vietnamese Business Corpus',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'uae-decline-offer',
    country: 'UAE',
    scenario: 'decline_offer',
    scenarioLabel: 'Declining / Counter-Offer',
    communicationStyle: [
      'Indirect, appreciative, and future-facing ("preserving the bridge")',
      'Softens "no" by thanking the partner and proposing future alignment',
    ],
    relationshipNorms: [
      'Saying a flat "no" can feel needlessly harsh in high-context Gulf business.',
      'Expressing gratitude for the proposal while citing specific operational limits maintains mutual respect.',
    ],
    recommendations: [
      'Thank the partner sincerely for their time and interest.',
      'Explain clearly why the current terms/timeline cannot be accommodated right now.',
      'Propose a realistic counter-option or keep the door open for future batches.',
    ],
    thingsToAvoid: [
      'Abrupt rejection ("We cannot accept this offer").',
      'Blaming the partner’s pricing or expectations.',
    ],
    arabicCourtesyPhrases: UAE_ARABIC_PHRASES,
    sources: [
      'UAE Business Diplomacy & Communication Guide',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },

  // Qatar Entries
  {
    id: 'qatar-first-contact',
    country: 'Qatar',
    scenario: 'first_contact',
    scenarioLabel: 'First-Contact Email',
    communicationStyle: [
      'Dignified, unhurried, and formal',
      'Prioritizes trust, institutional credibility, and respectful address',
    ],
    relationshipNorms: [
      'Qatari business culture places strong emphasis on personal trust and reputational standing.',
      'Rushing straight to prices or urgent timelines in a first email can feel disrespectful.',
    ],
    recommendations: [
      'Use formal salutations and respectful corporate framing.',
      'Introduce your company’s track record, export experience, and commitment to quality.',
      'Express genuine interest in building a lasting, mutually beneficial relationship.',
    ],
    thingsToAvoid: [
      'Pushy sales urgency or asking for immediate commercial commitment on first contact.',
      'Overly casual slang or abrupt one-line messages.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Qatar Chamber Commercial Engagement Briefing',
      'Invest Qatar Executive Etiquette Guide',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-product-intro',
    country: 'Qatar',
    scenario: 'product_intro',
    scenarioLabel: 'Product Introduction',
    communicationStyle: [
      'Measured, factual, and quality-centric',
      'Respectful tone emphasizing reliability and standards compliance',
    ],
    relationshipNorms: [
      'Qatari distributors value premium consistency, clear food/product compliance (Halal, origin traceability), and dependable fulfillment.',
    ],
    recommendations: [
      'Highlight compliance certifications, origin authenticity from Vietnam, and supply stability.',
      'Offer to send curated product samples or documentation upon their interest.',
    ],
    thingsToAvoid: [
      'Aggressive promotional hype or unsolicited bulk attachments without context.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Qatar Chamber Import & Distribution Briefing',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-quotation',
    country: 'Qatar',
    scenario: 'quotation',
    scenarioLabel: 'Quotation & Terms',
    communicationStyle: [
      'Formal, clear, and respectful of deliberation time',
      'Presents terms transparently with polite flexibility',
    ],
    relationshipNorms: [
      'Decision cycles in Doha often involve senior leadership alignment; patience signals confidence and respect.',
    ],
    recommendations: [
      'Provide clear pricing breakdowns (FOB/CIF Hamad Port), MOQ, and production lead times.',
      'Offer to clarify specifications or adjust trial quantities to support initial market testing.',
    ],
    thingsToAvoid: [
      'Imposing short confirmation deadlines or pressuring for immediate deposits.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Hamad Port Trade & Logistics Reference',
      'Qatar Chamber Commercial Protocol',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-follow-up',
    country: 'Qatar',
    scenario: 'follow_up',
    scenarioLabel: 'Follow-Up Reminder',
    communicationStyle: [
      'Very polite, patient, and non-intrusive',
      'Frames follow-up as offering support rather than chasing',
    ],
    relationshipNorms: [
      'Remember Qatar operates on a Sunday–Thursday workweek (Friday–Saturday weekend).',
      'Respectful spacing between follow-ups preserves executive dignity.',
    ],
    recommendations: [
      'Send follow-ups early in the Qatari workweek (Sunday–Tuesday morning AST).',
      'Ask kindly if any additional technical or sample information would assist their internal review.',
    ],
    thingsToAvoid: [
      'Sending impatient reminders on Friday/Saturday or using demanding phrasing.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Invest Qatar — Business Calendar & Correspondence Guide',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-meeting-request',
    country: 'Qatar',
    scenario: 'meeting_request',
    scenarioLabel: 'Meeting Scheduling',
    communicationStyle: [
      'Formal, considerate of Doha local time (AST / UTC+3) and Sunday–Thursday schedule',
    ],
    relationshipNorms: [
      'Personal rapport precedes substantive deal-making; introductory meetings often focus on trust and mutual understanding.',
    ],
    recommendations: [
      'Suggest Sunday–Thursday time slots in Arabia Standard Time (AST).',
      'Indicate respect for senior decision-makers’ availability.',
    ],
    thingsToAvoid: [
      'Proposing Friday or Saturday meetings, or rushing agenda demands.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Qatar Chamber Executive Engagement Guidelines',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-negotiation',
    country: 'Qatar',
    scenario: 'negotiation',
    scenarioLabel: 'Price & Volume Negotiation',
    communicationStyle: [
      'Steady, dignified, and relationship-first',
      'Avoids confrontational bargaining; emphasizes long-term value',
    ],
    relationshipNorms: [
      'Qatari partners value honor, consistency, and transparent commitments over fast short-term discounts.',
    ],
    recommendations: [
      'Validate the partner’s commercial goals before outlining cost realities.',
      'Offer structured options (e.g., pilot batch vs. annual contract pricing).',
    ],
    thingsToAvoid: [
      'Hardline ultimatums or sudden last-minute price revisions after verbal alignment.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'GCC Cross-Cultural Negotiation Handbook',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
  {
    id: 'qatar-decline-offer',
    country: 'Qatar',
    scenario: 'decline_offer',
    scenarioLabel: 'Declining / Counter-Offer',
    communicationStyle: [
      'Courteous, indirect, and appreciative of the relationship',
    ],
    relationshipNorms: [
      'Preserving face ("karama") and goodwill ensures future collaboration remains possible even when current terms do not align.',
    ],
    recommendations: [
      'Begin with sincere gratitude for their time and proposal.',
      'Explain operational constraints gently and suggest a constructive middle path.',
    ],
    thingsToAvoid: [
      'Direct, blunt refusals without gratitude or alternative suggestion.',
    ],
    arabicCourtesyPhrases: QATAR_ARABIC_PHRASES,
    sources: [
      'Arabic Pragmatics & GCC Business Protocol Review',
    ],
    lastUpdated: '2026-11-10',
    verifiedBy: 'Arabic Language & GCC Business Culture Reviewer',
    nuanceNote: BASE_NUANCE_NOTE,
  },
];

export const DEMO_SCENARIO_PRESETS: DemoScenarioPreset[] = [
  {
    id: 'preset-uae-coffee-first',
    title: 'Coffee Export Outreach to UAE (Hackathon Hero Demo)',
    shortLabel: 'UAE · First Contact (Coffee)',
    targetCountry: 'UAE',
    scenario: 'first_contact',
    yourRole: 'Sales Manager',
    partnerRole: 'Importer',
    companyName: 'ABC Vietnam Coffee Co.',
    productFocus: 'Specialty Arabica & Robusta Roasted Coffee (Halal & ISO 22000 certified)',
    partnerName: 'Mr. Tariq Al-Mansoori',
    vietnameseDraft:
      'Xin chào, chúng tôi là công ty ABC tại Việt Nam. Chúng tôi chuyên sản xuất cà phê và muốn hợp tác với công ty của bạn. Mong nhận được phản hồi sớm về giá cả và số lượng nhập hàng.',
    simulatorOpeningHint:
      'Thank you for reaching out to Gulf Horizon Imports in Dubai. We receive many offers from coffee suppliers across Asia. Why should we consider ABC Vietnam Coffee for our UAE hospitality clients, and what is your minimum order quantity?',
  },
  {
    id: 'preset-qatar-quotation',
    title: 'Cashew & Dried Fruit Quotation to Qatar',
    shortLabel: 'Qatar · Quotation (Agri)',
    targetCountry: 'Qatar',
    scenario: 'quotation',
    yourRole: 'Exporter',
    partnerRole: 'Distributor',
    companyName: 'Mekong Harvest Exports',
    productFocus: 'Premium Grade W240 Cashew Kernels & Dried Mango (Halal certified)',
    partnerName: 'Mr. Khalifa Al-Thani',
    vietnameseDraft:
      'Chào anh, gửi anh bảng báo giá hạt điều W240 giao hàng cảng Doha. Giá FOB là 6.800 USD/tấn, đơn hàng tối thiểu 1 container 20ft. Báo giá chỉ có hiệu lực trong 3 ngày nên anh xác nhận gấp giúp bên em nhé.',
    simulatorOpeningHint:
      'Thank you for sending the quotation to Doha Food Distribution. Our procurement committee needs about two weeks to review samples and freight schedules to Hamad Port. Also, 1 full 20ft container is high for an initial trial—can you start with a smaller mixed pallet?',
  },
  {
    id: 'preset-uae-followup',
    title: 'Polite Follow-Up on Sent Sample & Catalog (UAE)',
    shortLabel: 'UAE · Follow-Up',
    targetCountry: 'UAE',
    scenario: 'follow_up',
    yourRole: 'Sales Manager',
    partnerRole: 'Import Manager',
    companyName: 'Saigon Spice & Tea JSC',
    productFocus: 'Organic Cassia Cinnamon & Star Anise',
    partnerName: 'Ms. Nadia Al-Hashimi',
    vietnameseDraft:
      'Chào chị, tuần trước bên em đã gửi mẫu quế hồi và báo giá nhưng chưa thấy chị trả lời. Chị xem xong chưa, cho em biết quyết định sớm để bên em còn giữ hàng trong kho.',
    simulatorOpeningHint:
      'Apologies for the delay—our quality team in Jebel Ali only finished inspecting your spice samples yesterday. The aroma is strong, though our retail buyers are comparing pricing with two existing suppliers.',
  },
  {
    id: 'preset-qatar-negotiation',
    title: 'Price & Payment Terms Negotiation (Qatar)',
    shortLabel: 'Qatar · Negotiation',
    targetCountry: 'Qatar',
    scenario: 'negotiation',
    yourRole: 'Business Owner',
    partnerRole: 'Business Partner',
    companyName: 'Highland Arabica Vietnam',
    productFocus: 'Single-Origin Da Lat Arabica Beans',
    partnerName: 'Mr. Hamad Al-Sulaiti',
    vietnameseDraft:
      'Bên tôi không thể giảm giá xuống mức anh yêu cầu được vì chi phí vận chuyển rất cao. Nếu anh muốn giá tốt hơn thì phải đặt tối thiểu 5 tấn và thanh toán trước 50% bằng T/T.',
    simulatorOpeningHint:
      'We appreciate the quality of your Da Lat Arabica, however your unit price is roughly 12% above our target budget for Doha café chains, and 50% advance payment is tough for a first shipment. What flexibility can we find together?',
  },
  {
    id: 'preset-uae-decline',
    title: 'Gracefully Declining Low-Margin Offer (UAE)',
    shortLabel: 'UAE · Decline / Counter',
    targetCountry: 'UAE',
    scenario: 'decline_offer',
    yourRole: 'Business Owner',
    partnerRole: 'Distributor',
    companyName: 'Lotus Rice & Grain Export',
    productFocus: 'ST25 Fragrant Jasmine Rice (5kg Retail Bags)',
    partnerName: 'Mr. Rashid Al-Maktoum',
    vietnameseDraft:
      'Cảm ơn anh đã đề xuất nhưng mức giá 620 USD/tấn thì bên tôi không thể làm được, lỗ vốn mất. Anh nâng giá lên hoặc đổi sang loại gạo khác nhé.',
    simulatorOpeningHint:
      'We understand rice export margins are tight, though our supermarket partners in Abu Dhabi are looking for a competitive retail price point. Is there another packaging format or grade you could propose so we can still work together?',
  },
  {
    id: 'preset-qatar-meeting',
    title: 'Scheduling Executive Intro Call (Qatar)',
    shortLabel: 'Qatar · Meeting Request',
    targetCountry: 'Qatar',
    scenario: 'meeting_request',
    yourRole: 'Sales Manager',
    partnerRole: 'Import Manager',
    companyName: 'VietCraft Eco Packaging',
    productFocus: 'Biodegradable Sugarcane Food Containers',
    partnerName: 'Mr. Faisal Al-Kuwari',
    vietnameseDraft:
      'Chào anh, thứ Sáu tuần này bên em rảnh lúc 2h chiều giờ Việt Nam, anh vào họp online 30 phút để trao đổi hợp đồng cung cấp hộp bã mía nhé.',
    simulatorOpeningHint:
      'Thank you for your interest in supplying sustainable packaging in Doha. Please note our weekend is Friday–Saturday. Could we arrange a short introductory discussion early next week instead?',
  },
];
