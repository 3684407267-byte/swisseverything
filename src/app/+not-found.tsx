import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '页面未找到' }} />
      <Text style={styles.emoji}>🏔️</Text>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>此页面不在瑞士境内</Text>
      <Link href="/(tabs)/home" asChild>
        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>返回首页</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center', padding: Spacing.xl,
  },
  emoji: { fontSize: 64, marginBottom: Spacing.md },
  title: {
    fontWeight: '700', fontSize: Typography.hero.fontSize,
    color: Colors.swissRed, marginBottom: Spacing.xs,
  },
  subtitle: {
    fontWeight: '400', fontSize: Typography.body.fontSize,
    color: Colors.midGray, marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.swissRed,
    paddingVertical: Spacing.sm + 4, paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  buttonText: {
    fontWeight: '600', fontSize: Typography.button.fontSize, color: Colors.white,
  },
});