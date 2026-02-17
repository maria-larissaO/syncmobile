import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  iconBackgroundColor?: string;
};

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  iconBackgroundColor = '#e7f5f7',
}: StatCardProps) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 150,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6c757d',
  },
});
