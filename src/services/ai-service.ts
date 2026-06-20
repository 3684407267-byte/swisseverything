// AI Service — 多模型支持 (OpenAI 兼容接口)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { APP_CONFIG } from '@/constants/config';

const API_KEY_STORE = 'ai_api_key';
const BASE_URL_STORE = 'ai_base_url';
const MODEL_STORE = 'ai_model';

export interface AiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// 读取 API 配置
export async function getAiConfig(): Promise<AiConfig> {
  const apiKey = await SecureStore.getItemAsync(API_KEY_STORE);
  const baseUrl = (await AsyncStorage.getItem(BASE_URL_STORE)) || APP_CONFIG.aiDefaultBaseUrl;
  const model = (await AsyncStorage.getItem(MODEL_STORE)) || APP_CONFIG.aiDefaultModel;

  return {
    apiKey: apiKey || '',
    baseUrl,
    model,
  };
}

// 保存 API 配置
export async function saveAiConfig(config: Partial<AiConfig>): Promise<void> {
  if (config.apiKey !== undefined) {
    await SecureStore.setItemAsync(API_KEY_STORE, config.apiKey);
  }
  if (config.baseUrl !== undefined) {
    await AsyncStorage.setItem(BASE_URL_STORE, config.baseUrl);
  }
  if (config.model !== undefined) {
    await AsyncStorage.setItem(MODEL_STORE, config.model);
  }
}

// 检查是否已配置 API Key
export async function hasApiKey(): Promise<boolean> {
  const key = await SecureStore.getItemAsync(API_KEY_STORE);
  return !!key;
}

// 发送 AI 对话请求
export async function sendChatMessage(
  messages: { role: string; content: string }[],
  config: AiConfig
): Promise<string> {
  const systemMessage = { role: 'system', content: APP_CONFIG.aiSystemPrompt };
  const fullMessages = [systemMessage, ...messages];

  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '(无回复)';
}

// 保存对话历史到本地
const CHAT_HISTORY_KEY = 'chat_history';

export async function loadChatHistory(): Promise<ChatMessage[]> {
  try {
    const json = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveChatHistory(messages: ChatMessage[]): Promise<void> {
  const limited = messages.slice(-APP_CONFIG.maxChatHistory * 2);
  await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limited));
}

export async function clearChatHistory(): Promise<void> {
  await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
}
