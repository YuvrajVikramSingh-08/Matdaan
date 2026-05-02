import { logger } from '../utils/logger';

const SYSTEM_PROMPT = `You are Matdaan, a friendly, neutral, factual assistant helping Indian citizens understand the election process. You are knowledgeable about:
- Voter registration and EPIC cards
- Election Commission of India (ECI) rules
- The 8 phases of Indian general elections
- Electronic Voting Machines (EVMs) and VVPAT
- Polling booth procedures
- Model Code of Conduct
- Democratic processes in India

Rules:
1. Only answer questions related to elections, voter registration, ECI rules, and democratic processes in India.
2. Keep answers under 150 words. Be simple, clear, and factual.
3. If asked about something unrelated to elections, politely redirect.
4. Never express political opinions or party preferences.
5. Cite official sources like eci.gov.in when relevant.`;

/**
 * AI service for open-ended questions using standard Gemini API.
 * Uses Gemini 1.5 Flash for cost efficiency and speed.
 */
export async function generateResponse(message: string, language: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY not configured, using fallback');
      return getFallbackResponse(message);
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const langInstruction = language !== 'en' ? ` Respond in ${getLanguageName(language)}.` : '';

    const result = await model.generateContent(`${SYSTEM_PROMPT}${langInstruction}\n\nUser question: ${message}`);
    const text = result.response.text();
    return text || getFallbackResponse(message);
  } catch (err) {
    logger.error('Gemini API error', { error: (err as Error).message });
    return getFallbackResponse(message);
  }
}

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi', ta: 'Tamil',
    gu: 'Gujarati', pa: 'Punjabi', kn: 'Kannada', ml: 'Malayalam', or: 'Odia',
  };
  return names[code] || 'English';
}

/** Scored fallback responses — uses keyword scoring for best match */
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  const entries = [
    { keys: ['different city', 'another city', 'another state', 'vote from', 'can i vote', 'migrant', 'shifted', 'moved'], boost: ['delhi', 'lucknow', 'mumbai', 'registered voter', 'home state'], anti: [] as string[], score: 10,
      resp: 'If you are registered in one constituency (e.g., Lucknow) but live in another city (e.g., Delhi), you have two options:\n\n1. **Travel to your registered constituency** on polling day to vote at your assigned booth.\n2. **Transfer your voter registration** to your current city by filing Form 6 at voters.eci.gov.in with new address proof. Processing takes 2-4 weeks.\n\nIndia does NOT currently allow remote/proxy voting for general citizens. Postal ballots are only for armed forces, election duty staff, disabled persons, and seniors 80+. To transfer registration, visit: https://voters.eci.gov.in' },
    { keys: ['register', 'enrollment', 'enroll', 'new voter'], boost: [], anti: ['status', 'check', 'different city', 'from delhi', 'from mumbai'], score: 8,
      resp: 'To register as a voter in India:\n\n1. **Eligibility**: 18+ years on Jan 1 of current year, Indian citizen\n2. **Online**: Visit voters.eci.gov.in → Fill Form 6\n3. **Documents**: Age proof (birth cert/school leaving cert/passport) + Address proof (Aadhaar/utility bill/ration card) + Photo\n4. **Offline**: Visit nearest BLO or Tehsil office\n5. **Processing**: 2-4 weeks → Receive EPIC (Voter ID)\n\nYou can also use the Voter Helpline app on Android/iOS.' },
    { keys: ['voter id', 'epic', 'voter card', 'lost voter', 'duplicate'], boost: [], anti: [], score: 7,
      resp: 'Your EPIC (Voter ID) info:\n\n• **Apply**: Form 6 at voters.eci.gov.in\n• **Lost/Damaged**: Apply for duplicate via Form 002\n• **Correction**: Use Form 8 for name/address/photo changes\n• **Download e-EPIC**: Available digitally at voters.eci.gov.in\n• **Check status**: electoralsearch.eci.gov.in\n\nYour EPIC number is a 10-character alphanumeric code (e.g., ABC1234567).' },
    { keys: ['how to vote', 'voting process', 'step by step', 'how does voting'], boost: [], anti: [], score: 7,
      resp: 'Voting in India — Step by Step:\n\n1. 🏫 Go to your assigned polling booth (7 AM–6 PM)\n2. 🪪 Show voter ID or approved photo ID\n3. ✋ Get indelible ink on left index finger\n4. 🗳️ Enter voting compartment\n5. 👆 Press button next to your candidate on EVM\n6. 🖨️ Verify on VVPAT slip (7 seconds)\n7. 🚶 Exit\n\nApproved IDs: Aadhaar, Passport, DL, PAN + 8 others. Polling day is a paid holiday.' },
    { keys: ['evm', 'electronic voting', 'vvpat', 'tampering'], boost: ['machine'], anti: [], score: 7,
      resp: 'The EVM has two units:\n\n• **Ballot Unit**: Shows candidates with blue vote buttons\n• **Control Unit**: Operated by polling officer\n\nPress button → beep → red light → VVPAT prints slip visible 7 seconds. EVMs are standalone (no internet), made by BEL/ECIL. VVPAT slips of 5 random booths per constituency are cross-verified.' },
    { keys: ['timeline', 'schedule', 'phases', 'when is election', 'election date'], boost: ['process'], anti: [], score: 5,
      resp: 'Indian elections follow 8 phases:\n\n1. 📢 Election Announcement\n2. 📜 Model Code of Conduct\n3. 📋 Voter Registration deadline\n4. 📄 Nomination Filing\n5. 📣 Campaign Period (stops 48hrs before polling)\n6. 🗳️ Polling Day\n7. 📊 Vote Counting\n8. 🏆 Result Declaration\n\nProcess takes 2-3 months from announcement to results.' },
    { keys: ['first time', 'first-time', 'just turned 18', 'young voter'], boost: ['new'], anti: [], score: 8,
      resp: 'Welcome, first-time voter! 🎉\n\n1. ✅ Must be 18+ on Jan 1 of current year\n2. 📝 Register: Form 6 at voters.eci.gov.in\n3. 📄 Need: Age proof + Address proof + Photo\n4. 🪪 Get EPIC card (2-4 weeks)\n5. 📍 Find booth: electoralsearch.eci.gov.in\n6. 🎒 Carry voter ID, no phones inside booth\n\nTip: Check the "First Voter" tab for a guided walkthrough!' },
    { keys: ['helpline', 'contact', 'complaint', 'grievance'], boost: [], anti: [], score: 5,
      resp: 'Election contacts:\n\n📞 National Voter Helpline: 1950 (toll-free, 8AM-8PM)\n✉️ ECI Complaints: complaints@eci.gov.in\n🌐 NVSP: voters.eci.gov.in\n📱 Voter Helpline App: Android & iOS\n🌐 SVEEP: sveep.eci.gov.in\n\nReport violations via cVIGIL app with photo/video.' },
    { keys: ['winner', 'counting', 'result', 'majority', 'how is winner'], boost: [], anti: [], score: 5,
      resp: 'India uses **First Past The Post**: candidate with most votes wins (no minimum %). For Lok Sabha, 272/543 seats = majority. Counting at designated centers, EVMs opened round-by-round with agents present. VVPAT of 5 random booths per constituency verified. Results live at results.eci.gov.in.' },
    { keys: ['nota', 'none of the above', 'reject all'], boost: [], anti: [], score: 9,
      resp: 'NOTA (None Of The Above) — available since 2013:\n\n• Last button on EVM ballot\n• Means you reject all candidates\n• Even if NOTA gets most votes, the candidate with highest votes among contestants wins\n• It\'s a form of protest signaling voter dissatisfaction\n\nIntroduced via PUCL vs Union of India Supreme Court case.' },
    { keys: ['postal', 'postal ballot', 'absentee', 'service voter'], boost: [], anti: [], score: 9,
      resp: 'Postal ballots available for:\n\n1. Armed forces & paramilitary\n2. Government staff on election duty\n3. Persons with disabilities\n4. Senior citizens (80+)\n\n❌ NOT available for general citizens, NRIs, or migrant workers. You must travel to your registered constituency.' },
    { keys: ['model code', 'code of conduct', 'campaign rule'], boost: [], anti: [], score: 7,
      resp: 'Model Code of Conduct activates after election announcement:\n\n🚫 Cannot: Announce new schemes, use govt vehicles for campaigns, appeal to caste/religion\n✅ Can: Hold rallies (with permission), advertise within limits\n💰 Limits: ₹95L per Lok Sabha seat, ₹40L per Assembly seat\n⏰ Campaign stops 48hrs before polling\n📱 Report violations via cVIGIL app' },
    { keys: ['polling', 'booth', 'station'], boost: [], anti: ['find', 'nearest', 'near me', 'how to vote'], score: 5,
      resp: 'Your polling booth is based on your registered address. Find it:\n\n1. Check voter slip (sent before elections)\n2. Visit electoralsearch.eci.gov.in\n3. Use Voter Helpline App\n4. Call 1950\n\nOn polling day: carry voter ID, queue up, get ink, vote on EVM, verify VVPAT, exit. Hours: 7AM–6PM.' },
  ];

  let best = { resp: '', sc: 0 };
  for (const e of entries) {
    if (e.anti.some(k => msg.includes(k))) continue;
    const matched = e.keys.filter(k => msg.includes(k));
    if (!matched.length) continue;
    let sc = matched.length * 3 + e.score + (e.boost?.filter(k => msg.includes(k)).length || 0) * 5;
    if (sc > best.sc) best = { resp: e.resp, sc };
  }
  if (best.sc > 0) return best.resp;

  return 'I\'m Matdaan, your election assistant! I can help with:\n\n• 📋 Voter registration & ID\n• 🗳️ How to vote (step-by-step)\n• 🗓️ Election timeline & phases\n• 📍 Finding your polling booth\n• 🖥️ How EVMs & VVPAT work\n• 📞 Helpline contacts\n• 🔄 Transferring voter registration\n• 🚫 NOTA voting\n\nPlease ask a specific question about India\'s election process!';
}

