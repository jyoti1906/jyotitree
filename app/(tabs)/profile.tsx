import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit, Trash2, Settings, Award, Calendar, Clock, Target } from 'lucide-react-native';
import { HabitForm } from '@/components/HabitForm';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';

export default function Profile() {
  const { habits, sessions, updateHabit, deleteHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const totalMinutes = habits.reduce((sum, h) => sum + h.totalMinutes, 0);
  const totalSessions = sessions.length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

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
    }
    setEditingHabit(undefined);
    setShowForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EC4899', '#DB2777']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your habits and progress</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#22C55E20' }]}>
                <Clock size={24} color="#22C55E" />
              </View>
              <Text style={styles.statValue}>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
                <Calendar size={24} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
                <Target size={24} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{completedHabits}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
                <Award size={24} color="#EF4444" />
              </View>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first habit to start tracking your progress.
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {habits.map((habit) => (
                <View key={habit.id} style={styles.habitItem}>
                  <View style={styles.habitInfo}>
                    <View style={styles.habitHeader}>
                      <Text style={styles.habitIcon}>{habit.icon}</Text>
                      <View style={styles.habitDetails}>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.habitDescription}>{habit.description}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.habitStats}>
                      <View style={styles.habitStat}>
                        <Text style={styles.habitStatValue}>{habit.streak}</Text>
                        <Text style={styles.habitStatLabel}>Streak</Text>
                      </View>
                      <View style={styles.habitStat}>
                        <Text style={styles.habitStatValue}>{Math.floor(habit.totalMinutes / 60)}h</Text>
                        <Text style={styles.habitStatLabel}>Total</Text>
                      </View>
                      <View style={styles.habitStat}>
                        <Text style={styles.habitStatValue}>{habit.targetMinutes}m</Text>
                        <Text style={styles.habitStatLabel}>Target</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.habitActions}>
                    <TouchableOpacity
                      onPress={() => handleEditHabit(habit)}
                      style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}
                    >
                      <Edit size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteHabit(habit)}
                      style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <HabitForm
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingHabit(undefined);
        }}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  habitsSection: {
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  habitsList: {
    gap: 12,
  },
  habitItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
  },
  habitStats: {
    flexDirection: 'row',
    gap: 20,
  },
  habitStat: {
    alignItems: 'center',
  },
  habitStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  habitStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  habitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});