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
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, Plus, Tag, Calendar, MessageSquare, X, CreditCard as Edit3 } from 'lucide-react-native';

// Mock data for demonstration
const mockRecords = [
  {
    id: '1',
    taskId: '1',
    taskTitle: '英語学習',
    taskColor: '#3B82F6',
    date: '2024-01-15',
    status: 'completed',
    memo: '今日は調子がよかった',
    recordedAt: new Date(),
  },
  {
    id: '2',
    taskId: '2',
    taskTitle: 'ジョギング',
    taskColor: '#10B981',
    date: '2024-01-15',
    status: 'failed',
    failureTagIds: ['1', '2'],
    memo: '雨が降っていて外に出られなかった',
    recordedAt: new Date(),
  },
  {
    id: '3',
    taskId: '3',
    taskTitle: '読書',
    taskColor: '#8B5CF6',
    date: '2024-01-14',
    status: 'delayed',
    memo: '30分遅れで開始',
    recordedAt: new Date(),
  },
];

const mockUserTags = [
  { id: '1', name: '天気が悪い', usageCount: 5 },
  { id: '2', name: 'やる気が出ない', usageCount: 8 },
  { id: '3', name: '時間がない', usageCount: 12 },
  { id: '4', name: '体調不良', usageCount: 3 },
  { id: '5', name: '他の用事', usageCount: 7 },
];

const mockTasks = [
  { id: '1', title: '英語学習', color: '#3B82F6' },
  { id: '2', title: 'ジョギング', color: '#10B981' },
  { id: '3', title: '読書', color: '#8B5CF6' },
];

export default function RecordScreen() {
  const [records, setRecords] = useState(mockRecords);
  const [userTags, setUserTags] = useState(mockUserTags);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [formData, setFormData] = useState({
    taskId: '',
    status: 'completed',
    failureTagIds: [],
    memo: '',
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '完了';
      case 'failed': return '未実行';
      case 'delayed': return '遅れて開始';
      default: return '不明';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'failed': return '#EF4444';
      case 'delayed': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10B981" />;
      case 'failed':
        return <XCircle size={20} color="#EF4444" />;
      case 'delayed':
        return <Clock size={20} color="#F59E0B" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({
      taskId: mockTasks[0].id,
      status: 'completed',
      failureTagIds: [],
      memo: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      taskId: record.taskId,
      status: record.status,
      failureTagIds: record.failureTagIds || [],
      memo: record.memo || '',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    const selectedTask = mockTasks.find(task => task.id === formData.taskId);
    if (!selectedTask) {
      Alert.alert('エラー', 'タスクを選択してください');
      return;
    }

    const recordData = {
      ...formData,
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      taskTitle: selectedTask.title,
      taskColor: selectedTask.color,
      date: new Date().toISOString().split('T')[0],
      recordedAt: new Date(),
    };

    if (editingRecord) {
      setRecords(records.map(record => 
        record.id === editingRecord.id ? recordData : record
      ));
    } else {
      setRecords([recordData, ...records]);
    }

    // Update tag usage count
    if (formData.failureTagIds.length > 0) {
      setUserTags(userTags.map(tag => 
        formData.failureTagIds.includes(tag.id) 
          ? { ...tag, usageCount: tag.usageCount + 1 }
          : tag
      ));
    }

    setModalVisible(false);
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      Alert.alert('エラー', 'タグ名を入力してください');
      return;
    }

    const newTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      usageCount: 0,
    };

    setUserTags([...userTags, newTag]);
    setNewTagName('');
    setTagModalVisible(false);
  };

  const toggleFailureTag = (tagId) => {
    const newFailureTagIds = formData.failureTagIds.includes(tagId)
      ? formData.failureTagIds.filter(id => id !== tagId)
      : [...formData.failureTagIds, tagId];
    
    setFormData({ ...formData, failureTagIds: newFailureTagIds });
  };

  const getFailureTagsText = (tagIds) => {
    if (!tagIds || tagIds.length === 0) return '';
    return tagIds
      .map(id => userTags.find(tag => tag.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const groupedRecords = records.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>実行記録</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.entries(groupedRecords)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .map(([date, dayRecords]) => (
            <View key={date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.dateText}>
                  {new Date(date).toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </Text>
              </View>

              {dayRecords.map((record) => (
                <TouchableOpacity 
                  key={record.id} 
                  style={styles.recordCard}
                  onPress={() => openEditModal(record)}
                >
                  <View style={styles.recordHeader}>
                    <View style={styles.recordInfo}>
                      <View 
                        style={[
                          styles.taskColorIndicator, 
                          { backgroundColor: record.taskColor }
                        ]} 
                      />
                      <View style={styles.recordDetails}>
                        <Text style={styles.recordTitle}>{record.taskTitle}</Text>
                        <View style={styles.recordStatus}>
                          {getStatusIcon(record.status)}
                          <Text 
                            style={[
                              styles.statusText, 
                              { color: getStatusColor(record.status) }
                            ]}
                          >
                            {getStatusText(record.status)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {record.failureTagIds && record.failureTagIds.length > 0 && (
                    <View style={styles.tagsContainer}>
                      <Tag size={12} color="#6B7280" />
                      <Text style={styles.tagsText}>
                        {getFailureTagsText(record.failureTagIds)}
                      </Text>
                    </View>
                  )}

                  {record.memo && (
                    <View style={styles.memoContainer}>
                      <MessageSquare size={12} color="#6B7280" />
                      <Text style={styles.memoText}>{record.memo}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </ScrollView>

      {/* Add/Edit Record Modal */}
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
                {editingRecord ? '記録を編集' : '記録を追加'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Task Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>タスク</Text>
                <View style={styles.taskContainer}>
                  {mockTasks.map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={[
                        styles.taskButton,
                        formData.taskId === task.id && styles.selectedTask
                      ]}
                      onPress={() => setFormData({ ...formData, taskId: task.id })}
                    >
                      <View 
                        style={[
                          styles.taskButtonIndicator, 
                          { backgroundColor: task.color }
                        ]} 
                      />
                      <Text style={[
                        styles.taskButtonText,
                        formData.taskId === task.id && styles.selectedTaskText
                      ]}>
                        {task.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>実行状況</Text>
                <View style={styles.statusContainer}>
                  {[
                    { value: 'completed', label: '完了', color: '#10B981' },
                    { value: 'failed', label: '未実行', color: '#EF4444' },
                    { value: 'delayed', label: '遅れて開始', color: '#F59E0B' },
                  ].map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusButton,
                        formData.status === status.value && styles.selectedStatus,
                        formData.status === status.value && { borderColor: status.color }
                      ]}
                      onPress={() => setFormData({ ...formData, status: status.value })}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        formData.status === status.value && { color: status.color }
                      ]}>
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Failure Tags (only show if status is failed) */}
              {formData.status === 'failed' && (
                <View style={styles.formGroup}>
                  <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>未実行の理由</Text>
                    <TouchableOpacity 
                      style={styles.addTagButton}
                      onPress={() => setTagModalVisible(true)}
                    >
                      <Plus size={16} color="#3B82F6" />
                      <Text style={styles.addTagText}>タグを追加</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagsGrid}>
                    {userTags
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .map((tag) => (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.tagButton,
                            formData.failureTagIds.includes(tag.id) && styles.selectedTag
                          ]}
                          onPress={() => toggleFailureTag(tag.id)}
                        >
                          <Text style={[
                            styles.tagButtonText,
                            formData.failureTagIds.includes(tag.id) && styles.selectedTagText
                          ]}>
                            {tag.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              )}

              {/* Memo */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>メモ（任意）</Text>
                <TextInput
                  style={styles.memoInput}
                  value={formData.memo}
                  onChangeText={(text) => setFormData({ ...formData, memo: text })}
                  placeholder="今日の振り返りや感想を入力..."
                  multiline
                  numberOfLines={3}
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

      {/* Add Tag Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => setTagModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tagModalContent}>
            <Text style={styles.tagModalTitle}>新しいタグを追加</Text>
            <TextInput
              style={styles.tagInput}
              value={newTagName}
              onChangeText={setNewTagName}
              placeholder="タグ名を入力"
              autoFocus
            />
            <View style={styles.tagModalButtons}>
              <TouchableOpacity 
                style={styles.tagCancelButton}
                onPress={() => {
                  setTagModalVisible(false);
                  setNewTagName('');
                }}
              >
                <Text style={styles.tagCancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tagSaveButton}
                onPress={handleAddTag}
              >
                <Text style={styles.tagSaveText}>追加</Text>
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
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskColorIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recordStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  editButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  memoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  memoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
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
  formLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  taskContainer: {
    gap: 8,
  },
  taskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedTask: {
    backgroundColor: '#eff6ff',
    borderColor: '#3B82F6',
  },
  taskButtonIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  taskButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTaskText: {
    color: '#3B82F6',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  selectedStatus: {
    backgroundColor: '#f9fafb',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedTag: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tagButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTagText: {
    color: '#ffffff',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
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
  // Tag Modal Styles
  tagModalContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 40,
    marginVertical: 'auto',
    borderRadius: 12,
    padding: 20,
  },
  tagModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  tagModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  tagCancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tagSaveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagSaveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});