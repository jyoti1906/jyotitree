import { useState, useEffect } from 'react';
import { Habit, HabitSession, FocusSession } from '@/types/habit';
import { StorageService } from '@/utils/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sessions, setSessions] = useState<HabitSession[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsData, sessionsData, focusSessionsData] = await Promise.all([
        StorageService.getHabits(),
        StorageService.getSessions(),
        StorageService.getFocusSessions()
      ]);
      
      setHabits(habitsData);
      setSessions(sessionsData);
      setFocusSessions(focusSessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'sessions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date(),
      sessions: []
    };
    
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await StorageService.saveHabits(updatedHabits);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    );
    setHabits(updatedHabits);
    await StorageService.saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    const updatedSessions = sessions.filter(session => session.habitId !== id);
    const updatedFocusSessions = focusSessions.filter(session => session.habitId !== id);
    
    setHabits(updatedHabits);
    setSessions(updatedSessions);
    setFocusSessions(updatedFocusSessions);
    
    await Promise.all([
      StorageService.saveHabits(updatedHabits),
      StorageService.saveSessions(updatedSessions),
      StorageService.saveFocusSessions(updatedFocusSessions)
    ]);
  };

  const addSession = async (session: Omit<HabitSession, 'id'>) => {
    const newSession: HabitSession = {
      ...session,
      id: Date.now().toString()
    };
    
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    await StorageService.saveSessions(updatedSessions);

    // Update habit stats
    const habit = habits.find(h => h.id === session.habitId);
    if (habit) {
      const updatedHabit = {
        ...habit,
        totalMinutes: habit.totalMinutes + session.minutes,
        completedToday: session.completed,
        lastCompletedAt: session.completed ? session.date : habit.lastCompletedAt,
        streak: session.completed ? habit.streak + 1 : habit.streak
      };
      await updateHabit(habit.id, updatedHabit);
    }
  };

  const startFocusSession = async (habitId: string, targetMinutes: number) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      habitId,
      startTime: new Date(),
      targetMinutes,
      actualMinutes: 0,
      isActive: true
    };
    
    const updatedFocusSessions = [...focusSessions, newSession];
    setFocusSessions(updatedFocusSessions);
    await StorageService.saveFocusSessions(updatedFocusSessions);
    
    return newSession.id;
  };

  const endFocusSession = async (sessionId: string, actualMinutes: number) => {
    const updatedFocusSessions = focusSessions.map(session =>
      session.id === sessionId
        ? {
            ...session,
            endTime: new Date(),
            actualMinutes,
            isActive: false
          }
        : session
    );
    
    setFocusSessions(updatedFocusSessions);
    await StorageService.saveFocusSessions(updatedFocusSessions);

    // Add session to habit
    const session = focusSessions.find(s => s.id === sessionId);
    if (session) {
      await addSession({
        habitId: session.habitId,
        date: new Date(),
        minutes: actualMinutes,
        completed: actualMinutes >= session.targetMinutes * 0.8 // 80% completion threshold
      });
    }
  };

  return {
    habits,
    sessions,
    focusSessions,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    addSession,
    startFocusSession,
    endFocusSession
  };
}