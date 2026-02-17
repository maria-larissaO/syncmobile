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
  Users,
  Calendar,
  CheckCircle2,
  Activity,
  Plus,
  AlertTriangle,
  Leaf,
} from 'lucide-react-native';
import Header from '@/syncmobile/components/Header';
import StatCard from '@/syncmobile/components/StatCard';
import { supabase } from '@/syncmobile/lib/supabase';
import { Patient, Appointment, Treatment, AIAnalysis } from '@/types/database';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activePatients, setActivePatients] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [pendingTreatments, setPendingTreatments] = useState(0);
  const [todayAnalyses, setTodayAnalyses] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [aiAlerts, setAiAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: patients } = await supabase
        .from('patients')
        .select('*')
        .eq('status', 'active');

      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, patients(name)')
        .gte('appointment_date', today.toISOString())
        .lt('appointment_date', tomorrow.toISOString());

      const { data: treatments } = await supabase
        .from('treatments')
        .select('*')
        .eq('status', 'pending');

      const { data: analyses } = await supabase
        .from('ai_analyses')
        .select('*, patients(name)')
        .gte('analyzed_at', today.toISOString());

      const { data: upcoming } = await supabase
        .from('appointments')
        .select('*, patients(name)')
        .gte('appointment_date', today.toISOString())
        .order('appointment_date', { ascending: true })
        .limit(5);

      const { data: alerts } = await supabase
        .from('ai_analyses')
        .select('*, patients(name)')
        .in('severity', ['high', 'critical'])
        .order('analyzed_at', { ascending: false })
        .limit(3);

      setActivePatients(patients?.length || 0);
      setTodayAppointments(appointments?.length || 0);
      setPendingTreatments(treatments?.length || 0);
      setTodayAnalyses(analyses?.length || 0);
      setUpcomingAppointments(upcoming || []);
      setAiAlerts(alerts || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

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
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Visão geral da sua clínica odontológica
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}>
          <StatCard
            icon={<Users size={24} color="#17a2b8" />}
            title="Pacientes Ativos"
            value={activePatients}
            subtitle="Total cadastrados"
            iconBackgroundColor="#e7f5f7"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<Calendar size={24} color="#4169e1" />}
            title="Consultas Hoje"
            value={todayAppointments}
            subtitle="Agendamentos do dia"
            iconBackgroundColor="#e6f0ff"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<CheckCircle2 size={24} color="#ff8c00" />}
            title="Tratamentos Pendentes"
            value={pendingTreatments}
            subtitle="Em andamento"
            iconBackgroundColor="#fff4e6"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<Activity size={24} color="#9370db" />}
            title="Análises com IA"
            value={todayAnalyses}
            subtitle="Realizadas hoje"
            iconBackgroundColor="#f3ebff"
          />
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Calendar size={20} color="#17a2b8" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.sectionTitle}>Próximos Atendimentos</Text>
                <Text style={styles.sectionSubtitle}>
                  Hoje, 17 de fevereiro
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={16} color="#17a2b8" />
              <Text style={styles.addButtonText}>Agendar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {upcomingAppointments.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum atendimento agendado
              </Text>
            ) : (
              upcomingAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.timeText}>
                      {new Date(appointment.appointment_date).toLocaleTimeString(
                        'pt-BR',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.patientName}>
                      {appointment.patients?.name || 'Paciente'}
                    </Text>
                    <Text style={styles.appointmentType}>
                      Consulta ({appointment.duration_minutes}min)
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Activity size={20} color="#9370db" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.sectionTitle}>Alertas da IA</Text>
                <Text style={styles.sectionSubtitle}>
                  Sugestões para atenção
                </Text>
              </View>
            </View>
          </View>
          {aiAlerts.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Nenhum alerta no momento</Text>
            </View>
          ) : (
            aiAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertIcon}>
                  <AlertTriangle size={20} color="#dc3545" />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertPatient}>
                    {alert.patients?.name || 'Paciente'}
                  </Text>
                  <Text style={styles.alertText}>{alert.result}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>Ver</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.sustainabilityCard}>
          <Leaf size={20} color="#28a745" />
          <View style={styles.sustainabilityContent}>
            <Text style={styles.sustainabilityTitle}>
              Impacto Sustentável
            </Text>
            <Text style={styles.sustainabilityText}>
              Este mês você economizou
            </Text>
            <Text style={styles.sustainabilityValue}>
              2.847 folhas de papel 📄
            </Text>
          </View>
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
  },
  statsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6c757d',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#17a2b8',
  },
  addButtonText: {
    color: '#17a2b8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
  },
  appointmentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  appointmentTime: {
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17a2b8',
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: '#6c757d',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffe0e0',
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertPatient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    color: '#6c757d',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  viewButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
  },
  sustainabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  sustainabilityContent: {
    marginLeft: 12,
    flex: 1,
  },
  sustainabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 2,
  },
  sustainabilityText: {
    fontSize: 12,
    color: '#155724',
    marginBottom: 4,
  },
  sustainabilityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#155724',
  },
});
