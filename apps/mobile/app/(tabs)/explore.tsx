import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

const featured = [
  {
    title: 'Principles of Neural Networks',
    author: 'Mia Chen',
    category: 'Mind map',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Cellular respiration explained',
    author: 'Jon Park',
    category: 'Flashcards',
    cover:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  },
];

const tags = ['New', 'Trending', 'STEM', 'Business', 'Languages', 'Humanities'];

export default function ExploreScreen() {
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
        <View className="rounded-3xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 p-6">
          <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Explore new ideas
          </Text>
          <Text className="mt-2 text-3xl font-black text-white">
            Find the next topic that inspires you today
          </Text>
          <Text className="mt-3 text-sm leading-6 text-white/80">
            Curated collections from the Blob community are refreshed every day.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Featured collections
          </Text>
          <View className="gap-4">
            {featured.map(({ title, author, category, cover }) => (
              <Pressable
                key={title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900"
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
                <View className="h-44 w-full overflow-hidden">
                  <Image source={{ uri: cover }} className="h-full w-full" resizeMode="cover" />
                </View>
                <View className="gap-2 p-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-500">
                      {category}
                    </Text>
                    <Text className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                      {author}
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    {title}
                  </Text>
                  <Text className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                    Tap to open the overview and study with AI-guided prompts.
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Browse by tag
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {tags.map((tag) => (
              <Pressable
                key={tag}
                className="rounded-full border border-neutral-200 px-4 py-2 dark:border-neutral-700"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
