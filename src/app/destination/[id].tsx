import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { DESTINATIONS, Destination } from '@/data/destinations';

export default function DestinationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const dest: Destination | undefined = DESTINATIONS.find((d) => d.id === id);

  if (!dest) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>目的地未找到</Text>
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
          title: dest.nameZh || dest.name,
          headerTintColor: Colors.swissRed,
          headerStyle: { backgroundColor: Colors.white },
          headerTitleStyle: { fontWeight: '600', fontSize: Typography.h3.fontSize },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顶部图片占位 */}
        <View style={styles.heroImage}>
          <Text style={styles.heroEmoji}>{dest.emoji || '🏔️'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{dest.nameZh || dest.name}</Text>
          <Text style={styles.location}>📍 {dest.location}</Text>

          {/* 描述 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>简介</Text>
            <Text style={styles.description}>{dest.description}</Text>
          </View>

          {/* 最佳季节 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>最佳旅行季节</Text>
            <Text style={styles.description}>{dest.bestSeason}</Text>
          </View>

          {/* 亮点 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>亮点</Text>
            {dest.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <Text style={styles.highlightNum}>{i + 1}</Text>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* 活动 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>推荐活动</Text>
            <View style={styles.activitiesGrid}>
              {dest.activities.map((a, i) => (
                <View key={i} style={styles.activityTag}>
                  <Text style={styles.activityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
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
  heroImage: {
    height: 220,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 72,
  },
  content: {
    padding: Spacing.lg,
  },
  name: {
    fontSize: Typography.h1.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
  },
  location: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.midGray,
    marginTop: 4,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: Typography.body.lineHeight,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  highlightNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.swissRed,
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.bodySmall.fontSize,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  highlightText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: Typography.body.lineHeight,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  activityTag: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  activityText: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
  },
});
