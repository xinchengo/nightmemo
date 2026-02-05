import { useEffect } from 'react';
import { useInputBuffer } from './hooks/useInputBuffer';
import { audioService } from './services/audio';

function App() {
  const { buffer, tokens, handleKeyDown } = useInputBuffer();
  
  // Ref to hold the current handleKeyDown so we can use it in the event listener
  // without constantly removing/adding the listener if we didn't want to.
  // However, since handleKeyDown changes when state changes, we actually DO need to update the listener.
  // The standard React pattern is useEffect with dependency.
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Initial greeting
  useEffect(() => {
    // Small delay to allow interaction first, but usually browsers block auto-audio.
    // We can't auto-play. We need user interaction.
    // We'll show a "Click to Start" overlay.
  }, []);

  const handleStart = () => {
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.style.display = 'none';
    audioService.playTypeSound(); // Initialize audio context
    audioService.speak("Night Memo Ready. Start typing.", "en-US");
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8 font-mono text-xl leading-loose selection:bg-gray-700">
      
      {/* Start Overlay for Audio Context */}
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
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="max-w-4xl mx-auto min-h-[80vh] whitespace-pre-wrap break-words">
        {/* Render Committed Tokens */}
        {tokens.map((token) => (
          <span key={token.id} className={token.type === 'pinyin' ? 'text-white' : 'text-blue-300'}>
            {token.content}
          </span>
        ))}
        
        {/* Render Active Buffer */}
        <span className="inline-block bg-gray-800 text-yellow-400 px-1 ml-1 rounded min-w-[10px] min-h-[1.5em] align-middle">
          {buffer}
          {/* Cursor Blinker */}
          <span className="animate-pulse">|</span>
        </span>
      </div>

      {/* Status Footer (Visual Aid for non-blind usage/debugging) */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-700">
        Buffer: {buffer.length} | Tokens: {tokens.length}
      </div>
    </div>
  );
}

export default App;
