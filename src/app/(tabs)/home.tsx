import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SWISS_FACTS } from '@/data/facts';
import { DESTINATIONS } from '@/data/destinations';
import { CANTONS } from '@/data/cantons';
import { useState, useEffect, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [factIndex, setFactIndex] = useState(0);

  // 每日瑞士事实自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % SWISS_FACTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    { title: '26个州', subtitle: '联邦成员', icon: '🏛️', route: '/explore' },
    { title: '瑞士文化', subtitle: '语言与美食', icon: '🧀', route: '/culture/language' },
    { title: '公共交通', subtitle: '精准出行', icon: '🚂', route: '/explore?tab=transport' },
    { title: '直接民主', subtitle: '政治制度', icon: '🗳️', route: '/culture/politics' },
    { title: '旅行攻略', subtitle: '探索目的地', icon: '⛰️', route: '/explore?tab=destinations' },
    { title: 'AI 问答', subtitle: '瑞士专家', icon: '🤖', route: '/(tabs)/ai' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>SWIeverything</Text>
          </View>
          <Text style={styles.heroTitle}>探索瑞士</Text>
          <Text style={styles.heroSubtitle}>
            从阿尔卑斯山脉{'\n'}到瑞士钟表的精密世界
          </Text>
        </View>
        {/* 装饰性瑞士十字 */}
        <View style={styles.heroCross}>
          <View style={styles.crossH} />
          <View style={styles.crossV} />
        </View>
      </View>

      {/* 快捷入口 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速探索</Text>
        <View style={styles.quickGrid}>
          {quickLinks.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.quickItem}
              onPress={() => router.push(link.route as any)}
              activeOpacity={0.75}
            >
              <View style={styles.quickIconWrap}>
                <Text style={styles.quickIcon}>{link.icon}</Text>
              </View>
              <Text style={styles.quickTitle}>{link.title}</Text>
              <Text style={styles.quickSubtitle}>{link.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 每日瑞士事实 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>你知道吗？</Text>
        <View style={styles.factCard}>
          <Text style={styles.factEmoji}>🇨🇭</Text>
          <Text style={styles.factText}>{SWISS_FACTS[factIndex]}</Text>
          <View style={styles.factDots}>
            {SWISS_FACTS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === factIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* 热门目的地 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>热门目的地</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationScroll}
        >
          {DESTINATIONS.slice(0, 6).map((dest) => (
            <TouchableOpacity
              key={dest.id}
              style={styles.destinationCard}
              onPress={() => router.push(`/destination/${dest.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.destinationImagePlaceholder}>
                <Text style={styles.destinationEmoji}>{dest.emoji || '🏔️'}</Text>
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationCanton} numberOfLines={1}>
                  {dest.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Hero
  hero: {
    backgroundColor: Colors.swissRed,
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 1,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  heroBadgeText: {
    fontWeight: '600',
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 1,
  },
  heroTitle: {
    fontWeight: '700',
    fontSize: Typography.hero.fontSize,
    color: Colors.white,
    lineHeight: Typography.hero.lineHeight,
  },
  heroSubtitle: {
    fontWeight: '400',
    fontSize: Typography.h3.fontSize,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.sm,
    lineHeight: 26,
  },
  heroCross: {
    position: 'absolute',
    right: -30,
    top: '50%',
    width: 160,
    height: 160,
    opacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossH: {
    position: 'absolute',
    width: '100%',
    height: 32,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  crossV: {
    position: 'absolute',
    width: 32,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: Typography.h2.fontSize,
    color: Colors.nearBlack,
    marginBottom: Spacing.md,
  },

  // Quick Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  quickItem: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm) / 3,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickTitle: {
    fontWeight: '600',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.nearBlack,
    textAlign: 'center',
  },
  quickSubtitle: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    textAlign: 'center',
    marginTop: 2,
  },

  // Fact Card
  factCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  factEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  factText: {
    fontWeight: '400',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
  },
  factDots: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lightGray,
  },
  dotActive: {
    backgroundColor: Colors.swissRed,
    width: 18,
  },

  // Destination Cards
  destinationScroll: {
    paddingRight: Spacing.lg,
  },
  destinationCard: {
    width: 200,
    marginRight: Spacing.md,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  destinationImagePlaceholder: {
    height: 120,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationEmoji: {
    fontSize: 48,
  },
  destinationInfo: {
    padding: Spacing.md,
  },
  destinationName: {
    fontWeight: '600',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
  },
  destinationCanton: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    marginTop: 2,
  },
});
