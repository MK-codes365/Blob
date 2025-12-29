import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, ScrollView, Pressable, useWindowDimensions } from 'react-native';

const advantages = [
  'Turn any syllabus into ready-to-study flashcards',
  'Visualise tough topics with AI-generated mind maps',
  'Challenge yourself with personalised quizzes and streaks',
];

export default function GettingStartedScreen() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.55, 220);

  return (
    <SafeAreaView
      className="flex-1 bg-neutral-100 dark:bg-neutral-950"
      edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-6">
          <Image
            source={require('../../assets/adaptive-icon.png')}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
          />

          <View className="items-center gap-3">
            <Text className="text-center text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
              Your AI study studio
            </Text>
            <Text className="max-w-[310px] text-center text-base leading-6 text-neutral-600 dark:text-neutral-400">
              Build a learning routine that actually sticks. Blob keeps your notes, quizzes, and
              revisions in sync.
            </Text>
          </View>
        </View>

        <View className="mt-10 gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-neutral-200 dark:bg-neutral-900 dark:shadow-none">
          {advantages.map((line) => (
            <View key={line} className="flex-row items-start gap-3">
              <View className="mt-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
              <Text className="flex-1 text-base leading-6 text-neutral-700 dark:text-neutral-300">
                {line}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-10 gap-4">
          <Pressable
            className="h-14 flex-row items-center justify-center rounded-full bg-orange-500"
            style={({ pressed }) => ({ backgroundColor: pressed ? '#ea580c' : '#f97316' })}
            onPress={() => router.push('/(onboarding)/login')}>
            <Text className="mr-2 text-lg font-semibold uppercase tracking-wide text-white">
              Start learning
            </Text>
          </Pressable>

          <Text className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            You can add your API keys later in settings. No spam, just study vibes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
