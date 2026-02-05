import { useState, useCallback } from 'react';
import type { Token } from '../types';
import { audioService } from '../services/audio';

export const useInputBuffer = () => {
  const [buffer, setBuffer] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default browser actions for handled keys
    
    const key = e.key;

    // 1. Backspace Handling
    if (key === 'Backspace') {
      e.preventDefault();
      if (buffer.length > 0) {
        setBuffer(prev => prev.slice(0, -1));
        audioService.playBackspaceBufferSound();
      } else if (tokens.length > 0) {
        setTokens(prev => prev.slice(0, -1));
        audioService.playBackspaceTokenSound();
      } else {
        audioService.playErrorSound(); // Nothing to delete
      }
      return;
    }

    // 2. Numeric Delimiters (0-9)
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      const numKey = parseInt(key);

      if (buffer.length === 0) {
        audioService.playErrorSound();
        return;
      }

      // 0-4: Pinyin with Tone
      if (numKey >= 0 && numKey <= 4) {
        const tone = numKey;
        const content = buffer + tone;
        const newToken: Token = {
          id: Date.now().toString(),
          content: content,
          raw: buffer,
          type: 'pinyin',
          tone: tone
        };
        
        setTokens(prev => [...prev, newToken]);
        setBuffer('');
        audioService.playConfirmPinyinSound();
        audioService.speak(content, 'zh-CN');
      }
      // 5-9: English Word
      else if (numKey >= 5 && numKey <= 9) {
        const newToken: Token = {
          id: Date.now().toString(),
          content: buffer + ' ', // Add space for English flow
          raw: buffer,
          type: 'english'
        };

        setTokens(prev => [...prev, newToken]);
        setBuffer('');
        audioService.playConfirmEnglishSound();
        audioService.speak(buffer, 'en-US');
      }
      return;
    }

    // 4. Reading Controls (Alt + Key)
    if (e.altKey) {
      if (key === 'r') {
        // Read All
        e.preventDefault();
        const fullText = tokens.map(t => t.content).join('');
        audioService.speak('Reading all: ' + fullText);
        return;
      }
      if (key === 'l') {
        // Read Last Token
        e.preventDefault();
        if (tokens.length > 0) {
          const last = tokens[tokens.length - 1];
          audioService.speak('Last entry: ' + last.content);
        } else {
          audioService.playErrorSound();
        }
        return;
      }
      if (key === 's') {
        // Read Status (Buffer)
        e.preventDefault();
        if (buffer) {
          audioService.speak('Current buffer: ' + buffer);
        } else {
          audioService.speak('Buffer empty');
        }
        return;
      }
    }

    // 5. Alphabetic Input
    if (/^[a-zA-Z]$/.test(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setBuffer(prev => prev + key.toLowerCase());
      audioService.playTypeSound();
      return;
    }

  }, [buffer, tokens]);

  return {
    buffer,
    tokens,
    handleKeyDown
  };
};
