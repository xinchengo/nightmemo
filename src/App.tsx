import { useEffect, useState } from 'react';
import { useInputBuffer } from './hooks/useInputBuffer';
import { audioService } from './services/audio';

type PinyinMode = 'mark' | 'number';

function App() {
  const { buffer, tokens, handleKeyDown, clearTokens } = useInputBuffer();
  const [showSettings, setShowSettings] = useState(false);
  const [pinyinMode, setPinyinMode] = useState<PinyinMode>(() => {
    return (localStorage.getItem('nightmemo_pinyin_mode') as PinyinMode) || 'mark';
  });

  useEffect(() => {
    localStorage.setItem('nightmemo_pinyin_mode', pinyinMode);
  }, [pinyinMode]);
  
  // Combine input handler with settings toggle
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        setShowSettings(prev => !prev);
        if (!showSettings) {
           audioService.speak("Settings opened", "en-US");
        } else {
           audioService.speak("Settings closed", "en-US");
        }
        return;
      }
      
      if (!showSettings) {
        handleKeyDown(e);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => {
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, [handleKeyDown, showSettings]);

  const handleStart = () => {
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';
    audioService.playTypeSound(); // Initialize audio context
    audioService.speak("Night Memo Ready. Start typing.", "en-US");
  };

  const handleClear = () => {
    if (confirm("Clear all text?")) {
      clearTokens();
      setShowSettings(false);
      audioService.speak("Document cleared", "en-US");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8 font-mono text-xl leading-loose selection:bg-gray-700">
      
      {/* Start Overlay */}
      <div id="start-overlay" 
           onClick={handleStart}
           className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Night Memo</h1>
          <p className="mb-8">Click anywhere to start</p>
          <div className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-2">
            <p>• Type letters [a-z] to fill buffer.</p>
            <p>• Press [0-4] to confirm Pinyin with Tone.</p>
            <p>• Press [5-9] to confirm English word.</p>
            <p>• Backspace to delete char or last token.</p>
            <p>• Alt+R: Read All | Alt+L: Read Last | Alt+S: Read Buffer</p>
            <p>• ESC: Settings / Menu</p>
          </div>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-lg max-w-sm w-full space-y-6">
            <h2 className="text-2xl text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => setPinyinMode(prev => prev === 'mark' ? 'number' : 'mark')}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded text-left flex justify-between items-center"
              >
                <span>Pinyin Display</span>
                <span className="text-blue-400">{pinyinMode === 'mark' ? 'Tone Marks' : 'Numbers'}</span>
              </button>

              <button 
                onClick={handleClear}
                className="w-full py-3 px-4 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-left"
              >
                Clear Document
              </button>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded text-center mt-4"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className={`max-w-4xl mx-auto min-h-[80vh] whitespace-pre-wrap break-words ${showSettings ? 'blur-sm' : ''}`}>
        {/* Render Committed Tokens */}
        {tokens.map((token) => {
          let display = token.content;
          if (pinyinMode === 'number' && token.type === 'pinyin' && token.tone !== undefined) {
             display = token.raw + token.tone + ' ';
          }
          
          return (
            <span key={token.id} className={token.type === 'pinyin' ? 'text-white' : 'text-blue-300'}>
              {display}
            </span>
          );
        })}
        
        {/* Render Active Buffer */}
        <span className="inline-block bg-gray-800 text-yellow-400 px-1 ml-1 rounded min-w-[10px] min-h-[1.5em] align-middle">
          {buffer}
          {/* Cursor Blinker */}
          <span className="animate-pulse">|</span>
        </span>
      </div>

      {/* Status Footer */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-700">
        Buffer: {buffer.length} | Tokens: {tokens.length} | Mode: {pinyinMode}
      </div>
    </div>
  );
}

export default App;
