import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Search, Plus, User, Phone, Mail, X, Pencil } from 'lucide-react-native';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { Patient } from '@/types/database';

export default function PatientsScreen() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(patient?: Patient) {
    if (patient) {
      setEditingPatientId(patient.id);
      setNewPatient({
        name: patient.name,
        email: patient.email || '',
        phone: patient.phone || '',
        birthDate: patient.birth_date || '',
        address: patient.address || '',
        notes: patient.notes || '',
      });
    } else {
      setEditingPatientId(null);
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        notes: '',
      });
    }
    setModalVisible(true);
  }

  async function addOrUpdatePatient() {
    if (!newPatient.name) {
      alert('Nome é obrigatório');
      return;
    }

    if (newPatient.birthDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(newPatient.birthDate)) {
        alert('Data de nascimento deve estar no formato YYYY-MM-DD');
        return;
      }
    }

    setAdding(true);
    try {
      const patientData = {
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        birth_date: newPatient.birthDate || null,
        address: newPatient.address,
        notes: newPatient.notes,
        status: 'active',
      };

      let error;
      if (editingPatientId) {
        // Update existing patient
        const { error: updateError } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', editingPatientId);
        error = updateError;
      } else {
        // Insert new patient
        const { error: insertError } = await supabase
          .from('patients')
          .insert([patientData]);
        error = insertError;
      }

      if (error) throw error;

      setModalVisible(false);
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        notes: '',
      });
      setEditingPatientId(null);
      loadPatients();
      alert(editingPatientId ? 'Paciente atualizado!' : 'Paciente adicionado!');
    } catch (error: any) {
      console.error('Error saving patient:', error);
      alert(`Erro ao salvar paciente: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setAdding(false);
    }
  }

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={styles.title}>Lista de Pacientes</Text>
            <Text style={styles.subtitle}>
              Gerencie todos os pacientes cadastrados
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6c757d" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar paciente..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#adb5bd"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleOpenModal()}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}>
          {filteredPatients.map((patient) => (
            <View key={patient.id} style={styles.patientCard}>
              <View style={styles.patientContent}>
                <View style={styles.avatar}>
                  <User size={24} color="#17a2b8" />
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <View style={styles.contactInfo}>
                    {patient.phone && (
                      <View style={styles.contactItem}>
                        <Phone size={12} color="#6c757d" />
                        <Text style={styles.contactText}>{patient.phone}</Text>
                      </View>
                    )}
                    {patient.email && (
                      <View style={styles.contactItem}>
                        <Mail size={12} color="#6c757d" />
                        <Text style={styles.contactText}>{patient.email}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleOpenModal(patient)}>
                  <Pencil size={18} color="#6c757d" />
                </TouchableOpacity>
                <View
                  style={[
                    styles.statusBadge,
                    patient.status === 'active'
                      ? styles.activeStatus
                      : styles.inactiveStatus,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      patient.status === 'active'
                        ? styles.activeStatusText
                        : styles.inactiveStatusText,
                    ]}>
                    {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          {filteredPatients.length === 0 && (
            <View style={styles.emptyState}>
              <User size={48} color="#adb5bd" />
              <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
            </View>
          )}
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
              <Text style={styles.modalTitle}>
                {editingPatientId ? 'Editar Paciente' : 'Novo Paciente'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  value={newPatient.name}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, name: text })
                  }
                  placeholder="Ex: Maria Silva"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newPatient.email}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, email: text })
                  }
                  placeholder="Ex: maria@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={newPatient.phone}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, phone: text })
                  }
                  placeholder="Ex: (11) 99999-9999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de Nascimento (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={newPatient.birthDate}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, birthDate: text })
                  }
                  placeholder="Ex: 1990-01-01"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  style={styles.input}
                  value={newPatient.address}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, address: text })
                  }
                  placeholder="Ex: Rua das Flores, 123"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newPatient.notes}
                  onChangeText={(text) =>
                    setNewPatient({ ...newPatient, notes: text })
                  }
                  placeholder="Histórico médico, alergias, etc."
                  multiline
                  numberOfLines={4}
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
                onPress={addOrUpdatePatient}
                disabled={adding}>
                {adding ? (
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
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#212529',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#17a2b8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#e7f5f7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#d4edda',
  },
  inactiveStatus: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#155724',
  },
  inactiveStatusText: {
    color: '#721c24',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6c757d',
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
    height: 100,
    textAlignVertical: 'top',
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
