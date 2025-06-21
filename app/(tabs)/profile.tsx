import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Tag, Crown, ChartBar as BarChart3, Calendar, Clock, Target, TrendingUp, ChevronRight, Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';

// Mock data for demonstration
const userStats = {
  totalTasks: 156,
  completedTasks: 132,
  completionRate: 85,
  currentStreak: 7,
  longestStreak: 21,
  totalDays: 45,
};

const mockUserTags = [
  { id: '1', name: '天気が悪い', usageCount: 5 },
  { id: '2', name: 'やる気が出ない', usageCount: 8 },
  { id: '3', name: '時間がない', usageCount: 12 },
  { id: '4', name: '体調不良', usageCount: 3 },
  { id: '5', name: '他の用事', usageCount: 7 },
];

const weeklyData = [
  { day: '月', completed: 3, total: 3 },
  { day: '火', completed: 2, total: 3 },
  { day: '水', completed: 3, total: 3 },
  { day: '木', completed: 1, total: 3 },
  { day: '金', completed: 3, total: 3 },
  { day: '土', completed: 2, total: 2 },
  { day: '日', completed: 2, total: 2 },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reviewNotificationEnabled, setReviewNotificationEnabled] = useState(true);
  const [userTags, setUserTags] = useState(mockUserTags);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');

  const openAddTagModal = () => {
    setEditingTag(null);
    setTagName('');
    setTagModalVisible(true);
  };

  const openEditTagModal = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagModalVisible(true);
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) {
      Alert.alert('エラー', 'タグ名を入力してください');
      return;
    }

    if (editingTag) {
      setUserTags(userTags.map(tag => 
        tag.id === editingTag.id ? { ...tag, name: tagName.trim() } : tag
      ));
    } else {
      const newTag = {
        id: Date.now().toString(),
        name: tagName.trim(),
        usageCount: 0,
      };
      setUserTags([...userTags, newTag]);
    }

    setTagModalVisible(false);
    setTagName('');
  };

  const handleDeleteTag = (tagId) => {
    Alert.alert(
      '削除確認',
      'このタグを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => setUserTags(userTags.filter(tag => tag.id !== tagId))
        }
      ]
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = '#3B82F6' }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Icon size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const SettingItem = ({ title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プロフィール</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <User size={32} color="#ffffff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>ユーザー名</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
          <TouchableOpacity style={styles.premiumBadge}>
            <Crown size={16} color="#F59E0B" />
            <Text style={styles.premiumText}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今週の進捗</Text>
          <View style={styles.weeklyChart}>
            {weeklyData.map((data, index) => (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.dayBars}>
                  <View 
                    style={[
                      styles.totalBar, 
                      { height: data.total * 8 + 8 }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.completedBar, 
                      { height: data.completed * 8 + 8 }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>統計情報</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="総実行回数"
              value={userStats.completedTasks}
              subtitle={`${userStats.totalTasks}回中`}
              icon={Target}
              color="#10B981"
            />
            <StatCard
              title="成功率"
              value={`${userStats.completionRate}%`}
              icon={TrendingUp}
              color="#3B82F6"
            />
            <StatCard
              title="現在の連続日数"
              value={`${userStats.currentStreak}日`}
              icon={Calendar}
              color="#F59E0B"
            />
            <StatCard
              title="最長連続日数"
              value={`${userStats.longestStreak}日`}
              icon={BarChart3}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Tag Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>タグ管理</Text>
            <TouchableOpacity 
              style={styles.addTagButton}
              onPress={openAddTagModal}
            >
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addTagText}>追加</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsList}>
            {userTags
              .sort((a, b) => b.usageCount - a.usageCount)
              .map((tag) => (
                <View key={tag.id} style={styles.tagItem}>
                  <View style={styles.tagInfo}>
                    <Text style={styles.tagName}>{tag.name}</Text>
                    <Text style={styles.tagUsage}>使用回数: {tag.usageCount}</Text>
                  </View>
                  <View style={styles.tagActions}>
                    <TouchableOpacity 
                      style={styles.tagActionButton}
                      onPress={() => openEditTagModal(tag)}
                    >
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.tagActionButton}
                      onPress={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>設定</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              title="通知設定"
              subtitle="タスクの開始通知"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                  thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
                />
              }
            />
            <SettingItem
              title="振り返り通知"
              subtitle="日次の実行記録確認"
              rightElement={
                <Switch
                  value={reviewNotificationEnabled}
                  onValueChange={setReviewNotificationEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                  thumbColor={reviewNotificationEnabled ? '#3B82F6' : '#9CA3AF'}
                />
              }
            />
            <SettingItem
              title="通知タイミング設定"
              subtitle="個別の通知時間を設定"
              onPress={() => Alert.alert('設定', '通知タイミング設定画面')}
            />
            <SettingItem
              title="アカウント設定"
              subtitle="プロフィール情報の編集"
              onPress={() => Alert.alert('設定', 'アカウント設定画面')}
            />
            <SettingItem
              title="Premium機能"
              subtitle="プランの管理と課金設定"
              onPress={() => Alert.alert('Premium', 'Premium機能の詳細')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Tag Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => setTagModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tagModalContent}>
            <View style={styles.tagModalHeader}>
              <Text style={styles.tagModalTitle}>
                {editingTag ? 'タグを編集' : '新しいタグを追加'}
              </Text>
              <TouchableOpacity onPress={() => setTagModalVisible(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.tagInput}
              value={tagName}
              onChangeText={setTagName}
              placeholder="タグ名を入力"
              autoFocus
            />
            <View style={styles.tagModalButtons}>
              <TouchableOpacity 
                style={styles.tagCancelButton}
                onPress={() => setTagModalVisible(false)}
              >
                <Text style={styles.tagCancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tagSaveButton}
                onPress={handleSaveTag}
              >
                <Text style={styles.tagSaveText}>
                  {editingTag ? '更新' : '追加'}
                </Text>
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
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
    marginLeft: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayBars: {
    position: 'relative',
    marginBottom: 8,
  },
  totalBar: {
    width: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  completedBar: {
    width: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tagsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  tagUsage: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagActions: {
    flexDirection: 'row',
    gap: 8,
  },
  tagActionButton: {
    padding: 4,
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagModalContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 40,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  tagModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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