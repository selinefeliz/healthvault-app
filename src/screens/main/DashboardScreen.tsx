import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../../services/auth';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';

export const DashboardScreen = ({ navigation }: any) => {
  const cards = [
    { title: 'Ciclo Menstrual', icon: 'water', color: colors.secondary, route: 'MenstrualCycle' },
    { title: 'Nutrición', icon: 'nutrition', color: colors.success, route: 'Nutrition' }, // Placeholder routes
    { title: 'Ejercicio', icon: 'fitness', color: colors.info, route: 'Exercise' },
    { title: 'Resultados / Historial', icon: 'document-text', color: colors.primary, route: 'Results' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={typography.h1}>¡Feliz y Saludable!</Text>
        </View>
        <TouchableOpacity onPress={() => AuthService.logout()} style={{ marginRight: spacing.m }}>
          <Ionicons name="log-out-outline" size={28} color={colors.error} />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Tu Resumen Semanal</Text>
        <Text style={styles.bannerText}>Has cumplido el 80% de tus objetivos. ¡Sigue así!</Text>
      </View>

      <Text style={[typography.h2, { marginBottom: spacing.m }]}>¿Qué analizamos hoy?</Text>

      <View style={styles.grid}>
        {cards.map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.card, { borderTopColor: item.color }]}
            onPress={() => item.route === 'MenstrualCycle' ? navigation.navigate(item.route) : null}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl + 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { fontSize: 18, color: colors.caption, marginBottom: spacing.xs },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  banner: { 
    backgroundColor: colors.primary, 
    padding: spacing.xl, 
    borderRadius: borderRadius.lg, 
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: spacing.s },
  bannerText: { color: '#FFF', opacity: 0.9, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '47%', 
    backgroundColor: colors.surface, 
    padding: spacing.l, 
    borderRadius: borderRadius.lg, 
    marginBottom: spacing.m,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text }
});
