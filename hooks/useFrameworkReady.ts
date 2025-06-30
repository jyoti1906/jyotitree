import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // For web, we're always ready
    if (Platform.OS === 'web') {
      setIsReady(true);
      return;
    }

    // For native platforms, add any initialization logic here
    const initializeFramework = async () => {
      try {
        // Add any async initialization here
        setIsReady(true);
      } catch (error) {
        console.error('Framework initialization error:', error);
        setIsReady(true); // Still set to true to prevent blocking
      }
    };

    initializeFramework();
  }, []);

  return isReady;
}