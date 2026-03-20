import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MedicalFilesService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { MedicalFileType } from '../../models/index';

const FILE_TYPES: MedicalFileType[] = ['Laboratorio', 'Vacuna', 'Imagen', 'Receta', 'Otro'];

const schema = z.object({
  title: z.string().min(2, 'Agrega un título'),
  date: z.string().min(8, 'Formato: YYYY-MM-DD'),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export const AddRecordScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState<MedicalFileType>('Laboratorio');
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });

  const onSave = async (data: FormData) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSaving(true);
    try {
      await MedicalFilesService.add(uid, {
        title: data.title,
        type: selectedType,
        date: data.date,
        notes: data.notes,
        fileUrl: '', // Will be populated when file upload is implemented
        storageRef: '',
        dependentId: null,
      });
      Alert.alert('¡Guardado!', 'El registro fue agregado correctamente.', [
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
          <Text style={typography.h2}>Agregar Registro</Text>
          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.label}>Tipo de documento</Text>
        <View style={styles.typeGrid}>
          {FILE_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, selectedType === t && { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.typeText, selectedType === t && { color: '#FFF' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Controller control={control} name="title" render={({ field: { onChange, value } }) => (
          <Input label="Título del documento" placeholder="ej. Hemograma completo" value={value} onChangeText={onChange} error={errors.title?.message} />
        )} />

        <Controller control={control} name="date" render={({ field: { onChange, value } }) => (
          <Input label="Fecha (YYYY-MM-DD)" placeholder="2026-03-20" value={value} onChangeText={onChange} keyboardType="numbers-and-punctuation" error={errors.date?.message} />
        )} />

        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => (
          <Input label="Notas (opcional)" placeholder="Observaciones del doctor, valores relevantes..." value={value || ''} onChangeText={onChange} multiline numberOfLines={3} />
        )} />

        <View style={styles.uploadPlaceholder}>
          <Ionicons name="cloud-upload-outline" size={32} color={colors.border} />
          <Text style={styles.uploadText}>Subida de archivo PDF/Imagen (próximamente)</Text>
        </View>

        <Button title="Guardar Registro" onPress={handleSubmit(onSave)} isLoading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.s },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginBottom: spacing.l },
  typeChip: { paddingHorizontal: spacing.m, paddingVertical: spacing.s, borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  typeText: { fontWeight: '600', color: colors.caption, fontSize: 14 },
  uploadPlaceholder: { borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.l },
  uploadText: { fontSize: 13, color: colors.caption, marginTop: spacing.s, textAlign: 'center' },
});
