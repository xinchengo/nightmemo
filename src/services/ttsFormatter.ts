export interface TTSPayload {
  type: 'text' | 'pinyin';
  content: string; // The base content (e.g., "hao", "nv", "Hello")
  tone?: number;   // For pinyin: 0-5
}

export function formatTTSContent(payload: string | TTSPayload, voiceURI: string = ''): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload.type === 'text') {
    return payload.content;
  }

  if (payload.type === 'pinyin') {
    let pinyin = payload.content;
    let tone = payload.tone ?? 0; // Default to 0 if undefined

    // Check for Eloquence
    const isEloquence = voiceURI.toLowerCase().includes('eloquence');

    if (isEloquence) {
      // Eloquence Rules
      // 1. v -> uu, ü -> uu
      pinyin = pinyin.replace(/v/g, 'uu').replace(/ü/g, 'uu');
      
      // 2. Neutral tone handling
      // If tone is 5 (neutral in some systems), map to 0 (Eloquence neutral)
      // If tone is 0, keep as 0.
      if (tone === 5) tone = 0;
      
    } else {
      // Standard / Siri / Other Rules
      // 1. v -> v (Siri uses 'v' for 'ü')
      // Ensure 'ü' is converted to 'v' if present.
      pinyin = pinyin.replace(/ü/g, 'v');
      
      // 2. Neutral tone handling
      // Usually 5 is used for neutral in some engines, or just no number.
      // README says Siri uses 5 for light tone.
      // So if tone is 0, map to 5.
      if (tone === 0) tone = 5;
    }

    return `${pinyin}${tone}`;
  }

  return payload.content;
}
