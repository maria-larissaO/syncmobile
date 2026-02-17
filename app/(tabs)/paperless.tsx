import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileText, Leaf } from 'lucide-react-native';
import Header from '@/components/Header';

export default function PaperlessScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gestão Paperless</Text>
            <Text style={styles.subtitle}>
              Sistema digital de documentos e prontuários
            </Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.card}>
            <FileText size={48} color="#17a2b8" />
            <Text style={styles.cardTitle}>Documentos Digitais</Text>
            <Text style={styles.cardText}>
              Gerencie todos os documentos e prontuários de forma digital,
              eliminando papel da sua clínica.
            </Text>
          </View>

          <View style={styles.sustainabilityCard}>
            <Leaf size={32} color="#28a745" />
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
              <Text style={styles.sustainabilitySubtext}>
                Equivalente a preservar 0.34 árvores
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Em desenvolvimento</Text>
            <Text style={styles.infoText}>
              Funcionalidade completa em breve para digitalização e gestão de
              documentos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  mainContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  sustainabilityCard: {
    flexDirection: 'row',
    backgroundColor: '#d4edda',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    marginBottom: 20,
  },
  sustainabilityContent: {
    marginLeft: 16,
    flex: 1,
  },
  sustainabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 4,
  },
  sustainabilityText: {
    fontSize: 12,
    color: '#155724',
    marginBottom: 4,
  },
  sustainabilityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#155724',
    marginBottom: 4,
  },
  sustainabilitySubtext: {
    fontSize: 12,
    color: '#155724',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#d1ecf1',
    borderRadius: 12,
    padding: 20,
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
