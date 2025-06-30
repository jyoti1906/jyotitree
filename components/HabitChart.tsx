import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { HabitSession } from '@/types/habit';

interface HabitChartProps {
  sessions: HabitSession[];
  color: string;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

export function HabitChart({ sessions, color }: HabitChartProps) {
  // Get last 30 days of data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const sessionsByDate = sessions.reduce((acc, session) => {
    const dateKey = session.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, HabitSession[]>);

  const chartData = last30Days.map(date => {
    const dateKey = date.toDateString();
    const daySessions = sessionsByDate[dateKey] || [];
    const totalMinutes = daySessions.reduce((sum, session) => sum + session.minutes, 0);
    const completed = daySessions.some(session => session.completed);
    
    return {
      date,
      minutes: totalMinutes,
      completed,
      day: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString()
    };
  });

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>30-Day Progress</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((data, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max((data.minutes / maxMinutes) * 100, 2),
                      backgroundColor: data.completed ? color : color + '40',
                    }
                  ]}
                />
              </View>
              <Text style={[
                styles.dayLabel,
                data.isToday && styles.todayLabel
              ]}>
                {data.day}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: color }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: color + '40' }]} />
          <Text style={styles.legendText}>Partial</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 8,
    borderRadius: 4,
    minHeight: 2,
  },
  dayLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  todayLabel: {
    color: '#22C55E',
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});