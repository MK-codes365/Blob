import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, Pressable } from 'react-native';

const shortcuts = [
  {
    title: 'New flashcard set',
    description: 'Start from notes or upload a PDF',
    accent: 'bg-blue-500',
  },
  {
    title: 'Generate quiz',
    description: 'Let Blob craft questions instantly',
    accent: 'bg-violet-500',
  },
  {
    title: 'Open mind map',
    description: 'Revisit the concepts you saved',
    accent: 'bg-emerald-500',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-neutral-100 dark:bg-neutral-950"
      edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          paddingTop: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl bg-white p-6 shadow-lg shadow-neutral-200 dark:bg-neutral-900 dark:shadow-none">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                Good to see you
              </Text>
              <Text className="mt-2 text-2xl font-black text-neutral-900 dark:text-neutral-50">
                Continue building your learning flow
              </Text>
              <Text className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                You have 3 drafts waiting and 2 mind maps trending. Keep the streak alive!
              </Text>
            </View>
            <ThemeSwitcher />
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Quick actions
          </Text>
          <View className="gap-3">
            {shortcuts.map(({ title, description, accent }) => (
              <Pressable
                key={title}
                className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-900"
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
                <View className="flex-row items-start gap-4">
                  <View className={`h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                    <Text className="text-xs font-semibold uppercase text-white">Go</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {title}
                    </Text>
                    <Text className="mt-1 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                      {description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
