import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MedicationsService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { FrequencyType } from '../../models/index';

const FREQUENCIES: { label: string; value: FrequencyType }[] = [
  { label: '1 vez al día', value: 'daily' },
  { label: 'Cada X horas', value: 'every_X_hours' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Según necesidad', value: 'as_needed' },
];

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  dose: z.string().min(1, 'Dosis requerida'),
  startDate: z.string().min(8, 'Formato YYYY-MM-DD'),
  durationInDays: z.string().optional(),
  intervalHours: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export const AddMedicationScreen = ({ navigation }: any) => {
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: new Date().toISOString().split('T')[0] },
  });

  const onSave = async (data: FormData) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSaving(true);
    try {
      const durationDays = data.durationInDays ? parseInt(data.durationInDays) : undefined;
      const endDate = durationDays
        ? new Date(new Date().setDate(new Date().getDate() + durationDays)).toISOString().split('T')[0]
        : undefined;

      await MedicationsService.add(uid, {
        name: data.name, dose: data.dose, frequency, notes: data.notes,
        startDate: data.startDate, endDate,
        durationInDays, intervalHours: data.intervalHours ? parseInt(data.intervalHours) : undefined,
        dependentId: null, isActive: true,
      });
      Alert.alert('¡Guardado!', 'Medicamento registrado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={typography.h2}>Agregar Medicamento</Text>
          <View style={{ width: 26 }} />
        </View>

        <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
          <Input label="Nombre del medicamento" placeholder="ej. Ibuprofeno, Metformina..." value={value} onChangeText={onChange} error={errors.name?.message} />
        )} />

        <Controller control={control} name="dose" render={({ field: { onChange, value } }) => (
          <Input label="Dosis" placeholder="ej. 500mg, 1 tableta" value={value} onChangeText={onChange} error={errors.dose?.message} />
        )} />

        <Text style={styles.label}>Frecuencia</Text>
        <View style={styles.freqGrid}>
          {FREQUENCIES.map(f => (
            <TouchableOpacity key={f.value} style={[styles.freqChip, frequency === f.value && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setFrequency(f.value)}>
              <Text style={[styles.freqText, frequency === f.value && { color: '#FFF' }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {frequency === 'every_X_hours' && (
          <Controller control={control} name="intervalHours" render={({ field: { onChange, value } }) => (
            <Input label="¿Cada cuántas horas?" placeholder="ej. 8" value={value || ''} onChangeText={onChange} keyboardType="number-pad" />
          )} />
        )}

        <Controller control={control} name="startDate" render={({ field: { onChange, value } }) => (
          <Input label="Fecha de inicio" placeholder="YYYY-MM-DD" value={value} onChangeText={onChange} keyboardType="numbers-and-punctuation" error={errors.startDate?.message} />
        )} />

        <Controller control={control} name="durationInDays" render={({ field: { onChange, value } }) => (
          <Input label="Duración en días (opcional)" placeholder="ej. 7 días" value={value || ''} onChangeText={onChange} keyboardType="number-pad" />
        )} />

        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => (
          <Input label="Indicaciones (opcional)" placeholder="Tomar con comida, no combinar con..." value={value || ''} onChangeText={onChange} multiline numberOfLines={2} />
        )} />

        <Button title="Guardar Medicamento" onPress={handleSubmit(onSave)} isLoading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.s },
  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.l },
  freqChip: { paddingHorizontal: spacing.m, paddingVertical: spacing.s, borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  freqText: { fontWeight: '600', color: colors.caption, fontSize: 13 },
});
