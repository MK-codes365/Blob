import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

import { useAuthStore } from '@/store/authStore';
import { trpc } from '@/utils/trpc';

WebBrowser.maybeCompleteAuthSession();

const googleLabel = 'Continue with Google';

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  const googleClientIds = useMemo(
    () => ({
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    }),
    []
  );

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(googleClientIds);

  const googleSignIn = trpc.auth.googleSignIn.useMutation();

  useEffect(() => {
    (async () => {
      if (response?.type !== 'success') return;

      setError(null);

      const idToken =
        response.authentication?.idToken ??
        (typeof (response as any)?.params?.id_token === 'string'
          ? (response as any).params.id_token
          : null);

      if (!idToken) {
        setError(
          'Google sign-in did not return an id_token. If you are using Expo Go, you typically need a Web/Expo client ID. For a Dev Client or expo run:android, Android client ID should work.'
        );
        return;
      }

      try {
        const result = await googleSignIn.mutateAsync({ idToken });
        await setSession({ sessionToken: result.sessionToken, user: result.user });
        router.replace('/(tabs)/home');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to sign in with Google.';
        setError(message);
      }
    })();
  }, [response, googleSignIn, setSession]);

  const handleGoogleLogin = async () => {
    setError(null);

    // Android-only Google client IDs do NOT work in Expo Go because the redirect URI is exp://...
    // Use a Dev Client (expo run:android / EAS dev build) or create an Expo/Web client ID.
    const redirectUri = request?.redirectUri;
    const executionEnvironment = (Constants as any)?.executionEnvironment as string | undefined;
    const isExpoGo =
      executionEnvironment === 'storeClient' ||
      (typeof redirectUri === 'string' && redirectUri.startsWith('exp://'));

    if (isExpoGo) {
      setError(
        'You are running in Expo Go. An Android OAuth client ID will fail here (redirect_uri becomes exp://...). Build a Dev Client with expo run:android (recommended) or use a Web/Expo client ID + proxy flow.'
      );
      return;
    }

    try {
      await promptAsync();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to open Google sign-in.';
      setError(message);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-neutral-100 dark:bg-neutral-950"
      edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View className="items-center gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Welcome back
          </Text>
          <Text className="text-center text-3xl font-black text-neutral-900 dark:text-neutral-50">
            Sign in to sync your workspace
          </Text>
          <Text className="max-w-[320px] text-center text-base leading-6 text-neutral-600 dark:text-neutral-400">
            Connect any provider below to access your saved flashcards, quizzes, and AI notes.
          </Text>
        </View>

        <View className="mt-10 gap-4">
          <Pressable
            className="flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900"
            onPress={handleGoogleLogin}
            disabled={!request || googleSignIn.isPending}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <Text className="flex-1 text-base font-medium text-neutral-800 dark:text-neutral-200">
              {googleLabel}
            </Text>
            <View className="ml-4 h-10 w-10 items-center justify-center rounded-full bg-red-500">
              <Text className="text-xs font-semibold uppercase text-white">Go</Text>
            </View>
          </Pressable>

          <View className="flex-row items-center justify-between rounded-2xl bg-white/70 p-4 dark:bg-neutral-900/60">
            <Text className="flex-1 text-base font-medium text-neutral-500 dark:text-neutral-500">
              Continue with GitHub (later)
            </Text>
            <View className="ml-4 h-10 w-10 items-center justify-center rounded-full bg-slate-600/60">
              <Text className="text-xs font-semibold uppercase text-white/80">Go</Text>
            </View>
          </View>
        </View>

        {error ? (
          <Text className="mt-6 text-center text-sm text-red-600 dark:text-red-400">{error}</Text>
        ) : null}

        <View className="mt-10 gap-3">
          <Pressable
            className="h-14 items-center justify-center rounded-full bg-emerald-500"
            style={({ pressed }) => ({ backgroundColor: pressed ? '#059669' : '#10b981' })}
            onPress={handleGoogleLogin}
            disabled={!request || googleSignIn.isPending}>
            <Text className="text-lg font-semibold uppercase tracking-wide text-white">
              {googleSignIn.isPending ? 'Signing in…' : 'Sign in with Google'}
            </Text>
          </Pressable>
          <Pressable
            className="h-12 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700"
            onPress={() => router.back()}>
            <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Explore the welcome screen again
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
