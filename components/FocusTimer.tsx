import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, RotateCcw } from 'lucide-react-native';
import { Habit } from '@/types/habit';

interface FocusTimerProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit;
  onComplete: (minutes: number) => void;
}

const { width, height } = Dimensions.get('window');

export function FocusTimer({ visible, onClose, habit, onComplete }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(habit.targetMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(habit.targetMinutes * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            const completedMinutes = Math.ceil((totalTime - prev) / 60);
            onComplete(completedMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, totalTime, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / totalTime);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    const completedMinutes = Math.ceil((totalTime - timeLeft) / 60);
    onComplete(completedMinutes);
  };
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <LinearGradient
        colors={[habit.color, habit.color + '80', '#1a1a1a']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.habitName}>{habit.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.circleContainer}>
            <svg width="280" height="280" style={styles.circle}>
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="white"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 140 140)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.targetText}>of {habit.targetMinutes}min</Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handleReset} style={styles.controlButton}>
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={isRunning ? handlePause : handleStart}
            style={[styles.controlButton, styles.playButton]}
          >
            {isRunning ? (
              <Pause size={32} color="white" fill="white" />
            ) : (
              <Play size={32} color="white" fill="white" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleStop} style={styles.controlButton}>
            <Square size={24} color="white" fill="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habit.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.floor(habit.totalMinutes / 60)}h</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: 'white',
    fontFamily: 'monospace',
  },
  targetText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 60,
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});