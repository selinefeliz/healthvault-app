import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { useUserStore } from '../../store/userStore';
import { differenceInDays, addDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedicationsService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { Medication } from '../../models/index';
import { Card } from '../../components/Card';

export const DashboardScreen = ({ navigation }: any) => {
  const { profile } = useUserStore();
  const isFemale = profile?.biologicalSex === 'F';
  const isMale = profile?.biologicalSex === 'M';
  const [todayMeds, setTodayMeds] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Compute cycle info for female users
  const cycleInfo = (() => {
    if (!isFemale || !profile?.lastPeriodDate) return null;
    const lastPeriod = parseISO(profile.lastPeriodDate);
    const today = new Date();
    const dayOfCycle = differenceInDays(today, lastPeriod) + 1;
    const cycleLen = profile.averageCycleLength || 28;
    const nextPeriod = addDays(lastPeriod, cycleLen);
    const daysUntilNext = differenceInDays(nextPeriod, today);
    const phase =
      dayOfCycle <= (profile.averagePeriodLength || 5) ? 'Menstrual' :
      dayOfCycle <= 13 ? 'Folicular' :
      dayOfCycle <= 16 ? 'Ovulatoria' :
      'Lútea';
    return { dayOfCycle, daysUntilNext: Math.max(0, daysUntilNext), phase };
  })();

  const loadData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const meds = await MedicationsService.list(uid).catch(() => []);
    setTodayMeds(meds.filter(m => m.isActive).slice(0, 3));
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const quickActions = [
    { label: 'Bóveda Médica', icon: 'document-text' as const, color: colors.primary, tab: 'Records' },
    { label: 'Medicación', icon: 'medkit' as const, color: colors.warning, tab: 'Medications' },
    { label: isFemale ? 'Mi Ciclo' : 'Tamizajes', icon: isFemale ? 'water' : 'fitness' as const, color: colors.secondary, tab: isFemale ? 'Tracker' : 'Records' },
    { label: 'Mi Perfil', icon: 'person-circle' as const, color: colors.info, tab: 'Profile' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Buenos días,</Text>
          <Text style={[typography.h1, { fontSize: 24 }]} numberOfLines={1}>{profile?.displayName || 'Bienvenida'} 👋</Text>
        </View>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'U')}&background=0F766E&color=fff&size=200` }}
          style={styles.avatar}
        />
      </View>

      {/* ── Cycle Banner (Female only) ── */}
      {isFemale && cycleInfo && (
        <TouchableOpacity
          style={[styles.cycleBanner, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('Tracker')}
          activeOpacity={0.9}
        >
          <View style={styles.cycleBannerLeft}>
            <Text style={styles.cycleBannerLabel}>Fase {cycleInfo.phase}</Text>
            <Text style={styles.cycleBannerTitle}>Día {cycleInfo.dayOfCycle} de tu ciclo</Text>
            <Text style={styles.cycleBannerSub}>
              {cycleInfo.daysUntilNext === 0 ? '¡Tu período debería comenzar hoy!' : `Próximo período en ${cycleInfo.daysUntilNext} días`}
            </Text>
          </View>
          <View style={styles.cycleBannerRight}>
            <Ionicons name="water" size={42} color="rgba(255,255,255,0.6)" />
          </View>
        </TouchableOpacity>
      )}

      {/* ── Partner Banner (Male with partner) ── */}
      {isMale && profile?.partnerUid && (
        <View style={[styles.cycleBanner, { backgroundColor: colors.info }]}>
          <View style={styles.cycleBannerLeft}>
            <Text style={styles.cycleBannerLabel}>Sincronización activa</Text>
            <Text style={styles.cycleBannerTitle}>Ciclo de tu pareja</Text>
            <Text style={styles.cycleBannerSub}>Toca para ver el resumen y consejos</Text>
          </View>
          <Ionicons name="heart" size={42} color="rgba(255,255,255,0.6)" />
        </View>
      )}

      {/* ── Quick Actions Grid ── */}
      <Text style={[typography.h2, { marginBottom: spacing.m }]}>Accesos rápidos</Text>
      <View style={styles.grid}>
        {quickActions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.quickCard, { borderTopColor: item.color }]}
            onPress={() => navigation.navigate(item.tab)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={26} color={item.color} />
            </View>
            <Text style={styles.quickCardLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Today's Medications ── */}
      <Text style={[typography.h2, { marginBottom: spacing.m, marginTop: spacing.xs }]}>Medicación de hoy</Text>
      {todayMeds.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
          <Text style={styles.emptyText}>No tienes medicamentos activos hoy</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
            <Text style={styles.emptyLink}>+ Agregar medicamento</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        todayMeds.map(med => (
          <Card key={med.id} style={styles.medCard}>
            <View style={styles.medDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDose}>{med.dose} · {med.frequency === 'daily' ? 'Cada día' : med.frequency}</Text>
            </View>
            <Ionicons name="alarm-outline" size={20} color={colors.warning} />
          </Card>
        ))
      )}

      {/* ── Info Tip ── */}
      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={18} color={colors.warning} />
        <Text style={styles.tipText}>
          Recuerda: La información de esta app es de carácter educativo y no reemplaza la consulta médica profesional.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl + 10, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.l },
  greeting: { fontSize: 14, color: colors.caption, fontWeight: '500' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginLeft: spacing.m },
  cycleBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.l, borderRadius: borderRadius.lg, marginBottom: spacing.xl,
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  cycleBannerLeft: { flex: 1 },
  cycleBannerRight: {},
  cycleBannerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cycleBannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 2 },
  cycleBannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.l },
  quickCard: {
    width: '47%', backgroundColor: colors.surface, padding: spacing.m,
    borderRadius: borderRadius.lg, marginBottom: spacing.m, borderTopWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  iconContainer: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.s },
  quickCardLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  medCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.m, marginBottom: spacing.s },
  medDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, marginRight: spacing.m },
  medName: { fontSize: 16, fontWeight: '600', color: colors.text },
  medDose: { fontSize: 13, color: colors.caption, marginTop: 2 },
  emptyCard: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.s },
  emptyText: { fontSize: 14, color: colors.caption, marginTop: spacing.s, marginBottom: spacing.xs },
  emptyLink: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.warning + '15',
    padding: spacing.m, borderRadius: borderRadius.md, marginTop: spacing.m,
    borderLeftWidth: 3, borderLeftColor: colors.warning,
  },
  tipText: { flex: 1, fontSize: 12, color: colors.caption, marginLeft: spacing.s, lineHeight: 18 },
});
