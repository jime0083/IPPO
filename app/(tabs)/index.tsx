import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Plus, Calendar, Zap, FileText } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const todayTasks = [
  {
    id: '1',
    title: '英語学習',
    scheduledTime: '07:00',
    category: '勉強',
    color: '#3B82F6',
    status: 'pending',
    notificationMinutesBefore: 10,
  },
  {
    id: '2',
    title: 'ジョギング',
    scheduledTime: '06:30',
    category: '運動',
    color: '#10B981',
    status: 'completed',
    notificationMinutesBefore: 15,
  },
  {
    id: '3',
    title: '読書',
    scheduledTime: '21:00',
    category: '勉強',
    color: '#8B5CF6',
    status: 'failed',
    notificationMinutesBefore: 5,
  },
];

const weeklyStats = {
  totalTasks: 21,
  completedTasks: 16,
  completionRate: 76,
};

export default function HomeScreen() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10B981" />;
      case 'failed':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'failed':
        return '未実行';
      default:
        return '予定';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>おはようございます</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Weekly Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Calendar size={20} color="#3B82F6" />
            <Text style={styles.statsTitle}>今週の成績</Text>
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyStats.completedTasks}</Text>
              <Text style={styles.statLabel}>完了</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyStats.totalTasks}</Text>
              <Text style={styles.statLabel}>総数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>
                {weeklyStats.completionRate}%
              </Text>
              <Text style={styles.statLabel}>成功率</Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>今日のタスク</Text>
          </View>

          {todayTasks.map((task) => (
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
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskCategory}>{task.category}</Text>
                  </View>
                </View>
                <View style={styles.taskStatus}>
                  {getStatusIcon(task.status)}
                  <Text 
                    style={[
                      styles.statusText, 
                      { color: getStatusColor(task.status) }
                    ]}
                  >
                    {getStatusText(task.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.taskFooter}>
                <Text style={styles.taskTime}>
                  <Clock size={14} color="#6B7280" /> {task.scheduledTime}
                </Text>
                <Text style={styles.taskNotification}>
                  {task.notificationMinutesBefore}分前に通知
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.quickActionText}>新しいタスク</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <FileText size={20} color="#3B82F6" />
            <Text style={styles.quickActionText}>記録を追加</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
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
  statsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  taskInfo: {
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
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  taskCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskNotification: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 8,
  },
});