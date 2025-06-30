import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitSession, FocusSession } from '@/types/habit';

const HABITS_KEY = 'grove_habits';
const SESSIONS_KEY = 'grove_sessions';
const FOCUS_SESSIONS_KEY = 'grove_focus_sessions';

export const StorageService = {
  // Habits
  async getHabits(): Promise<Habit[]> {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  // Sessions
  async getSessions(): Promise<HabitSession[]> {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  async saveSessions(sessions: HabitSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  },

  // Focus Sessions
  async getFocusSessions(): Promise<FocusSession[]> {
    try {
      const data = await AsyncStorage.getItem(FOCUS_SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading focus sessions:', error);
      return [];
    }
  },

  async saveFocusSessions(sessions: FocusSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving focus sessions:', error);
    }
  }
};