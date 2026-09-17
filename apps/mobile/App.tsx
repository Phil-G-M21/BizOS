import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { appConfig, dashboardData } from '@bizos/shared';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.eyebrow}>Operations</Text>
        <Text style={styles.title}>{appConfig.name}</Text>
        <Text style={styles.subtitle}>Business dashboard</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total revenue</Text>
          <Text style={styles.heroValue}>{dashboardData.revenue.total}</Text>
          <Text style={styles.heroTrend}>{dashboardData.revenue.trend}</Text>
        </View>

        <View style={styles.grid}>
          {dashboardData.metrics.map((metric) => (
            <View key={metric.label} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={[styles.metricChange, metric.positive ? styles.positive : styles.negative]}>
                {metric.change}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {dashboardData.activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.dot} />
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDetail}>{activity.detail}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 72,
  },
  eyebrow: {
    color: '#34d399',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroValue: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 10,
  },
  heroTrend: {
    color: '#34d399',
    fontSize: 14,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  metricChange: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  positive: {
    color: '#34d399',
  },
  negative: {
    color: '#fca5a5',
  },
  listCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    marginTop: 8,
    marginRight: 10,
  },
  activityCopy: {
    flex: 1,
  },
  activityTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  activityDetail: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 4,
  },
  activityTime: {
    color: '#94a3b8',
    fontSize: 11,
    marginLeft: 8,
  },
});
