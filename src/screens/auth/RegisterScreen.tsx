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

const registerSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export const RegisterScreen = ({ navigation }: any) => {
  const { setLoading, setError, isLoading, error } = useUIStore();
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.register(data.email, data.password);
      // Automatically triggers RootNavigator re-render
    } catch (e: any) {
      setError(e.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={typography.h1}>Crea tu cuenta</Text>
        <Text style={[typography.body, styles.subtitle]}>Únete a Feliz Healthy</Text>
        
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input label="Correo electrónico" placeholder="Ej. maria@ejemplo.com" keyboardType="email-address" autoCapitalize="none" value={value || ''} onChangeText={onChange} error={errors.email?.message} />
          )}
        />
        
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input label="Contraseña" placeholder="Más de 6 caracteres" secureTextEntry value={value || ''} onChangeText={onChange} error={errors.password?.message} />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input label="Repetir Contraseña" secureTextEntry value={value || ''} onChangeText={onChange} error={errors.confirmPassword?.message} />
          )}
        />
        
        <Button title="Registrarme" onPress={handleSubmit(onSubmit)} isLoading={isLoading} style={styles.button} />

        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
