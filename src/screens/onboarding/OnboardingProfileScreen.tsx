import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { BiologicalSex } from '../../models/user';
import { Input } from '../../components/Input';

interface Props {
  navigation: any;
  route: { params: { biologicalSex: BiologicalSex } };
}

export const OnboardingProfileScreen = ({ navigation, route }: Props) => {
  const { biologicalSex } = route.params;
  const isFemale = biologicalSex === 'F';
  const isMale = biologicalSex === 'M';

  const [displayName, setDisplayName] = useState('');
  // Female-specific
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [isPregnant, setIsPregnant] = useState(false);
  const [usesContraceptives, setUsesContraceptives] = useState(false);
  const [contraceptiveType, setContraceptiveType] = useState('');
  // Male-specific
  const [wantsPartnerSync, setWantsPartnerSync] = useState(false);

  const handleContinue = () => {
    if (!displayName.trim()) return;

    const profileData = {
      displayName: displayName.trim(),
      biologicalSex,
      ...(isFemale && {
        lastPeriodDate,
        averageCycleLength: parseInt(cycleLength) || 28,
        averagePeriodLength: parseInt(periodLength) || 5,
        isPregnant,
        usesContraceptives,
        contraceptiveType: usesContraceptives ? contraceptiveType : undefined,
      }),
      ...(isMale && { wantsPartnerSync }),
    };

    navigation.navigate('OnboardingBiometrics', { biologicalSex, profileData });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
        <Text style={styles.step}>Paso 2 de 3</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={32} color={colors.primary} />
        </TouchableOpacity>

        <Text style={typography.h1}>
          {isFemale ? '¡Hola! Cuéntanos de ti' : isMale ? 'Configura tu perfil' : 'Tu perfil de salud'}
        </Text>
        <Text style={[typography.body, styles.subtitle]}>
          {isFemale
            ? 'Esta información nos permitirá personalizar tu seguimiento menstrual.'
            : isMale
            ? 'Te ayudaremos con tamizajes preventivos según tu perfil.'
            : 'Cuéntanos un poco más.'}
        </Text>

        {/* General */}
        <Input
          label="¿Cómo te llamamos?"
          placeholder="Tu nombre o apodo"
          value={displayName}
          onChangeText={setDisplayName}
          error={!displayName.trim() ? undefined : undefined}
        />

        {/* === FEMALE EXCLUSIVE QUESTIONS === */}
        {isFemale && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="water" size={20} color={colors.secondary} />
              <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Tu ciclo menstrual</Text>
            </View>

            <Input
              label="¿Cuándo empezó tu último período? (YYYY-MM-DD)"
              placeholder="ej. 2026-03-01"
              value={lastPeriodDate}
              onChangeText={setLastPeriodDate}
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Duración del ciclo (días)"
                  placeholder="28"
                  value={cycleLength}
                  onChangeText={setCycleLength}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.rowItem, { marginLeft: spacing.m }]}>
                <Input
                  label="Duración del período (días)"
                  placeholder="5"
                  value={periodLength}
                  onChangeText={setPeriodLength}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>¿Estás embarazada actualmente?</Text>
                <Text style={styles.toggleDesc}>Activaremos el seguimiento de embarazo</Text>
              </View>
              <Switch
                value={isPregnant}
                onValueChange={setIsPregnant}
                trackColor={{ true: colors.secondary }}
                thumbColor={isPregnant ? colors.secondary : '#f4f3f4'}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>¿Usas anticonceptivos?</Text>
                <Text style={styles.toggleDesc}>Te recordaremos tomar tu pastilla o renovar tu método</Text>
              </View>
              <Switch
                value={usesContraceptives}
                onValueChange={setUsesContraceptives}
                trackColor={{ true: colors.primary }}
                thumbColor={usesContraceptives ? colors.primary : '#f4f3f4'}
              />
            </View>

            {usesContraceptives && (
              <Input
                label="¿Qué tipo de anticonceptivo usas?"
                placeholder="ej. Pastilla diaria, DIU, Inyección..."
                value={contraceptiveType}
                onChangeText={setContraceptiveType}
              />
            )}
          </>
        )}

        {/* === MALE EXCLUSIVE QUESTIONS === */}
        {isMale && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color={colors.info} />
              <Text style={[styles.sectionTitle, { color: colors.info }]}>Sincronización con tu pareja</Text>
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>¿Quieres sincronizar el ciclo de tu pareja?</Text>
                <Text style={styles.toggleDesc}>Recibirás alertas y consejos según el ciclo de ella</Text>
              </View>
              <Switch
                value={wantsPartnerSync}
                onValueChange={setWantsPartnerSync}
                trackColor={{ true: colors.info }}
                thumbColor={wantsPartnerSync ? colors.info : '#f4f3f4'}
              />
            </View>

            {wantsPartnerSync && (
              <View style={styles.infoBox}>
                <Ionicons name="link" size={18} color={colors.info} />
                <Text style={styles.infoBoxText}>
                  Podrás conectarte con la cuenta de tu pareja desde la configuración del Dashboard.
                </Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.continueButton, !displayName.trim() && styles.continueDisabled]}
          onPress={handleContinue}
          disabled={!displayName.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: spacing.s }} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.s },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  step: { fontSize: 13, color: colors.caption, marginBottom: spacing.l, fontWeight: '600' },
  backBtn: { marginBottom: spacing.m },
  subtitle: { color: colors.caption, marginBottom: spacing.xl, marginTop: spacing.s },
  row: { flexDirection: 'row' },
  rowItem: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: spacing.xs,
    paddingBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: { marginLeft: spacing.s, fontSize: 16, fontWeight: '700' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: borderRadius.md,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  toggleDesc: { fontSize: 12, color: colors.caption, marginTop: 2 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info + '15',
    padding: spacing.m,
    borderRadius: borderRadius.md,
    marginBottom: spacing.m,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  infoBoxText: { fontSize: 13, color: colors.info, marginLeft: spacing.s, flex: 1, lineHeight: 18 },
  continueButton: {
    backgroundColor: colors.primary,
    padding: spacing.l,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.l,
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  continueDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  continueText: { color: '#FFF', fontWeight: '700', fontSize: 17 },
});
