import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Welcome to Nativewind!</Text>
      <Link href="/onboarding" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Get Started</Text>
      </Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Sign In</Text>
      </Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">SignUp</Text>
      </Link>

      <Link href="/subscriptions/spotify" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Spotify Subscription</Text>
      </Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 rounded-lg bg-primary px-4 py-2"
      >
        <Text className="text-white">Claude Max</Text>
      </Link>
    </View>
  );
}
