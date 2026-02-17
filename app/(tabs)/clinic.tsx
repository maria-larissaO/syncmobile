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
  DollarSign,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react-native';
import {
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Header from '@/syncmobile/components/Header';
import StatCard from '@/syncmobile/components/StatCard';
import { supabase } from '@/syncmobile/lib/supabase';
import { TeamMember } from '@/types/database';

export default function ClinicManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const [activeTab, setActiveTab] = useState<
    'equipe' | 'financeiro' | 'config'
  >('equipe');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  async function loadTeamMembers() {
    try {
      // 1. Fetch active team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (membersError) throw membersError;

      // 2. Fetch today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('team_member_id')
        .gte('appointment_date', today.toISOString())
        .lt('appointment_date', tomorrow.toISOString());

      if (aptError) throw aptError;

      // 3. Calculate counts
      const counts: Record<string, number> = {};
      appointments?.forEach((apt) => {
        if (apt.team_member_id) {
          counts[apt.team_member_id] = (counts[apt.team_member_id] || 0) + 1;
        }
      });

      // 4. Merge counts with members
      const membersWithCounts = members?.map((member) => ({
        ...member,
        consultations_today: counts[member.id] || 0,
      }));

      setTeamMembers(membersWithCounts || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addTeamMember() {
    if (!newMember.name || !newMember.role || !newMember.email) {
      Alert.alert('Erro', 'Preencha nome, cargo e email');
      return;
    }

    setSubmitting(true);
    try {
      // Generate initials
      const names = newMember.name.trim().split(' ');
      let initials = names[0][0].toUpperCase();
      if (names.length > 1) {
        initials += names[names.length - 1][0].toUpperCase();
      } else if (newMember.name.length > 1) {
        initials += newMember.name[1].toUpperCase();
      }

      const { error } = await supabase.from('team_members').insert([
        {
          name: newMember.name,
          role: newMember.role,
          email: newMember.email,
          phone: newMember.phone,
          initials: initials,
          status: 'active',
          consultations_today: 0,
        },
      ]);

      if (error) throw error;

      setModalVisible(false);
      setNewMember({
        name: '',
        role: '',
        email: '',
        phone: '',
      });
      loadTeamMembers();
      Alert.alert('Sucesso', 'Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding team member:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o membro');
    } finally {
      setSubmitting(false);
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
            <Text style={styles.title}>Gestão da Clínica</Text>
            <Text style={styles.subtitle}>
              Gerencie equipe, finanças e operações
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}>
          <StatCard
            icon={<Users size={24} color="#17a2b8" />}
            title="Funcionários Ativos"
            value={teamMembers.length}
            subtitle="+2 este mês"
            iconBackgroundColor="#e7f5f7"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<DollarSign size={24} color="#28a745" />}
            title="Receita Mensal"
            value="R$ 85.420"
            subtitle="+12% vs mês anterior"
            iconBackgroundColor="#d4edda"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<Calendar size={24} color="#9370db" />}
            title="Taxa de Ocupação"
            value="87%"
            subtitle="Ótima utilização"
            iconBackgroundColor="#f3ebff"
          />
          <View style={{ width: 12 }} />
          <StatCard
            icon={<Clock size={24} color="#ff8c00" />}
            title="Tempo Médio"
            value="42min"
            subtitle="Por consulta"
            iconBackgroundColor="#fff4e6"
          />
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'equipe' && styles.activeTab]}
            onPress={() => setActiveTab('equipe')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'equipe' && styles.activeTabText,
              ]}>
              Equipe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'financeiro' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('financeiro')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'financeiro' && styles.activeTabText,
              ]}>
              Financeiro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'config' && styles.activeTab]}
            onPress={() => setActiveTab('config')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'config' && styles.activeTabText,
              ]}>
              Configurações
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'equipe' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Membros da Equipe</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Plus size={16} color="#ffffff" />
                <Text style={styles.addButtonText}>Adicionar Membro</Text>
              </TouchableOpacity>
            </View>

            {teamMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>{member.initials}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                <View style={styles.memberStats}>
                  <Text style={styles.statsLabel}>Consultas Hoje</Text>
                  <Text style={styles.statsValue}>
                    {member.consultations_today}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Ativo</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'financeiro' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
            <View style={styles.financialCard}>
              <View style={styles.financialItem}>
                <TrendingUp size={20} color="#28a745" />
                <View style={styles.financialInfo}>
                  <Text style={styles.financialLabel}>Receita Total</Text>
                  <Text style={styles.financialValue}>R$ 85.420</Text>
                  <Text style={styles.financialChange}>+12% este mês</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Módulo financeiro completo em desenvolvimento
              </Text>
            </View>
          </View>
        )}


        {activeTab === 'config' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Configurações da clínica em desenvolvimento
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Membro da Equipe</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.name}
                  onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                  placeholder="Dr. João Silva"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cargo / Especialidade *</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.role}
                  onChangeText={(text) => setNewMember({ ...newMember, role: text })}
                  placeholder="Ortodontista"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.email}
                  onChangeText={(text) => setNewMember({ ...newMember, email: text })}
                  placeholder="joao@clinic.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={newMember.phone}
                  onChangeText={(text) => setNewMember({ ...newMember, phone: text })}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addTeamMember}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
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
  statsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#17a2b8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabText: {
    color: '#17a2b8',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17a2b8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#17a2b8',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#6c757d',
  },
  memberStats: {
    alignItems: 'center',
    marginRight: 16,
  },
  statsLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17a2b8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: '#28a745',
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
  },
  financialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financialInfo: {
    marginLeft: 16,
  },
  financialLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  financialChange: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#d1ecf1',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
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
    elevation: 5,
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
