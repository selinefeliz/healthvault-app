import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { useUserStore } from '../../store/userStore';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/userService';
import { auth } from '../../services/firebase.config';
import { Card } from '../../components/Card';

export const ProfileScreen = ({ navigation }: any) => {
  const { profile, setProfile } = useUserStore();

  const handleLogout = async () => {
    await AuthService.logout();
    setProfile(null);
  };

  const sections = [
    { title: 'Mi cuenta', items: [
      { label: 'Editar perfil', icon: 'create-outline' as const, action: () => {} },
      { label: 'Cambiar contraseña', icon: 'lock-closed-outline' as const, action: () => {} },
    ]},
    { title: 'Salud', items: [
      { label: 'Mis dependientes', icon: 'people-outline' as const, action: () => {} },
      ...(profile?.biologicalSex === 'M' ? [{ label: 'Sincronizar con mi pareja', icon: 'heart-outline' as const, action: () => {} }] : []),
    ]},
    { title: 'Preferencias', items: [
      { label: 'Notificaciones', icon: 'notifications-outline' as const, action: () => {} },
      { label: 'Privacidad y seguridad', icon: 'shield-checkmark-outline' as const, action: () => {} },
      { label: 'Política de privacidad', icon: 'document-text-outline' as const, action: () => {} },
    ]},
  ];

  const getBadgeColor = () => {
    if (profile?.biologicalSex === 'F') return colors.secondary;
    if (profile?.biologicalSex === 'M') return colors.info;
    return colors.primary;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Avatar Card ── */}
      <View style={styles.profileCard}>
        <View style={[styles.avatarCircle, { backgroundColor: getBadgeColor() }]}>
          <Text style={styles.avatarLetter}>{profile?.displayName?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{profile?.displayName}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={[styles.sexBadge, { backgroundColor: getBadgeColor() + '20', borderColor: getBadgeColor() }]}>
          <Ionicons name={profile?.biologicalSex === 'F' ? 'female' : profile?.biologicalSex === 'M' ? 'male' : 'person'} size={14} color={getBadgeColor()} />
          <Text style={[styles.sexBadgeText, { color: getBadgeColor() }]}>
            {profile?.biologicalSex === 'F' ? 'Perfil Femenino' : profile?.biologicalSex === 'M' ? 'Perfil Masculino' : 'Perfil General'}
          </Text>
        </View>

        {/* Quick biometrics */}
        <View style={styles.biometricsRow}>
          {profile?.weightKg && <View style={styles.biometricItem}><Text style={styles.biometricVal}>{profile.weightKg} kg</Text><Text style={styles.biometricLabel}>Peso</Text></View>}
          {profile?.heightCm && <View style={styles.biometricItem}><Text style={styles.biometricVal}>{profile.heightCm} cm</Text><Text style={styles.biometricLabel}>Talla</Text></View>}
          {profile?.bloodType && <View style={styles.biometricItem}><Text style={styles.biometricVal}>{profile.bloodType}</Text><Text style={styles.biometricLabel}>Sangre</Text></View>}
        </View>
        {profile?.allergies && profile.allergies.length > 0 && (
          <View style={styles.allergyRow}>
            <Ionicons name="warning-outline" size={14} color={colors.warning} />
            <Text style={styles.allergyText}>Alergias: {profile.allergies.join(', ')}</Text>
          </View>
        )}
      </View>

      {/* ── Settings sections ── */}
      {sections.map((section, si) => (
        <View key={si} style={{ marginBottom: spacing.l }}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card>
            {section.items.map((item, ii) => (
              <TouchableOpacity
                key={ii}
                style={[styles.settingRow, ii < section.items.length - 1 && styles.settingRowBorder]}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={20} color={colors.primary} style={{ marginRight: spacing.m }} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.caption} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      ))}

      {/* ── Logout ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: spacing.s }} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Feliz Healthy v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l, paddingTop: spacing.xxl + 10, paddingBottom: spacing.xxl },
  profileCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl,
    alignItems: 'center', marginBottom: spacing.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
  avatarLetter: { fontSize: 36, fontWeight: '700', color: '#FFF' },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  email: { fontSize: 14, color: colors.caption, marginTop: spacing.xs, marginBottom: spacing.m },
  sexBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.full, paddingHorizontal: spacing.m, paddingVertical: 4, marginBottom: spacing.m },
  sexBadgeText: { fontSize: 13, fontWeight: '600', marginLeft: spacing.xs },
  biometricsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.s },
  biometricItem: { alignItems: 'center' },
  biometricVal: { fontSize: 18, fontWeight: '700', color: colors.text },
  biometricLabel: { fontSize: 11, color: colors.caption, marginTop: 2 },
  allergyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.m },
  allergyText: { fontSize: 12, color: colors.warning, marginLeft: spacing.xs },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.caption, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.s, paddingLeft: spacing.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.m },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  settingLabel: { flex: 1, fontSize: 16, color: colors.text },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.l, borderRadius: borderRadius.md, backgroundColor: colors.error + '12', borderWidth: 1, borderColor: colors.error + '30', marginBottom: spacing.m },
  logoutText: { color: colors.error, fontWeight: '700', fontSize: 16 },
  versionText: { textAlign: 'center', fontSize: 12, color: colors.caption, marginTop: spacing.xs },
});
