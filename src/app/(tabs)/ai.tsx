import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import {
  getAiConfig,
  saveAiConfig,
  sendChatMessage,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  hasApiKey,
  ChatMessage,
  AiConfig,
} from '@/services/ai-service';
import { APP_CONFIG } from '@/constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AiScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<AiConfig>({
    apiKey: '',
    baseUrl: APP_CONFIG.aiDefaultBaseUrl,
    model: APP_CONFIG.aiDefaultModel,
  });
  const [tempConfig, setTempConfig] = useState(config);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const savedConfig = await getAiConfig();
      setConfig(savedConfig);
      setTempConfig(savedConfig);
      const history = await loadChatHistory();
      setMessages(history);

      // 首次使用弹窗
      const hasKey = await hasApiKey();
      if (!hasKey) {
        setShowConfig(true);
      }
    })();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const currentConfig = await getAiConfig();
    if (!currentConfig.apiKey) {
      setShowConfig(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendChatMessage(apiMessages, currentConfig);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ 出错了: ${err.message || '未知错误'}\n\n请检查你的 API Key 和网络连接。`,
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSaveConfig = async () => {
    await saveAiConfig(tempConfig);
    setConfig(tempConfig);
    setShowConfig(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI 瑞士专家</Text>
          <Text style={styles.headerSubtitle}>
            {config.model || 'AI'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.configBtn}
          onPress={() => {
            setTempConfig(config);
            setShowConfig(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.configBtnText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 聊天列表 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>🤖</Text>
            </View>
            <Text style={styles.emptyTitle}>你好！我是瑞士专家助手</Text>
            <Text style={styles.emptyText}>
              我可以回答关于瑞士的任何问题：{'\n'}
              历史、地理、文化、旅游、美食、政治……{'\n\n'}
              请先在设置中配置你的 API Key 来开始对话。
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => setShowConfig(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyCtaText}>配置 API Key</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubbleRow,
              item.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAssistant,
            ]}
          >
            {item.role === 'assistant' && (
              <View style={styles.avatarAssistant}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
              ]}
            >
              <Text style={styles.bubbleText}>{item.content}</Text>
            </View>
            {item.role === 'user' && (
              <View style={styles.avatarUser}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            )}
          </View>
        )}
      />

      {/* 底部输入栏 */}
      <View style={[styles.inputBar]}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="询问关于瑞士的任何问题……"
          placeholderTextColor={Colors.midGray}
          multiline
          maxLength={2000}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.sendBtnText}>↑</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* API 配置弹窗 */}
      <Modal visible={showConfig} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.modalTitle}>配置 AI 服务</Text>
          <Text style={styles.modalDesc}>
            默认使用 DeepSeek。你可以填入任何兼容 OpenAI 接口的 API。
          </Text>

          <Text style={styles.label}>API Key</Text>
          <TextInput
            style={styles.modalInput}
            value={tempConfig.apiKey}
            onChangeText={(t) => setTempConfig({ ...tempConfig, apiKey: t })}
            placeholder="sk-..."
            placeholderTextColor={Colors.midGray}
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>Base URL</Text>
          <TextInput
            style={styles.modalInput}
            value={tempConfig.baseUrl}
            onChangeText={(t) => setTempConfig({ ...tempConfig, baseUrl: t })}
            placeholder="https://api.deepseek.com"
            placeholderTextColor={Colors.midGray}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={styles.label}>模型名称</Text>
          <TextInput
            style={styles.modalInput}
            value={tempConfig.model}
            onChangeText={(t) => setTempConfig({ ...tempConfig, model: t })}
            placeholder="deepseek-chat"
            placeholderTextColor={Colors.midGray}
            autoCapitalize="none"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveConfig}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>保存配置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowConfig(false)}
            >
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {},
  headerTitle: {
    fontWeight: '700',
    fontSize: Typography.h2.fontSize,
    color: Colors.nearBlack,
  },
  headerSubtitle: {
    fontWeight: '400',
    fontSize: Typography.caption.fontSize,
    color: Colors.midGray,
  },
  configBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configBtnText: {
    fontSize: 20,
  },

  // Chat
  chatList: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  avatarAssistant: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.swissRedLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: Colors.swissRed,
    borderBottomRightRadius: BorderRadius.sm,
  },
  bubbleAssistant: {
    backgroundColor: Colors.offWhite,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  bubbleText: {
    fontWeight: '400',
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: Colors.nearBlack,
  },
  bubbleTextBold: {},

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: Typography.h3.fontSize,
    color: Colors.nearBlack,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontWeight: '400',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.midGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  emptyCta: {
    backgroundColor: Colors.swissRed,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  emptyCtaText: {
    fontWeight: '600',
    fontSize: Typography.button.fontSize,
    color: Colors.white,
  },

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontWeight: '400',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.swissRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.lightGray,
  },
  sendBtnText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '600',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: Typography.h1.fontSize,
    color: Colors.nearBlack,
    marginBottom: Spacing.xs,
  },
  modalDesc: {
    fontWeight: '400',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.midGray,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.nearBlack,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  modalInput: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontWeight: '400',
    fontSize: Typography.body.fontSize,
    color: Colors.nearBlack,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: Colors.swissRed,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  saveBtnText: {
    fontWeight: '600',
    fontSize: Typography.button.fontSize,
    color: Colors.white,
  },
  cancelBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontWeight: '400',
    fontSize: Typography.button.fontSize,
    color: Colors.midGray,
  },
});
