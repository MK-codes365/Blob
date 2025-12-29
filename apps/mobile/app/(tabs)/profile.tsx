import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

const preferences = [
  {
    title: 'Study reminder',
    description: 'Get nudges when you fall behind your weekly goal.',
  },
  {
    title: 'Sync to calendar',
    description: 'Automatically block time for focus sessions.',
  },
  {
    title: 'Beta experiments',
    description: 'Preview upcoming Blob features and give feedback.',
  },
];

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(onboarding)/getting-started');
  };

  return (
    <SafeAreaView
      className="flex-1 bg-neutral-100 dark:bg-neutral-950"
      edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 48,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl bg-white p-6 shadow-lg shadow-neutral-200 dark:bg-neutral-900 dark:shadow-none">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">
                Your workspace
              </Text>
              <Text className="mt-2 text-2xl font-black text-neutral-900 dark:text-neutral-50">
                Hey Alex, everything is synced
              </Text>
              <Text className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                You created 12 study artifacts this month. Keep shaping your knowledge base.
              </Text>
            </View>
            <ThemeSwitcher />
          </View>
        </View>

        <View className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Member plan
          </Text>
          <Text className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Blob Pro
          </Text>
          <Text className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Unlimited flashcards, AI mind maps, and focused revision analytics.
          </Text>
          <Pressable
            className="mt-4 self-start rounded-full bg-amber-500 px-5 py-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Text className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Manage plan
            </Text>
          </Pressable>
        </View>

        <View className="gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Preferences
          </Text>
          <View className="gap-3">
            {preferences.map(({ title, description }) => (
              <Pressable
                key={title}
                className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-900"
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
                <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                  {title}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                  {description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <View className="flex-1 pr-4">
            <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Need an export?
            </Text>
            <Text className="mt-1 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
              Download all saved flashcards, quizzes, and mind maps in one archive.
            </Text>
          </View>
          <Pressable
            className="rounded-full border border-neutral-200 px-4 py-2 dark:border-neutral-700"
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
            <Text className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Export
            </Text>
          </Pressable>
        </View>

        <Pressable
          className="items-center justify-center rounded-2xl bg-neutral-900 py-4 dark:bg-neutral-100"
          onPress={handleLogout}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <Text className="text-base font-semibold uppercase tracking-[0.18em] text-white dark:text-neutral-900">
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
