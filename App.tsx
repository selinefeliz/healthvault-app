import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useUIStore } from './src/store/uiStore';
import { ErrorBoundary } from './ErrorBoundary';

export default function App() {
  return (
    <View style={styles.container}>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});