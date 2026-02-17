import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import Header from '@/syncmobile/components/Header';
import StatCard from '@/syncmobile/components/StatCard';
import { supabase } from '@/syncmobile/lib/supabase';

export default function ReportsScreen() {
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [completedConsultations, setCompletedConsultations] = useState(0);
  const [cancelledConsultations, setCancelledConsultations] = useState(0);
  const [newPatients, setNewPatients] = useState(0);
  const [previousWeekTotal, setPreviousWeekTotal] = useState(0);
  const [dailyConsultations, setDailyConsultations] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    loadReportData();
  }, [weekOffset]);

  async function loadReportData() {
    try {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + weekOffset * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const prevWeekStart = new Date(weekStart);
      prevWeekStart.setDate(weekStart.getDate() - 7);

      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', weekStart.toISOString())
        .lt('appointment_date', weekEnd.toISOString());

      const { data: prevAppointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', prevWeekStart.toISOString())
        .lt('appointment_date', weekStart.toISOString());

      const { data: patients } = await supabase
        .from('patients')
        .select('*')
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString());

      const completed = appointments?.filter((apt) => apt.status === 'confirmed')
        .length || 0;
      const cancelled = appointments?.filter((apt) => apt.status === 'cancelled')
        .length || 0;

      // Calculate daily distribution
      const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
      appointments?.forEach((apt) => {
        const date = new Date(apt.appointment_date);
        const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
        dailyCounts[dayIndex]++;
      });

      setTotalConsultations(appointments?.length || 0);
      setCompletedConsultations(completed);
      setCancelledConsultations(cancelled);
      setNewPatients(patients?.length || 0);
      setPreviousWeekTotal(prevAppointments?.length || 0);
      setDailyConsultations(dailyCounts);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getWeekDateRange() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
  }

  function getWeekLabel() {
    if (weekOffset === 0) return 'Atual';
    if (weekOffset === -1) return 'Semana anterior';
    if (weekOffset === 1) return 'Próxima';
    return weekOffset > 0 ? 'Futura' : 'Passada';
  }

  const percentageChange =
    previousWeekTotal > 0
      ? Math.round(
        ((totalConsultations - previousWeekTotal) / previousWeekTotal) * 100
      )
      : 0;
  const completionRate =
    totalConsultations > 0
      ? Math.round((completedConsultations / totalConsultations) * 100)
      : 0;
  const cancellationRate =
    totalConsultations > 0
      ? Math.round((cancelledConsultations / totalConsultations) * 100)
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17a2b8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Relatório Semanal</Text>
            <Text style={styles.subtitle}>{getWeekDateRange()}</Text>
          </View>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              style={styles.weekButton}
              onPress={() => setWeekOffset(weekOffset - 1)}>
              <ChevronLeft size={20} color="#495057" />
            </TouchableOpacity>
            <View style={styles.weekLabel}>
              <Text style={styles.weekLabelText}>{getWeekLabel()}</Text>
            </View>
            <TouchableOpacity
              style={styles.weekButton}
              onPress={() => setWeekOffset(weekOffset + 1)}>
              <ChevronRight size={20} color="#495057" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}>
          <StatCard
            icon={<Calendar size={24} color="#4169e1" />}
            title="Total Consultas"
            value={totalConsultations}
            subtitle={
              percentageChange !== 0
                ? `${percentageChange > 0 ? '+' : ''}${percentageChange}% vs semana anterior`
                : 'Sem dados anteriores'
            }
            iconBackgroundColor="#e6f0ff"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<TrendingUp size={24} color="#28a745" />}
            title="Concluídas"
            value={completedConsultations}
            subtitle={`Taxa de ${completionRate}%`}
            iconBackgroundColor="#d4edda"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<TrendingDown size={24} color="#dc3545" />}
            title="Canceladas"
            value={cancelledConsultations}
            subtitle={`${cancellationRate}% do total`}
            iconBackgroundColor="#f8d7da"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<Users size={24} color="#9370db" />}
            title="Novos Pacientes"
            value={newPatients}
            subtitle={`${newPatients} total cadastrados`}
            iconBackgroundColor="#f3ebff"
          />
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <FileText size={20} color="#17a2b8" />
              <Text style={styles.sectionTitle}>
                Consultas por Dia da Semana
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.chartTitle}>Distribuição diária de atendimentos</Text>
            <View style={styles.chartPlaceholder}>
              <FileText size={48} color="#adb5bd" />
              {totalConsultations === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhuma consulta nesta semana
                </Text>
              ) : (
                <View style={styles.weekDaysList}>
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(
                    (day, index) => (
                      <View key={day} style={styles.weekDayItem}>
                        <Text style={styles.weekDayName}>{day}</Text>
                        <View
                          style={[
                            styles.weekDayBar,
                            {
                              height: Math.max(
                                20,
                                (dailyConsultations[index] / (Math.max(...dailyConsultations) || 1)) * 100
                              ),
                              backgroundColor: dailyConsultations[index] > 0 ? '#17a2b8' : '#e9ecef',
                            },
                          ]}
                        />
                        <Text style={styles.weekDayValue}>
                          {dailyConsultations[index]}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Análise Detalhada</Text>
          <Text style={styles.infoText}>
            Recursos avançados de relatórios e analytics em desenvolvimento
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekButton: {
    padding: 8,
  },
  weekLabel: {
    paddingHorizontal: 20,
  },
  weekLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17a2b8',
  },
  statsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  chartTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  weekDaysList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
  },
  weekDayItem: {
    alignItems: 'center',
    gap: 8,
  },
  weekDayName: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
  },
  weekDayBar: {
    width: 32,
    backgroundColor: '#17a2b8',
    borderRadius: 4,
  },
  weekDayValue: {
    fontSize: 12,
    color: '#212529',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#d1ecf1',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c5460',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    lineHeight: 20,
  },
});
