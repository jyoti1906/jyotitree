import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react-native';
import { HabitChart } from '@/components/HabitChart';
import { useHabits } from '@/hooks/useHabits';

export default function Analytics() {
  const { habits, sessions } = useHabits();

  const totalMinutesThisWeek = sessions
    .filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    })
    .reduce((sum, session) => sum + session.minutes, 0);

  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100)
    : 0;

  const averageStreak = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
    : 0;

  const longestStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.streak))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
      >
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your progress and insights</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#22C55E20' }]}>
              <Clock size={24} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{Math.floor(totalMinutesThisWeek / 60)}h {totalMinutesThisWeek % 60}m</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
              <Target size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EF4444E20' }]}>
              <TrendingUp size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{averageStreak}</Text>
            <Text style={styles.statLabel}>Avg Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#8B5CF620' }]}>
              <Calendar size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.chartsContainer}>
          {habits.map((habit) => {
            const habitSessions = sessions.filter(s => s.habitId === habit.id);
            return (
              <View key={habit.id} style={styles.chartWrapper}>
                <View style={styles.chartHeader}>
                  <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartIcon}>{habit.icon}</Text>
                    <Text style={styles.chartTitle}>{habit.name}</Text>
                  </View>
                  <View style={styles.chartStats}>
                    <Text style={styles.chartStatValue}>{habit.streak}</Text>
                    <Text style={styles.chartStatLabel}>streak</Text>
                  </View>
                </View>
                <HabitChart sessions={habitSessions} color={habit.color} />
              </View>
            );
          })}
        </View>

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <TrendingUp size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking habits to see your analytics and progress charts.
            </Text>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  chartsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  chartWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chartIcon: {
    fontSize: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  chartStats: {
    alignItems: 'center',
  },
  chartStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  chartStatLabel: {
    fontSize: 12,
    color: '#666',
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
  },
});