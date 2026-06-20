// App 全局配置
export const APP_CONFIG = {
  name: 'SWIeverything',
  version: '1.0.0',
  githubOwner: '3684407267-byte',
  githubRepo: 'swisseverything',
  githubReleaseUrl: 'https://github.com/3684407267-byte/swisseverything/releases',

  // AI 默认配置 — DeepSeek（OpenAI 兼容接口）
  aiDefaultBaseUrl: 'https://api.deepseek.com',
  aiDefaultModel: 'deepseek-chat',

  // 瑞士 AI 助手系统提示词
  aiSystemPrompt: `你是一个专业的瑞士专家助手，精通瑞士的一切——历史、地理、文化、语言、政治、经济、旅游、美食等。
请用友好、热情的语气回答用户关于瑞士的问题。
如果用户询问非瑞士相关的问题，你可以礼貌地引导他们问瑞士相关的问题，但你仍然可以回答一般性问题。
请用中文回答，除非用户使用其他语言提问。`,

  // 瑞士公交 API
  transportApiUrl: 'https://transport.opendata.ch/v1',

  // 对话历史最大条数
  maxChatHistory: 20,
} as const;
