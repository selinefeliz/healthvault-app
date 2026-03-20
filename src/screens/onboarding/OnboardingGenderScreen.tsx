import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { BiologicalSex } from '../../models/user';

interface Props {
  navigation: any;
}

export const OnboardingGenderScreen = ({ navigation }: Props) => {
  const [selected, setSelected] = useState<BiologicalSex | null>(null);

  const options: { label: string; value: BiologicalSex; icon: any; desc: string; color: string }[] = [
    {
      label: 'Soy mujer',
      value: 'F',
      icon: 'female',
      desc: 'Seguimiento de ciclo menstrual, embarazo, anticonceptivos y exámenes ginecológicos.',
      color: colors.secondary,
    },
    {
      label: 'Soy hombre',
      value: 'M',
      icon: 'male',
      desc: 'Seguimiento de salud masculina, tamizajes preventivos y soporte al ciclo de tu pareja.',
      color: colors.info,
    },
    {
      label: 'Prefiero no especificar',
      value: 'Other',
      icon: 'person',
      desc: 'Acceso a todas las funcionalidades generales de salud y bienestar.',
      color: colors.primary,
    },
  ];

  const handleContinue = () => {
    if (!selected) return;
    navigation.navigate('OnboardingProfile', { biologicalSex: selected });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.step}>Paso 1 de 3</Text>

        <Text style={typography.h1}>¡Hola! ¿Quién eres?</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Tu sexo biológico nos ayuda a darte un seguimiento médico personalizado y relevante.
        </Text>

        <View style={styles.optionsList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionCard,
                selected === opt.value && { borderColor: opt.color, borderWidth: 2, backgroundColor: opt.color + '10' },
              ]}
              onPress={() => setSelected(opt.value)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, { backgroundColor: opt.color + '20' }]}>
                <Ionicons name={opt.icon} size={28} color={opt.color} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, selected === opt.value && { color: opt.color }]}>{opt.label}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              {selected === opt.value && (
                <Ionicons name="checkmark-circle" size={24} color={opt.color} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: spacing.s }} />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          🔒 Tu información de salud está protegida con cifrado y solo tú tienes acceso a ella.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.s },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  step: { fontSize: 13, color: colors.caption, marginBottom: spacing.xl, fontWeight: '600' },
  subtitle: { color: colors.caption, marginBottom: spacing.xl, marginTop: spacing.s },
  optionsList: { gap: spacing.m, marginBottom: spacing.xl },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  optionDesc: { fontSize: 13, color: colors.caption, lineHeight: 18 },
  continueButton: {
    backgroundColor: colors.primary,
    padding: spacing.l,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  continueDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  continueText: { color: '#FFF', fontWeight: '700', fontSize: 17 },
  disclaimer: { fontSize: 12, color: colors.caption, textAlign: 'center', lineHeight: 18 },
});
