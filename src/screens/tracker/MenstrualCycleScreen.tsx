import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';

export const MenstrualCycleScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={typography.h2}>Ciclo Menstrual</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* CHART / STATUS RING WIDGET */}
      <View style={styles.chartWidget}>
        <View style={styles.statusRing}>
          <Text style={styles.ringDay}>Día 14</Text>
          <Text style={styles.ringDesc}>Fase Ovulatoria</Text>
        </View>
        <Text style={styles.chartTitle}>Alta probabilidad de concepción</Text>
      </View>

      {/* MEDICAL INFO / AI INTEGRATION AS REQUESTED */}
      <Text style={[typography.h2, { marginHorizontal: spacing.l, marginTop: spacing.xl }]}>Conoce tu fase actual</Text>
      <View style={styles.infoCard}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop' }} 
          style={styles.infoImage}
        />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>¿Qué es la fase ovulatoria?</Text>
          <Text style={styles.infoDesc} numberOfLines={3}>
            La ovulación es cuando un óvulo maduro es liberado del ovario. Durante esta fase, aumentan tus niveles de energía y es el momento de mayor fertilidad del ciclo.
          </Text>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="play-circle" size={20} color={colors.primary} />
            <Text style={styles.mediaButtonText}>Ver Animación Explicativa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="globe-outline" size={20} color={colors.info} />
            <Text style={[styles.mediaButtonText, { color: colors.info }]}>Leer más en WHO.int</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.l, paddingTop: spacing.xl + 20, backgroundColor: colors.surface },
  chartWidget: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  statusRing: { width: 180, height: 180, borderRadius: 90, borderWidth: 12, borderColor: colors.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.l },
  ringDay: { fontSize: 32, fontWeight: 'bold', color: colors.secondary },
  ringDesc: { fontSize: 14, color: colors.caption, marginTop: spacing.xs, fontWeight: '500' },
  chartTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  infoCard: { margin: spacing.l, backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  infoImage: { width: '100%', height: 140 },
  infoTextContainer: { padding: spacing.m },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: spacing.s },
  infoDesc: { fontSize: 14, color: colors.caption, lineHeight: 22, marginBottom: spacing.m },
  mediaButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: spacing.m, borderRadius: borderRadius.md, marginBottom: spacing.s },
  mediaButtonText: { marginLeft: spacing.s, color: colors.primary, fontWeight: '600' }
});
