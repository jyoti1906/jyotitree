import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartFocus: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export function HabitCard({ habit, onPress, onEdit, onDelete, onStartFocus }: HabitCardProps) {
  const progress = habit.targetMinutes > 0 ? Math.min(habit.totalMinutes / habit.targetMinutes, 1) : 0;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[habit.color, habit.color + '80']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Edit size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Trash2 size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.name} numberOfLines={2}>{habit.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{habit.description}</Text>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habit.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.floor(habit.totalMinutes / 60)}h</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
        
        <TouchableOpacity style={styles.focusButton} onPress={onStartFocus}>
          <Play size={16} color="white" fill="white" />
          <Text style={styles.focusButtonText}>Focus</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 16,
    minHeight: 220,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  focusButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});