import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CANTONS, Canton } from '@/data/cantons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CantonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const canton: Canton | undefined = CANTONS.find(
    (c) => c.id === id
  );

  if (!canton) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>州未找到</Text>
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
          title: canton.name,
          headerTintColor: Colors.swissRed,
          headerStyle: { backgroundColor: Colors.white },
          headerTitleStyle: { fontWeight: '600', fontSize: Typography.h3.fontSize },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 州徽章头部 */}
        <View style={styles.heroSection}>
          <View style={styles.shieldHero}>
            <Text style={styles.shieldEmoji}>{canton.emoji || '🏴'}</Text>
          </View>
          <Text style={styles.cantonName}>{canton.name}</Text>
          <Text style={styles.cantonNative}>{canton.nameNative}</Text>
        </View>

        {/* 基本信息 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <View style={styles.infoGrid}>
            <InfoItem label="首府" value={canton.capital} icon="🏙️" />
            <InfoItem label="人口" value={`${(canton.population / 10000).toFixed(1)} 万`} icon="👥" />
            <InfoItem label="面积" value={`${canton.area} km²`} icon="📐" />
            <InfoItem label="加入联邦" value={`${canton.joinedYear} 年`} icon="📅" />
            <InfoItem label="语言" value={canton.languages.join(' / ')} icon="🗣️" />
            <InfoItem label="地区" value={canton.region} icon="🧭" />
          </View>
        </View>

        {/* 简介 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>简介</Text>
          <Text style={styles.description}>{canton.description}</Text>
        </View>

        {/* 亮点 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>亮点</Text>
          {canton.highlights.map((h, i) => (
            <View key={i} style={styles.highlightItem}>
              <View style={styles.highlightDot} />
              <Text style={styles.highlightText}>{h}</Text>
            </View>
          ))}
        </View>

        {/* 旗帜颜色 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>旗帜配色</Text>
          <View style={styles.flagColors}>
            {canton.flagColors.map((color, i) => (
              <View key={i} style={styles.flagColorRow}>
                <View style={[styles.flagSwatch, { backgroundColor: color }]} />
                <Text style={styles.flagColorText}>{color}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={infoStyles.container}>
      <Text style={infoStyles.icon}>{icon}</Text>
      <Text style={infoStyles.value}>{value}</Text>
      <Text style={infoStyles.label}>{label}</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.offWhite,
  },
  shieldHero: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  shieldEmoji: {
    fontSize: 40,
  },
  cantonName: {
    fontSize: Typography.h1.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
  },
  cantonNative: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.midGray,
    marginTop: 4,
  },

  // Info section
  infoSection: {
    padding: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '700',
    color: Colors.nearBlack,
    marginBottom: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  description: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: Typography.body.lineHeight,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.swissRed,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
  highlightText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
    lineHeight: Typography.body.lineHeight,
  },
  flagColors: {
    gap: Spacing.sm,
  },
  flagColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flagSwatch: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flagColorText: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '400',
    color: Colors.darkGray,
  },
});

const infoStyles = StyleSheet.create({
  container: {
    width: '33.33%',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.nearBlack,
    textAlign: 'center',
  },
  label: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '400',
    color: Colors.midGray,
    marginTop: 2,
  },
});
