
const toneMap: Record<string, string[]> = {
  'a': ['ā', 'á', 'ǎ', 'à'],
  'o': ['ō', 'ó', 'ǒ', 'ò'],
  'e': ['ē', 'é', 'ě', 'è'],
  'i': ['ī', 'í', 'ǐ', 'ì'],
  'u': ['ū', 'ú', 'ǔ', 'ù'],
  'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

export function convertToPinyin(input: string, tone: number): string {
  // Input example: "hao", "nv", "lue"
  // Tone: 0-4 (0 = neutral)
  
  // Replace v with ü for display/processing
  let text = input.replace(/v/g, 'ü');

  if (tone === 0) {
    return text;
  }

  // Find the vowel to put the tone on
  // Priority: a > o > e
  // If none, then i, u, ü. 
  // Exception: iu, ui -> tone on the last letter.
  
  const vowels = ['a', 'o', 'e', 'i', 'u', 'ü'];
  
  let charToToneIndex = -1;

  if (text.includes('a')) charToToneIndex = text.indexOf('a');
  else if (text.includes('o')) charToToneIndex = text.indexOf('o');
  else if (text.includes('e')) charToToneIndex = text.indexOf('e');
  else if (text.includes('iu')) charToToneIndex = text.indexOf('u'); // iu -> u
  else if (text.includes('ui')) charToToneIndex = text.indexOf('i'); // ui -> i
  else {
    // Find the first vowel among i, u, ü
    for (let i = 0; i < text.length; i++) {
      if (['i', 'u', 'ü'].includes(text[i])) {
        charToToneIndex = i;
        break;
      }
    }
  }

  if (charToToneIndex !== -1) {
    const char = text[charToToneIndex];
    const tonedChar = toneMap[char]?.[tone - 1];
    if (tonedChar) {
      return text.substring(0, charToToneIndex) + tonedChar + text.substring(charToToneIndex + 1);
    }
  }

  return text; // Fallback
}
