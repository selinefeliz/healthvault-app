import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { CycleLogsService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { useUserStore } from '../../store/userStore';
import { differenceInDays, addDays, parseISO, format, eachDayOfInterval, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CycleLog } from '../../models/index';
import { Card } from '../../components/Card';

const PHASES = [
  { name: 'Menstrual', days: '1-5', color: '#E53E3E', icon: 'water', desc: 'Período. Descansa y cuídate.' },
  { name: 'Folicular', days: '6-13', color: '#D69E2E', icon: 'sunny', desc: 'Energía en alza. Buen momento para nuevos proyectos.' },
  { name: 'Ovulatoria', days: '14-16', color: colors.secondary, icon: 'sparkles', desc: 'Pico de fertilidad. Mayor sociabilidad y confianza.' },
  { name: 'Lútea', days: '17-28', color: '#6B46C1', icon: 'moon', desc: 'Introspección. Cuida tu alimentación y el descanso.' },
];

export const MenstrualTrackerScreen = ({ navigation }: any) => {
  const { profile } = useUserStore();
  const [logs, setLogs] = useState<CycleLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const cycleInfo = (() => {
    if (!profile?.lastPeriodDate) return null;
    const lastPeriod = parseISO(profile.lastPeriodDate);
    const today = new Date();
    const dayOfCycle = Math.max(1, differenceInDays(today, lastPeriod) + 1);
    const cycleLen = profile.averageCycleLength || 28;
    const nextPeriod = addDays(lastPeriod, cycleLen);
    const daysUntilNext = Math.max(0, differenceInDays(nextPeriod, today));
    const phase = dayOfCycle <= (profile.averagePeriodLength || 5) ? 'Menstrual' : dayOfCycle <= 13 ? 'Folicular' : dayOfCycle <= 16 ? 'Ovulatoria' : 'Lútea';
    const ovulationDay = addDays(lastPeriod, 14);
    return { dayOfCycle, daysUntilNext, phase, cycleLen, nextPeriod, ovulationDay };
  })();

  const load = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const result = await CycleLogsService.list(uid, 30).catch(() => []);
    setLogs(result);
  };

  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  // Build calendar week strip (last 7 days)
  const weekDays = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });

  const currentPhase = PHASES.find(p => p.name === cycleInfo?.phase) || PHASES[1];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />}
    >
      <Text style={[typography.h2, { marginBottom: spacing.s }]}>Mi Ciclo Menstrual</Text>

      {/* ── Status Ring Card ── */}
      {cycleInfo ? (
        <View style={[styles.cycleCard, { borderColor: currentPhase.color }]}>
          <View style={[styles.ring, { borderColor: currentPhase.color }]}>
            <Text style={[styles.ringDay, { color: currentPhase.color }]}>Día {cycleInfo.dayOfCycle}</Text>
            <Text style={styles.ringOf}>de {cycleInfo.cycleLen}</Text>
          </View>
          <View style={styles.cycleInfo}>
            <View style={styles.phaseBadge}>
              <Ionicons name={currentPhase.icon as any} size={16} color={currentPhase.color} />
              <Text style={[styles.phaseName, { color: currentPhase.color }]}>Fase {cycleInfo.phase}</Text>
            </View>
            <Text style={styles.phaseDesc}>{currentPhase.desc}</Text>
            <Text style={styles.nextPeriod}>
              {cycleInfo.daysUntilNext === 0 ? '🔴 Período esperado hoy' : `🩸 Próximo período en ${cycleInfo.daysUntilNext} días`}
            </Text>
            <Text style={styles.ovulation}>
              💫 Ovulación: {format(cycleInfo.ovulationDay, "d 'de' MMMM", { locale: es })}
            </Text>
          </View>
        </View>
      ) : (
        <Card style={{ padding: spacing.l, alignItems: 'center' }}>
          <Text style={{ color: colors.caption }}>Completa tu perfil con la fecha de tu último período</Text>
        </Card>
      )}

      {/* ── Week Calendar Strip ── */}
      <Text style={styles.sectionTitle}>Esta semana</Text>
      <View style={styles.weekStrip}>
        {weekDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const log = logs.find(l => l.date === dateStr);
          const isToday = i === weekDays.length - 1;
          return (
            <TouchableOpacity
              key={dateStr}
              style={[styles.dayCell, isToday && { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('CycleDetail', { date: dateStr, log })}
            >
              <Text style={[styles.dayName, isToday && { color: '#FFF' }]}>{format(day, 'EEE', { locale: es }).toUpperCase()}</Text>
              <Text style={[styles.dayNum, isToday && { color: '#FFF' }]}>{format(day, 'd')}</Text>
              {log && log.flowLevel !== 'none' && <View style={[styles.logDot, { backgroundColor: isToday ? '#FFF' : colors.secondary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Phase Guide ── */}
      <Text style={styles.sectionTitle}>Guía de fases</Text>
      {PHASES.map(phase => (
        <Card key={phase.name} style={styles.phaseCard}>
          <View style={[styles.phaseIcon, { backgroundColor: phase.color + '20' }]}>
            <Ionicons name={phase.icon as any} size={22} color={phase.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.phaseCardTitle, { color: phase.color }]}>{phase.name} · Días {phase.days}</Text>
            <Text style={styles.phaseCardDesc}>{phase.desc}</Text>
          </View>
          {cycleInfo?.phase === phase.name && (
            <View style={[styles.currentBadge, { backgroundColor: phase.color }]}>
              <Text style={styles.currentBadgeText}>Ahora</Text>
            </View>
          )}
        </Card>
      ))}

      {/* ── Log Day CTA ── */}
      <TouchableOpacity
        style={styles.logButton}
        onPress={() => navigation.navigate('CycleDetail', { date: format(new Date(), 'yyyy-MM-dd'), log: null })}
        activeOpacity={0.85}
      >
        <Ionicons name="add-circle" size={22} color="#FFF" style={{ marginRight: spacing.s }} />
        <Text style={styles.logButtonText}>Registrar cómo me siento hoy</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl + 10, paddingBottom: spacing.xxl },
  cycleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.l, marginBottom: spacing.l, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  ring: { width: 110, height: 110, borderRadius: 55, borderWidth: 8, justifyContent: 'center', alignItems: 'center', marginRight: spacing.l },
  ringDay: { fontSize: 28, fontWeight: '800' },
  ringOf: { fontSize: 12, color: colors.caption, marginTop: 2 },
  cycleInfo: { flex: 1 },
  phaseBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  phaseName: { fontWeight: '700', fontSize: 16, marginLeft: spacing.xs },
  phaseDesc: { fontSize: 13, color: colors.caption, lineHeight: 18, marginBottom: spacing.s },
  nextPeriod: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  ovulation: { fontSize: 13, color: colors.caption },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.m, marginTop: spacing.m },
  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.m, marginBottom: spacing.l, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  dayCell: { alignItems: 'center', padding: spacing.s, borderRadius: borderRadius.md, minWidth: 40 },
  dayName: { fontSize: 10, fontWeight: '700', color: colors.caption },
  dayNum: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 2 },
  logDot: { width: 6, height: 6, borderRadius: 3, marginTop: 3 },
  phaseCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.m, marginBottom: spacing.s },
  phaseIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  phaseCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  phaseCardDesc: { fontSize: 13, color: colors.caption, lineHeight: 18 },
  currentBadge: { paddingHorizontal: spacing.s, paddingVertical: 3, borderRadius: borderRadius.full },
  currentBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  logButton: { backgroundColor: colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.l, borderRadius: borderRadius.md, marginTop: spacing.m, shadowColor: colors.secondary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  logButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
