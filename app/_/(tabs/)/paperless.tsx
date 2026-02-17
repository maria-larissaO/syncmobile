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

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <FileText size={48} color="#17a2b8" />
            </View>
            <Text style={styles.cardTitle}>Documentos Eletrônicos</Text>
            <Text style={styles.cardDescription}>
              Gerencie todos os documentos da clínica de forma digital e segura
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Leaf size={48} color="#28a745" />
            </View>
            <Text style={styles.cardTitle}>Impacto Sustentável</Text>
            <Text style={styles.cardDescription}>
              Reduza o consumo de papel e contribua para o meio ambiente
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Funcionalidades</Text>
          <Text style={styles.infoText}>✓ Upload de documentos</Text>
          <Text style={styles.infoText}>✓ Prontuários eletrônicos</Text>
          <Text style={styles.infoText}>✓ Arquivamento digital</Text>
          <Text style={styles.infoText}>✓ Busca de documentos</Text>
          <Text style={styles.infoText}>✓ Compartilhamento seguro</Text>
        </View>

        <View style={styles.sustainabilitySection}>
          <Text style={styles.sectionTitle}>Seu Impacto</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Folhas economizadas este mês:</Text>
            <Text style={styles.statValue}>2.847</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Árvores poupadas:</Text>
            <Text style={styles.statValue}>0.5</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CO2 economizado:</Text>
            <Text style={styles.statValue}>125 kg</Text>
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
  section: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  iconContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#e7f5f7',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#b3dfe8',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c5460',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 8,
    lineHeight: 20,
  },
  sustainabilitySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745',
  },
});
