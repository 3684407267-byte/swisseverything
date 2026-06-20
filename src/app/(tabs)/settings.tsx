import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { clearChatHistory, getAiConfig } from '@/services/ai-service';
import { checkForUpdate } from '@/services/github-api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aiModel, setAiModel] = useState('-');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    getAiConfig().then((c) => setAiModel(c.model || '-'));
  }, []);

  const handleCheckUpdate = async () => {
    setChecking(true);
    try {
      const update = await checkForUpdate(APP_CONFIG.version);
      if (update) {
        Alert.alert(
          '新版本可用',
          `版本 v${update.version} 已发布，请前往 GitHub 下载。`,
          [{ text: '知道了' }]
        );
      } else {
        Alert.alert('已是最新版本', `当前版本：v${APP_CONFIG.version}`);
      }
    } catch {
      Alert.alert('检查失败', '无法连接到更新服务器');
    } finally {
      setChecking(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert('清除对话历史', '确定要清除所有 AI 对话记录吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '清除',
        style: 'destructive',
        onPress: async () => {
          await clearChatHistory();
          Alert.alert('已清除', '对话历史已删除。');
        },
      },
    ]);
  };

  const settingGroups = [
    {
      title: 'AI 服务',
      items: [
        {
          label: 'API 配置',
          desc: `模型：${aiModel}`,
          icon: '🔑',
          onPress: () => router.push('/(tabs)/ai'),
        },
        {
          label: '清除对话历史',
          desc: '删除所有 AI 对话记录',
          icon: '🗑️',
          onPress: handleClearHistory,
          destructive: true,
        },
      ],
    },
    {
      title: '关于',
      items: [
        {
          label: '版本信息',
          desc: `v${APP_CONFIG.version}` + (checking ? ' (检查中...)' : ''),
          icon: '📱',
          onPress: handleCheckUpdate,
        },
        {
          label: 'SWIeverything',
          desc: '一款全面的瑞士综合应用',
          icon: '🇨🇭',
        },
        {
          label: '数据来源',
          desc: '瑞士联邦统计局、myswitzerland.io、transport.opendata.ch',
          icon: '📊',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContent}>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.settingItem}
                  onPress={item.onPress}
                  activeOpacity={item.onPress ? 0.7 : 1}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingIconWrap}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingInfo}>
                    <Text
                      style={[
                        styles.settingLabel,
                        item.destructive && { color: Colors.swissRed },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.settingDesc} numberOfLines={2}>
                      {item.desc}
                    </Text>
                  </View>
                  {item.onPress && (
                    <Text style={styles.settingArrow}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 底部品牌 */}
        <View style={styles.brand}>
          <View style={styles.brandCross}>
            <Text style={styles.brandCrossText}>✚</Text>
          </View>
          <Text style={styles.brandName}>SWIeverything</Text>
          <Text style={styles.brandTagline}>Made with ❤️ for Switzerland</Text>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: Typography.h2.fontSize,
    color: Colors.nearBlack,
  },
  content: {
    flex: 1,
  },
  group: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  groupTitle: {
    fontWeight: '600',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  groupContent: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontWeight: '400',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
  },
  settingDesc: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    marginTop: 1,
  },
  settingArrow: {
    fontSize: 22,
    color: Colors.midGray,
    marginLeft: Spacing.sm,
  },
  brand: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.xl,
  },
  brandCross: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.swissRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandCrossText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  brandName: {
    fontWeight: '700',
    fontSize: Typography.h3.fontSize,
    color: Colors.nearBlack,
    letterSpacing: 1,
  },
  brandTagline: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
    marginTop: 4,
  },
});
