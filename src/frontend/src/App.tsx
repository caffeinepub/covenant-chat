import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import UnlockScreen from './features/chat/UnlockScreen';
import ChatScreen from './features/chat/ChatScreen';
import { getSessionPassword, clearSessionPassword } from './features/chat/chatSession';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check if there's a stored password on mount
    const storedPassword = getSessionPassword();
    if (storedPassword) {
      setIsUnlocked(true);
    }
    setIsCheckingSession(false);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleLock = () => {
    clearSessionPassword();
    setIsUnlocked(false);
  };

  if (isCheckingSession) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen overflow-hidden">
        {!isUnlocked ? (
          <UnlockScreen onUnlock={handleUnlock} />
        ) : (
          <ChatScreen onLock={handleLock} />
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

