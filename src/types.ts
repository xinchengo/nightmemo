export interface Token {
  id: string;
  content: string; // The display content (e.g., "hao3")
  raw: string;     // The raw input (e.g., "hao")
  type: 'pinyin' | 'english' | 'punctuation';
  tone?: number;   // 0-4 for pinyin
}
