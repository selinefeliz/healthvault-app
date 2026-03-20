import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { MedicationsService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { Medication } from '../../models/index';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const MedicationsScreen = ({ navigation }: any) => {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const result = await MedicationsService.list(uid).catch(() => []);
    setMeds(result);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (medId: string) => {
    Alert.alert('Eliminar', '¿Eliminar este medicamento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        await MedicationsService.delete(uid, medId);
        setMeds(prev => prev.filter(m => m.id !== medId));
      }},
    ]);
  };

  const toggleActive = async (med: Medication) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await MedicationsService.update(uid, med.id, { isActive: !med.isActive });
    setMeds(prev => prev.map(m => m.id === med.id ? { ...m, isActive: !m.isActive } : m));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={typography.h2}>Medicación</Text>
          <Text style={styles.headerSub}>{meds.filter(m => m.isActive).length} tratamientos activos</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={meds}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState title="Sin medicamentos" message="Agrega un tratamiento para recibir recordatorios y llevar un control." />
        }
        renderItem={({ item }) => (
          <Card style={[styles.medCard, !item.isActive && styles.inactiveCard]}>
            <TouchableOpacity onPress={() => toggleActive(item)} style={[styles.statusDot, { backgroundColor: item.isActive ? colors.success : colors.border }]}>
              {item.isActive && <Ionicons name="checkmark" size={10} color="#FFF" />}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.medName, !item.isActive && { color: colors.caption }]}>{item.name}</Text>
              <Text style={styles.medDetail}>{item.dose} · {item.frequency === 'daily' ? 'Diario' : item.frequency === 'every_X_hours' ? `Cada ${item.intervalHours}h` : item.frequency}</Text>
              <Text style={styles.medDates}>Desde {item.startDate}{item.endDate ? ` hasta ${item.endDate}` : ''}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.l, paddingTop: spacing.xxl + 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerSub: { fontSize: 13, color: colors.caption, marginTop: 2 },
  addButton: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  list: { padding: spacing.l },
  medCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.m, marginBottom: spacing.s },
  inactiveCard: { opacity: 0.6 },
  statusDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  medName: { fontSize: 16, fontWeight: '700', color: colors.text },
  medDetail: { fontSize: 13, color: colors.caption, marginTop: 2 },
  medDates: { fontSize: 12, color: colors.caption, marginTop: 2, fontStyle: 'italic' },
});
