import { useEffect, useState } from 'react';
import { useInputBuffer } from './hooks/useInputBuffer';
import { audioService } from './services/audio';

type PinyinMode = 'mark' | 'number';

function App() {
  const { buffer, tokens, handleKeyDown, clearTokens } = useInputBuffer();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [pinyinMode, setPinyinMode] = useState<PinyinMode>(() => {
    return (localStorage.getItem('nightmemo_pinyin_mode') as PinyinMode) || 'mark';
  });

  // Voice State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showAllVoices, setShowAllVoices] = useState(false);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => {
    return localStorage.getItem('nightmemo_voice_uri') || '';
  });

  // Load voices
  useEffect(() => {
    const updateVoices = () => {
      const allVoices = audioService.getVoices();
      setVoices(allVoices);
    };

    updateVoices();
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Filter voices based on toggle
  const filteredVoices = showAllVoices 
    ? voices 
    : voices.filter(v => v.lang === 'zh-CN' || v.voiceURI === selectedVoiceURI);

  // Update service and persist voice selection
  useEffect(() => {
    if (selectedVoiceURI) {
      audioService.setVoice(selectedVoiceURI);
      localStorage.setItem('nightmemo_voice_uri', selectedVoiceURI);
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    localStorage.setItem('nightmemo_pinyin_mode', pinyinMode);
  }, [pinyinMode]);
  
  // Combine input handler with settings toggle
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Toggle Help with Alt+H or ? (Shift+/)
      if ((e.altKey && e.code === 'KeyH') || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        if (!showHelp) {
           audioService.speak({ type: 'text', content: "Help opened" }, "en-US");
        }
        return;
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        setShowSettings(prev => !prev);
        if (!showSettings) {
           audioService.speak({ type: 'text', content: "Settings opened" }, "en-US");
        } else {
           audioService.speak({ type: 'text', content: "Settings closed" }, "en-US");
        }
        return;
      }
      
      if (!showSettings && !showHelp) {
        handleKeyDown(e);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => {
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, [handleKeyDown, showSettings, showHelp]);

  const handleStart = () => {
    setShowHelp(false);
    audioService.playTypeSound(); // Initialize audio context
    // Apply saved voice if any
    if (selectedVoiceURI) {
      audioService.setVoice(selectedVoiceURI);
    }
    audioService.speak({ type: 'text', content: "Night Memo Ready. Start typing." }, "en-US");
  };

  const handleClear = () => {
    if (confirm("Clear all text?")) {
      clearTokens();
      setShowSettings(false);
      audioService.speak({ type: 'text', content: "Document cleared" }, "en-US");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8 font-mono text-xl leading-loose selection:bg-gray-700 relative">
      
      {/* Start/Help Overlay */}
      {showHelp && (
        <div id="start-overlay" 
             onClick={handleStart}
             className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 cursor-pointer">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Night Memo</h1>
            <p className="mb-8">Click anywhere to start</p>
            <div className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-2">
              <p>• Type letters [a-z] to fill buffer.</p>
              <p>• Press [0-4] to confirm Pinyin with Tone.</p>
              <p>• Press [5-9] to confirm English word.</p>
              <p>• Backspace to delete char or last token.</p>
              <p>• Alt+R: Read All | Alt+L: Read Last | Alt+S: Read Buffer</p>
              <p>• ESC: Settings | Alt+H or ?: Toggle Help</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-lg max-w-sm w-full space-y-6">
            <h2 className="text-2xl text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              {/* Voice Selector */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 block">Voice Selection</label>
                <select 
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    const uri = e.target.value;
                    setSelectedVoiceURI(uri);
                    audioService.setVoice(uri);
                    audioService.speak({ type: 'text', content: 'Voice selected' }, 'zh-CN');
                  }}
                  className="w-full py-2 px-3 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Default System Voice</option>
                  {filteredVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="show-all-voices"
                    checked={showAllVoices}
                    onChange={(e) => setShowAllVoices(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor="show-all-voices" className="text-sm text-gray-400 cursor-pointer">
                    Show all voices (including non-Chinese)
                  </label>
                </div>
              </div>

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
      <div className="fixed bottom-4 right-4 text-xs text-gray-700 flex gap-4">
        <span>Buffer: {buffer.length} | Tokens: {tokens.length} | Mode: {pinyinMode}</span>
        <button 
          onClick={() => setShowHelp(true)}
          className="hover:text-gray-500 underline"
        >
          Help (?)
        </button>
      </div>
    </div>
  );
}

export default App;
