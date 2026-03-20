import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { AuthService } from '../../services/auth';
import { useUIStore } from '../../store/uiStore';

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

export const LoginScreen = ({ navigation }: any) => {
  const { setLoading, setError, isLoading, error } = useUIStore();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.login(data.email, data.password);
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const onSocialLogin = (provider: string) => {
    // Aquí implementaremos Google/Facebook native logic
    alert(`Iniciando sesión con \${provider} - (Próximamente Módulo 4)`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop' }} 
          style={styles.heroImage} 
        />
        <View style={styles.overlay} />

        <View style={styles.cardContainer}>
          <Text style={[typography.h1, { color: colors.primary }]}>Feliz Healthy!</Text>
          <Text style={[typography.body, styles.subtitle]}>Tu salud en las mejores manos</Text>
          
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input label="Correo electrónico" placeholder="maria@ejemplo.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />
            )}
          />
          
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input label="Contraseña" placeholder="Tu contraseña" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />
            )}
          />
          
          <Button title="Ingresar Seguro" onPress={handleSubmit(onSubmit)} isLoading={isLoading} style={styles.button} />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>o continuar con</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialOptions}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => onSocialLogin('Google')}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialBtn} onPress={() => onSocialLogin('Facebook')}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading} style={{ marginTop: spacing.xl }}>
            <Text style={styles.linkText}>¿Eres nueva? <Text style={{fontWeight: '700', textDecorationLine: 'underline'}}>Crea tu cuenta gratis</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  heroImage: { width: '100%', height: 320, position: 'absolute' },
  overlay: { width: '100%', height: 320, backgroundColor: 'rgba(15, 118, 110, 0.5)', position: 'absolute' },
  cardContainer: {
    backgroundColor: colors.background,
    marginTop: 260,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingTop: spacing.xl + 20,
    minHeight: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  subtitle: { marginBottom: spacing.xl, color: colors.caption },
  button: { marginTop: spacing.s, marginBottom: spacing.m, paddingVertical: 16 },
  linkText: { textAlign: 'center', color: colors.caption, fontSize: 16 },
  errorBanner: { backgroundColor: colors.error + '20', color: colors.error, padding: spacing.m, borderRadius: 8, marginBottom: spacing.m },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.l },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { marginHorizontal: spacing.m, color: colors.caption, fontSize: 14, fontWeight: '500' },
  socialOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, width: '47%', paddingVertical: 14, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  socialText: { marginLeft: spacing.s, fontWeight: '600', color: colors.text, fontSize: 16 }
});
