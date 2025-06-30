import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Sparkles } from 'lucide-react-native';
import { HabitCard } from '@/components/HabitCard';
import { HabitForm } from '@/components/HabitForm';
import { FocusTimer } from '@/components/FocusTimer';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';

export default function Dashboard() {
  const { habits, loading, addHabit, updateHabit, deleteHabit, startFocusSession, endFocusSession } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [focusHabit, setFocusHabit] = useState<Habit | undefined>();

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setShowForm(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDeleteHabit = (habit: Habit) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteHabit(habit.id)
        }
      ]
    );
  };

  const handleSaveHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'sessions'>) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
    } else {
      await addHabit(habitData);
    }
  };

  const handleStartFocus = (habit: Habit) => {
    setFocusHabit(habit);
  };

  const handleFocusComplete = async (minutes: number) => {
    if (focusHabit) {
      // Update habit with completed session
      const updatedHabit = {
        ...focusHabit,
        totalMinutes: focusHabit.totalMinutes + minutes,
        completedToday: minutes >= focusHabit.targetMinutes * 0.8,
        lastCompletedAt: new Date(),
        streak: minutes >= focusHabit.targetMinutes * 0.8 ? focusHabit.streak + 1 : focusHabit.streak
      };
      
      await updateHabit(focusHabit.id, updatedHabit);
    }
    setFocusHabit(undefined);
  };

  const todayCompletedHabits = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const totalMinutes = habits.reduce((sum, h) => sum + h.totalMinutes, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#22C55E', '#16A34A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning! 🌱</Text>
            <Text style={styles.subtitle}>Let's build great habits today</Text>
          </View>
          <TouchableOpacity onPress={handleAddHabit} style={styles.addButton}>
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayCompletedHabits}</Text>
            <Text style={styles.statLabel}>Completed Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streaks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.floor(totalMinutes / 60)}h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Sparkles size={64} color="#22C55E" />
            <Text style={styles.emptyTitle}>Start Your Journey</Text>
            <Text style={styles.emptySubtitle}>
              Create your first habit and begin building a better you, one day at a time.
            </Text>
            <TouchableOpacity onPress={handleAddHabit} style={styles.emptyButton}>
              <Plus size={20} color="white" />
              <Text style={styles.emptyButtonText}>Create First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsGrid}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onPress={() => {}}
                onEdit={() => handleEditHabit(habit)}
                onDelete={() => handleDeleteHabit(habit)}
                onStartFocus={() => handleStartFocus(habit)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <HabitForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />

      {focusHabit && (
        <FocusTimer
          visible={!!focusHabit}
          onClose={() => setFocusHabit(undefined)}
          habit={focusHabit}
          onComplete={handleFocusComplete}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});