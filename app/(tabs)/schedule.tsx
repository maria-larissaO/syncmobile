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
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  User,
  Users,
  Check,
} from 'lucide-react-native';
import Header from '@/syncmobile/components/Header';
import { supabase } from '@/syncmobile/lib/supabase';
import { Appointment } from '@/types/database';

interface Patient {
  id: string;
  name: string;
}

import { TeamMember } from '@/types/database';

export default function ScheduleScreen() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  // New Appointment State
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    teamMemberId: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  async function loadAppointments() {
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(name)')
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString())
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      console.log('Appointments loaded:', data); // Debug log
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async function loadTeamMembers() {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  }

  async function addAppointment() {
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time || !newAppointment.teamMemberId) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (incluindo profissional)');
      return;
    }

    setSubmitting(true);
    try {
      // Combine date and time
      const dateTimeString = `${newAppointment.date}T${newAppointment.time}:00`;
      const appointmentDate = new Date(dateTimeString);

      if (isNaN(appointmentDate.getTime())) {
        Alert.alert('Erro', 'Data ou hora inválida. Use o formato YYYY-MM-DD e HH:MM');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('appointments').insert([
        {
          patient_id: newAppointment.patientId,
          team_member_id: newAppointment.teamMemberId,
          appointment_date: appointmentDate.toISOString(),
          duration_minutes: parseInt(newAppointment.duration) || 60,
          notes: newAppointment.notes,
          status: 'pending', // Default to pending to allow confirmation flow
        },
      ]);

      if (error) throw error;

      setModalVisible(false);
      setNewAppointment({
        patientId: '',
        teamMemberId: '',
        date: '',
        time: '',
        duration: '60',
        notes: '',
      });
      loadAppointments(); // Refresh list
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Erro', 'Não foi possível criar o agendamento');
    } finally {
      setSubmitting(false);
    }
  }

  function openNewAppointmentModal() {
    // Pre-fill date with selected date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().slice(0, 5);

    setNewAppointment(prev => ({ ...prev, date: dateStr, time: timeStr }));
    loadPatients();
    loadTeamMembers();
    setModalVisible(true);
  }

  async function toggleAppointmentStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      loadAppointments(); // Refresh list
    } catch (error) {
      console.error('Error updating appointment:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do agendamento');
    }
  }

  function changeDate(days: number) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  }

  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed'
  );
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === 'pending'
  );
  const occupancyRate =
    appointments.length > 0 ? Math.round((appointments.length / 10) * 100) : 0;

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
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Agenda Inteligente</Text>
            <Text style={styles.subtitle}>
              Gerencie consultas com sugestões automáticas
            </Text>
          </View>
        </View>

        <View style={styles.calendarHeader}>
          <View style={styles.dateSelector}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => changeDate(-1)}>
              <ChevronLeft size={20} color="#495057" />
            </TouchableOpacity>
            <View style={styles.dateInfo}>
              <CalendarIcon size={20} color="#17a2b8" />
              <View style={styles.dateText}>
                <Text style={styles.dateDay}>
                  {selectedDate.getDate()} de{' '}
                  {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}
                </Text>
                <Text style={styles.dateYear}>de {selectedDate.getFullYear()}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => changeDate(1)}>
              <ChevronRight size={20} color="#495057" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewModeSelector}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'day' && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode('day')}>
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === 'day' && styles.viewModeTextActive,
                ]}>
                Dia
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'week' && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode('week')}>
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === 'week' && styles.viewModeTextActive,
                ]}>
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'month' && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode('month')}>
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === 'month' && styles.viewModeTextActive,
                ]}>
                Mês
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.newAppointmentButton}
            onPress={openNewAppointmentModal}>
            <Plus size={16} color="#ffffff" />
            <Text style={styles.newAppointmentText}>Novo Agendamento</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.sectionsRow}>
            <View style={styles.appointmentsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Consultas do Dia</Text>
                <Text style={styles.sectionBadge}>
                  {appointments.length} agendamentos
                </Text>
              </View>
              <View style={styles.appointmentsList}>
                {appointments.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      Nenhuma consulta agendada para este dia
                    </Text>
                    <TouchableOpacity
                      style={styles.scheduleButton}
                      onPress={openNewAppointmentModal}>
                      <Plus size={16} color="#17a2b8" />
                      <Text style={styles.scheduleButtonText}>
                        Agendar Consulta
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  appointments.map((appointment) => (
                    <View key={appointment.id} style={styles.appointmentItem}>
                      <View style={styles.appointmentTime}>
                        <Text style={styles.timeText}>
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <View style={styles.appointmentDetails}>
                        <Text style={styles.patientName}>
                          {appointment.patients?.name || 'Paciente'}
                        </Text>
                        <Text style={styles.appointmentType}>
                          Consulta ({appointment.duration_minutes} min)
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          appointment.status === 'confirmed'
                            ? styles.statusButtonConfirmed
                            : styles.statusButtonPending,
                        ]}
                        onPress={() => toggleAppointmentStatus(appointment.id, appointment.status)}>
                        <Text style={styles.statusButtonText}>
                          {appointment.status === 'confirmed' ? 'Concluída' : 'Pendente'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Estatísticas do Dia</Text>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Taxa de Ocupação</Text>
                <Text style={styles.statValue}>{occupancyRate}%</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total de Consultas</Text>
                <Text style={styles.statValue}>{appointments.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Confirmadas</Text>
                <Text style={[styles.statValue, { color: '#28a745' }]}>
                  {confirmedAppointments.length}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Pendentes</Text>
                <Text style={[styles.statValue, { color: '#ffc107' }]}>
                  {pendingAppointments.length}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Agendamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Paciente *</Text>
                <View style={styles.patientSelector}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {patients.map(p => (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.patientChip,
                          newAppointment.patientId === p.id && styles.patientChipActive
                        ]}
                        onPress={() => setNewAppointment({ ...newAppointment, patientId: p.id })}
                      >
                        <User size={14} color={newAppointment.patientId === p.id ? '#fff' : '#495057'} />
                        <Text style={[
                          styles.patientChipText,
                          newAppointment.patientId === p.id && styles.patientChipTextActive
                        ]}>{p.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Profissional *</Text>
                <View style={styles.patientSelector}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {teamMembers.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        style={[
                          styles.patientChip,
                          newAppointment.teamMemberId === m.id && styles.patientChipActive
                        ]}
                        onPress={() => setNewAppointment({ ...newAppointment, teamMemberId: m.id })}
                      >
                        <Users size={14} color={newAppointment.teamMemberId === m.id ? '#fff' : '#495057'} />
                        <Text style={[
                          styles.patientChipText,
                          newAppointment.teamMemberId === m.id && styles.patientChipTextActive
                        ]}>{m.name.split(' ')[0]}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Data (YYYY-MM-DD) *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAppointment.date}
                    onChangeText={(text) => setNewAppointment({ ...newAppointment, date: text })}
                    placeholder="2024-01-01"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Hora (HH:MM) *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAppointment.time}
                    onChangeText={(text) => setNewAppointment({ ...newAppointment, time: text })}
                    placeholder="14:30"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Duração (minutos)</Text>
                <View style={styles.durationSelector}>
                  {['30', '45', '60', '90'].map(dur => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.durationChip,
                        newAppointment.duration === dur && styles.durationChipActive
                      ]}
                      onPress={() => setNewAppointment({ ...newAppointment, duration: dur })}
                    >
                      <Clock size={14} color={newAppointment.duration === dur ? '#fff' : '#495057'} />
                      <Text style={[
                        styles.durationChipText,
                        newAppointment.duration === dur && styles.durationChipTextActive
                      ]}>{dur} min</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newAppointment.notes}
                  onChangeText={(text) => setNewAppointment({ ...newAppointment, notes: text })}
                  placeholder="Procedimento, detalhes, etc."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addAppointment}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  calendarHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateButton: {
    padding: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  dateText: {
    marginLeft: 12,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  dateYear: {
    fontSize: 12,
    color: '#6c757d',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#17a2b8',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  viewModeTextActive: {
    color: '#ffffff',
  },
  newAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17a2b8',
    paddingVertical: 12,
    borderRadius: 8,
  },
  newAppointmentText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
  },
  sectionsRow: {
    padding: 20,
  },
  appointmentsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  sectionBadge: {
    fontSize: 12,
    color: '#6c757d',
  },
  appointmentsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#17a2b8',
  },
  scheduleButtonText: {
    color: '#17a2b8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
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
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonPending: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  statusButtonConfirmed: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusConfirmed: {
    backgroundColor: '#28a745',
  },
  statusPending: {
    backgroundColor: '#ffc107',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  patientSelector: {
    flexDirection: 'row',
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  patientChipActive: {
    backgroundColor: '#17a2b8',
    borderColor: '#17a2b8',
  },
  patientChipText: {
    fontSize: 14,
    color: '#495057',
  },
  patientChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  durationSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  durationChipActive: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  durationChipText: {
    fontSize: 14,
    color: '#495057',
  },
  durationChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  saveButton: {
    backgroundColor: '#17a2b8',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
