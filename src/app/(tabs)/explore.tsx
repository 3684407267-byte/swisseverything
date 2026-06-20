import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CANTONS } from '@/data/cantons';
import { useState } from 'react';

type Tab = 'cantons' | 'culture' | 'destinations' | 'transport';

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('cantons');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'cantons', label: '26个州', icon: '🏛️' },
    { key: 'culture', label: '文化', icon: '🎭' },
    { key: 'destinations', label: '目的地', icon: '⛰️' },
    { key: 'transport', label: '交通', icon: '🚂' },
  ];

  const cultureTopics = [
    { title: '四种官方语言', desc: '德语、法语、意大利语、罗曼什语', icon: '🗣️', route: '/culture/language' },
    { title: '瑞士美食', desc: '奶酪火锅、巧克力、拉可莱特', icon: '🧀', route: '/culture/food' },
    { title: '传统节日', desc: '狂欢节、国庆日、赶牛节', icon: '🎉', route: '/culture/festivals' },
    { title: '直接民主', desc: '独特的政治制度', icon: '🗳️', route: '/culture/politics' },
    { title: '钟表制造', desc: '精密工艺的巅峰', icon: '⌚', route: '/culture/watches' },
    { title: '瑞士历史', desc: '从联邦到现代', icon: '📜', route: '/culture/history' },
  ];

  const transportLinks = [
    { title: '瑞士联邦铁路 (SBB)', desc: '全国铁路网络', icon: '🚄', route: '/culture/transport' },
    { title: '黄金全景列车', desc: '最受欢迎的观景列车', icon: '🚂', route: '/destination/golden-pass' },
  ];

  const destinationLinks = [
    { title: '少女峰', desc: '欧洲之巅', icon: '🏔️', route: '/destination/jungfraujoch' },
    { title: '马特洪峰', desc: '瑞士标志', icon: '⛰️', route: '/destination/matterhorn' },
  ];

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>探索瑞士</Text>
        <Text style={styles.headerSubtitle}>发现这个阿尔卑斯国度的方方面面</Text>
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 州列表 */}
        {activeTab === 'cantons' && (
          <View style={styles.grid}>
            {CANTONS.map((canton) => (
              <TouchableOpacity
                key={canton.id}
                style={styles.cantonCard}
                onPress={() => router.push(`/canton/${canton.id}`)}
                activeOpacity={0.75}
              >
                <View style={styles.cantonShield}>
                  <Text style={styles.cantonEmoji}>{canton.emoji || '🏴'}</Text>
                </View>
                <Text style={styles.cantonName}>{canton.name}</Text>
                <Text style={styles.cantonCapital}>{canton.capital}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 文化专题 */}
        {activeTab === 'culture' && (
          <View style={styles.list}>
            {cultureTopics.map((topic) => (
              <TouchableOpacity
                key={topic.title}
                style={styles.cultureCard}
                onPress={() => router.push(topic.route as any)}
                activeOpacity={0.75}
              >
                <View style={styles.cultureIconWrap}>
                  <Text style={styles.cultureIcon}>{topic.icon}</Text>
                </View>
                <View style={styles.cultureInfo}>
                  <Text style={styles.cultureTitle}>{topic.title}</Text>
                  <Text style={styles.cultureDesc}>{topic.desc}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 目的地 */}
        {activeTab === 'destinations' && (
          <View style={styles.list}>
            {destinationLinks.map((dest) => (
              <TouchableOpacity
                key={dest.title}
                style={styles.cultureCard}
                onPress={() => router.push(dest.route as any)}
                activeOpacity={0.75}
              >
                <View style={styles.cultureIconWrap}>
                  <Text style={styles.cultureIcon}>{dest.icon}</Text>
                </View>
                <View style={styles.cultureInfo}>
                  <Text style={styles.cultureTitle}>{dest.title}</Text>
                  <Text style={styles.cultureDesc}>{dest.desc}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 交通 */}
        {activeTab === 'transport' && (
          <View style={styles.list}>
            {transportLinks.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.cultureCard}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.75}
              >
                <View style={styles.cultureIconWrap}>
                  <Text style={styles.cultureIcon}>{item.icon}</Text>
                </View>
                <View style={styles.cultureInfo}>
                  <Text style={styles.cultureTitle}>{item.title}</Text>
                  <Text style={styles.cultureDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: Typography.hero.fontSize,
    color: Colors.nearBlack,
  },
  headerSubtitle: {
    fontWeight: '400',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.midGray,
    marginTop: 4,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.offWhite,
    gap: 4,
  },
  tabActive: {
    backgroundColor: Colors.nearBlack,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontWeight: '400',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.darkGray,
  },
  tabLabelActive: {
    color: Colors.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Cantons Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
    paddingTop: Spacing.sm,
  },
  cantonCard: {
    width: '30%',
    marginHorizontal: '1.66%',
    marginBottom: Spacing.md,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  cantonShield: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cantonEmoji: {
    fontSize: 24,
  },
  cantonName: {
    fontWeight: '600',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.nearBlack,
    textAlign: 'center',
  },
  cantonCapital: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    marginTop: 2,
  },

  // Culture
  list: {
    paddingTop: Spacing.sm,
  },
  cultureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  cultureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cultureIcon: {
    fontSize: 24,
  },
  cultureInfo: {
    flex: 1,
  },
  cultureTitle: {
    fontWeight: '600',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
  },
  cultureDesc: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: Colors.midGray,
    marginLeft: Spacing.sm,
  },

  // Placeholder
  placeholderText: {
    fontWeight: '600',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  placeholderDesc: {
    fontWeight: '400',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.midGray,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
