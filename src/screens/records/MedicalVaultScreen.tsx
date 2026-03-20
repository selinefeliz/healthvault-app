import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { MedicalFilesService } from '../../services/healthServices';
import { auth } from '../../services/firebase.config';
import { MedicalFile, MedicalFileType } from '../../models/index';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const FILE_TYPE_COLORS: Record<MedicalFileType, string> = {
  Laboratorio: colors.primary, Vacuna: colors.success, Imagen: colors.info,
  Receta: colors.warning, Otro: colors.caption,
};
const FILE_TYPE_ICONS: Record<MedicalFileType, any> = {
  Laboratorio: 'flask', Vacuna: 'shield-checkmark', Imagen: 'image',
  Receta: 'receipt', Otro: 'document',
};

const FILTERS: MedicalFileType[] = ['Laboratorio', 'Vacuna', 'Imagen', 'Receta', 'Otro'];

export const MedicalVaultScreen = ({ navigation }: any) => {
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [activeFilter, setActiveFilter] = useState<MedicalFileType | 'Todos'>('Todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const result = await MedicalFilesService.list(uid, null).catch(() => []);
    setFiles(result);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const filtered = activeFilter === 'Todos' ? files : files.filter(f => f.type === activeFilter);

  const handleDelete = (fileId: string) => {
    Alert.alert('Eliminar archivo', '¿Segura/o que deseas eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        await MedicalFilesService.delete(uid, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }},
    ]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={typography.h2}>Bóveda Médica</Text>
          <Text style={styles.headerSub}>{files.length} documentos guardados</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRecord')}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ paddingHorizontal: spacing.l }}>
        {(['Todos', ...FILTERS] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && { backgroundColor: colors.primary }]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && { color: '#FFF' }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* File List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            title="Sin documentos"
            message={activeFilter === 'Todos' ? 'Toca el botón + para agregar tu primer archivo médico.' : `No hay documentos de tipo "${activeFilter}" aún.`}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85}>
            <Card style={styles.fileCard}>
              <View style={[styles.fileIcon, { backgroundColor: FILE_TYPE_COLORS[item.type] + '20' }]}>
                <Ionicons name={FILE_TYPE_ICONS[item.type]} size={24} color={FILE_TYPE_COLORS[item.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.fileMeta}>{item.type} · {item.date}</Text>
                {item.notes && <Text style={styles.fileNotes} numberOfLines={1}>{item.notes}</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
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
  filters: { paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 60, backgroundColor: colors.surface },
  chip: { paddingHorizontal: spacing.m, paddingVertical: 6, borderRadius: borderRadius.full, backgroundColor: colors.border, marginRight: spacing.s },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.caption },
  list: { padding: spacing.l, paddingTop: spacing.m },
  fileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.s, padding: spacing.m },
  fileIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  fileName: { fontSize: 16, fontWeight: '600', color: colors.text },
  fileMeta: { fontSize: 12, color: colors.caption, marginTop: 2 },
  fileNotes: { fontSize: 12, color: colors.caption, fontStyle: 'italic', marginTop: 2 },
});
