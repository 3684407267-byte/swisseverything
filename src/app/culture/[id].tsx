import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CULTURE_TOPICS } from '@/data/culture';

export default function CultureDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const topic = id ? CULTURE_TOPICS[id] : undefined;

  if (!topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>主题未找到</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: topic.title,
          headerTintColor: Colors.swissRed,
          headerStyle: { backgroundColor: Colors.white },
          headerTitleStyle: { fontWeight: '600', fontSize: Typography.h3.fontSize },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 标题区 */}
        <View style={styles.hero}>
          <View style={styles.heroEmojiWrap}>
            <Text style={styles.heroEmoji}>{topic.emoji}</Text>
          </View>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.subtitle}>{topic.description}</Text>
        </View>

        {/* 详细内容 */}
        <View style={styles.content}>
          <Text style={styles.bodyText}>{topic.content}</Text>
        </View>

        {/* 趣事 */}
        <View style={styles.factsSection}>
          <Text style={styles.factsTitle}>你知道吗？</Text>
          {topic.funFacts.map((fact, i) => (
            <View key={i} style={styles.factCard}>
              <Text style={styles.factNumber}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: Typography.h2.fontSize,
    fontWeight: '600',
    color: Colors.nearBlack,
    textAlign: 'center',
    marginTop: 100,
  },
  backLink: {
    fontSize: Typography.body.fontSize,
    color: Colors.swissRed,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: Spacing.lg,
  },
  heroEmojiWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  heroEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.midGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  content: {
    padding: Spacing.lg,
  },
  bodyText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: Typography.body.lineHeight,
  },
  factsSection: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  factsTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
    marginBottom: Spacing.md,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  factNumber: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    color: Colors.swissRed,
    minWidth: 32,
  },
  factText: {
    flex: 1,
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: 22,
  },
});
