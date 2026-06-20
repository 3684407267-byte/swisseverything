import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Modal, Linking, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { checkForUpdate } from '@/services/github-api';

export default function RootLayout() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{ version: string; body: string; url: string } | null>(null);

  useEffect(() => {
    checkForUpdate(APP_CONFIG.version)
      .then((update) => {
        if (update) {
          setUpdateInfo(update);
          setShowUpdate(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.white },
          animation: 'slide_from_right',
        }}
      />
      <Modal visible={showUpdate} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.updateModal}>
            <View style={styles.crossBadge}>
              <Text style={styles.crossText}>✚</Text>
            </View>
            <Text style={styles.updateTitle}>新版本可用</Text>
            <Text style={styles.updateVersion}>v{updateInfo?.version}</Text>
            {updateInfo?.body && (
              <Text style={styles.updateBody} numberOfLines={6}>
                {updateInfo.body}
              </Text>
            )}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                if (updateInfo?.url) Linking.openURL(updateInfo.url);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.updateButtonText}>前往下载</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateSkip}
              onPress={() => setShowUpdate(false)}
            >
              <Text style={styles.updateSkipText}>稍后提醒</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  updateModal: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, width: '100%', maxWidth: 340,
    alignItems: 'center', ...Shadows.card,
  },
  crossBadge: {
    width: 48, height: 48, borderRadius: BorderRadius.full,
    backgroundColor: Colors.swissRed, justifyContent: 'center',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  crossText: { color: Colors.white, fontSize: 24, fontWeight: '700' },
  updateTitle: {
    fontWeight: '700', fontSize: Typography.h2.fontSize,
    color: Colors.nearBlack, marginBottom: Spacing.xs,
  },
  updateVersion: {
    fontWeight: '600', fontSize: Typography.body.fontSize,
    color: Colors.swissRed, marginBottom: Spacing.md,
  },
  updateBody: {
    fontWeight: '400', fontSize: Typography.bodySmall.fontSize,
    color: Colors.darkGray, textAlign: 'center', marginBottom: Spacing.lg,
  },
  updateButton: {
    backgroundColor: Colors.swissRed, paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.full,
    width: '100%', alignItems: 'center', marginBottom: Spacing.sm,
  },
  updateButtonText: {
    fontWeight: '600', fontSize: Typography.button.fontSize, color: Colors.white,
  },
  updateSkip: { paddingVertical: Spacing.sm },
  updateSkipText: {
    fontWeight: '400', fontSize: Typography.bodySmall.fontSize, color: Colors.midGray,
  },
});