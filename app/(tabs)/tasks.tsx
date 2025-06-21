import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard as Edit3, Trash2, Clock, Tag, Palette, Bell, Calendar, X, Check } from 'lucide-react-native';

// Mock data for demonstration
const mockTasks = [
  {
    id: '1',
    title: '英語学習',
    scheduledTime: '07:00',
    category: '勉強',
    color: '#3B82F6',
    daysOfWeek: [1, 2, 3, 4, 5],
    notificationMinutesBefore: 10,
    isActive: true,
  },
  {
    id: '2',
    title: 'ジョギング',
    scheduledTime: '06:30',
    category: '運動',
    color: '#10B981',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    notificationMinutesBefore: 15,
    isActive: true,
  },
  {
    id: '3',
    title: '読書',
    scheduledTime: '21:00',
    category: '勉強',
    color: '#8B5CF6',
    daysOfWeek: [0, 6],
    notificationMinutesBefore: 5,
    isActive: false,
  },
];

const taskColors = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', 
  '#EF4444', '#06B6D4', '#84CC16', '#F97316'
];

const categories = ['勉強', '運動', '仕事', '趣味', '健康', 'その他'];
const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    scheduledTime: '',
    category: '勉強',
    color: '#3B82F6',
    daysOfWeek: [],
    notificationMinutesBefore: 10,
  });

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      scheduledTime: '',
      category: '勉強',
      color: '#3B82F6',
      daysOfWeek: [],
      notificationMinutesBefore: 10,
    });
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      scheduledTime: task.scheduledTime,
      category: task.category,
      color: task.color,
      daysOfWeek: task.daysOfWeek,
      notificationMinutesBefore: task.notificationMinutesBefore,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.scheduledTime.trim()) {
      Alert.alert('エラー', 'タスク名と開始時刻を入力してください');
      return;
    }

    if (formData.daysOfWeek.length === 0) {
      Alert.alert('エラー', '実行する曜日を選択してください');
      return;
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      isActive: true,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task));
    } else {
      setTasks([...tasks, taskData]);
    }

    setModalVisible(false);
  };

  const handleDelete = (taskId) => {
    Alert.alert(
      '削除確認',
      'このタスクを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => task.id !== taskId))
        }
      ]
    );
  };

  const toggleTaskActive = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    ));
  };

  const toggleDayOfWeek = (day) => {
    const newDaysOfWeek = formData.daysOfWeek.includes(day)
      ? formData.daysOfWeek.filter(d => d !== day)
      : [...formData.daysOfWeek, day].sort();
    
    setFormData({ ...formData, daysOfWeek: newDaysOfWeek });
  };

  const getDaysOfWeekText = (daysOfWeek) => {
    if (daysOfWeek.length === 7) return '毎日';
    return daysOfWeek.map(day => daysOfWeekLabels[day]).join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>タスク管理</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <View 
                    style={[
                      styles.taskColorIndicator, 
                      { backgroundColor: task.color }
                    ]} 
                  />
                  <View style={styles.taskDetails}>
                    <Text style={[
                      styles.taskTitle,
                      !task.isActive && styles.inactiveText
                    ]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskMetaText}>
                        <Tag size={12} color="#6B7280" /> {task.category}
                      </Text>
                      <Text style={styles.taskMetaText}>
                        <Clock size={12} color="#6B7280" /> {task.scheduledTime}
                      </Text>
                    </View>
                    <Text style={styles.taskDays}>
                      {getDaysOfWeekText(task.daysOfWeek)}
                    </Text>
                  </View>
                </View>
                <View style={styles.taskActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => toggleTaskActive(task.id)}
                  >
                    <Check 
                      size={18} 
                      color={task.isActive ? '#10B981' : '#9CA3AF'} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openEditModal(task)}
                  >
                    <Edit3 size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDelete(task.id)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.taskFooter}>
                <Text style={styles.notificationText}>
                  <Bell size={12} color="#6B7280" /> {task.notificationMinutesBefore}分前に通知
                </Text>
                <Text style={[
                  styles.statusText,
                  task.isActive ? styles.activeStatus : styles.inactiveStatus
                ]}>
                  {task.isActive ? 'アクティブ' : '無効'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'タスクを編集' : '新しいタスク'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Task Title */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>タスク名</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="例: 英語学習"
                />
              </View>

              {/* Scheduled Time */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>開始時刻</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.scheduledTime}
                  onChangeText={(text) => setFormData({ ...formData, scheduledTime: text })}
                  placeholder="例: 07:00"
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>カテゴリ</Text>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        formData.category === category && styles.selectedCategory
                      ]}
                      onPress={() => setFormData({ ...formData, category })}
                    >
                      <Text style={[
                        styles.categoryText,
                        formData.category === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Days of Week */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>実行する曜日</Text>
                <View style={styles.daysContainer}>
                  {daysOfWeekLabels.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        formData.daysOfWeek.includes(index) && styles.selectedDay
                      ]}
                      onPress={() => toggleDayOfWeek(index)}
                    >
                      <Text style={[
                        styles.dayText,
                        formData.daysOfWeek.includes(index) && styles.selectedDayText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Color */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>色</Text>
                <View style={styles.colorContainer}>
                  {taskColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        formData.color === color && styles.selectedColor
                      ]}
                      onPress={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </View>
              </View>

              {/* Notification */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>通知タイミング（分前）</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.notificationMinutesBefore.toString()}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    notificationMinutesBefore: parseInt(text) || 0 
                  })}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  taskColorIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  inactiveText: {
    color: '#9CA3AF',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskDays: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeStatus: {
    color: '#10B981',
  },
  inactiveStatus: {
    color: '#9CA3AF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedDay: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#111827',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});