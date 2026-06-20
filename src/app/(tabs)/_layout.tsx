import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    home: '🏔️', explore: '🗺️', ai: '🤖', settings: '⚙️',
  };
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={tabStyles.icon}>{iconMap[name] || '●'}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 32, height: 32, justifyContent: 'center',
    alignItems: 'center', borderRadius: 8,
  },
  iconWrapActive: { backgroundColor: Colors.swissRedLight },
  icon: { fontSize: 20 },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.swissRed,
        tabBarInactiveTintColor: Colors.midGray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: '400',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: '首页', tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }} />
      <Tabs.Screen name="explore" options={{ title: '探索', tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} /> }} />
      <Tabs.Screen name="ai" options={{ title: 'AI 问答', tabBarIcon: ({ focused }) => <TabIcon name="ai" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: '设置', tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} /> }} />
    </Tabs>
  );
}