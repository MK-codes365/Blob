import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function OnboardingLayout() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Stack
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="getting-started"
          options={{
            title: 'Welcome to Blob',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
          }}
        />
      </Stack>
    </View>
  );
}
