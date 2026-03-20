import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme/theme';
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
      // Navigation is handled automatically by RootNavigator based on auth state
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={typography.h1}>Bienvenido(a)</Text>
        <Text style={[typography.body, styles.subtitle]}>Inicia sesión para continuar</Text>
        
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Correo electrónico"
              placeholder="Ej. maria@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Contraseña"
              placeholder="Tú contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        
        <Button
          title="Iniciar Sesión"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          style={styles.button}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  subtitle: { marginBottom: spacing.xl, color: colors.caption },
  button: { marginTop: spacing.l, marginBottom: spacing.m },
  linkText: { textAlign: 'center', color: colors.primary, fontWeight: '600' },
  errorBanner: { backgroundColor: colors.error + '20', color: colors.error, padding: spacing.m, borderRadius: 8, marginBottom: spacing.m }
});
