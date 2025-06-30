import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Sparkles } from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';
import { router } from 'expo-router';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const ICONS = ['🏃‍♂️', '📚', '🧘‍♀️', '💪', '🎨', '🎵', '✍️', '🌱', '💧', '🍎'];

const QUICK_HABITS = [
  { name: 'Morning Run', description: 'Start your day with energy', icon: '🏃‍♂️', color: '#FF6B6B', targetMinutes: 30 },
  { name: 'Read Books', description: 'Expand your knowledge daily', icon: '📚', color: '#4ECDC4', targetMinutes: 20 },
  { name: 'Meditation', description: 'Find inner peace and focus', icon: '🧘‍♀️', color: '#45B7D1', targetMinutes: 15 },
  { name: 'Workout', description: 'Build strength and endurance', icon: '💪', color: '#96CEB4', targetMinutes: 45 },
  { name: 'Creative Time', description: 'Express your artistic side', icon: '🎨', color: '#FFEAA7', targetMinutes: 30 },
  { name: 'Practice Music', description: 'Develop musical skills', icon: '🎵', color: '#DDA0DD', targetMinutes: 25 },
];

export default function AddHabit() {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetMinutes, setTargetMinutes] = useState('30');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      await addHabit({
        name: name.trim(),
        description: description.trim(),
        targetMinutes: parseInt(targetMinutes) || 30,
        color: selectedColor,
        icon: selectedIcon,
        streak: 0,
        totalMinutes: 0,
        completedToday: false,
      });

      // Reset form
      setName('');
      setDescription('');
      setTargetMinutes('30');
      setSelectedColor(COLORS[0]);
      setSelectedIcon(ICONS[0]);

      Alert.alert('Success', 'Habit created successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit');
    }
  };

  const handleQuickAdd = async (habit: typeof QUICK_HABITS[0]) => {
    try {
      await addHabit({
        name: habit.name,
        description: habit.description,
        targetMinutes: habit.targetMinutes,
        color: habit.color,
        icon: habit.icon,
        streak: 0,
        totalMinutes: 0,
        completedToday: false,
      });

      Alert.alert('Success', `${habit.name} habit added!`, [
        { text: 'OK', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={styles.header}
      >
        <Text style={styles.title}>Add New Habit</Text>
        <Text style={styles.subtitle}>Build a better version of yourself</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickHabitsSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <Text style={styles.sectionSubtitle}>Popular habits to get you started</Text>
          
          <View style={styles.quickHabitsGrid}>
            {QUICK_HABITS.map((habit, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickHabitCard, { borderColor: habit.color }]}
                onPress={() => handleQuickAdd(habit)}
              >
                <Text style={styles.quickHabitIcon}>{habit.icon}</Text>
                <Text style={styles.quickHabitName}>{habit.name}</Text>
                <Text style={styles.quickHabitTime}>{habit.targetMinutes}min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CREATE CUSTOM</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your habit"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Minutes per Day</Text>
            <TextInput
              style={styles.input}
              value={targetMinutes}
              onChangeText={setTargetMinutes}
              placeholder="30"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.selectedIcon
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Check size={20} color="white" />
            <Text style={styles.saveButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
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
  quickHabitsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  quickHabitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickHabitCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickHabitIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickHabitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickHabitTime: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  formSection: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIcon: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF620',
  },
  iconText: {
    fontSize: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});