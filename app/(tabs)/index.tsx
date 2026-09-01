import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-bold font-sans-extrabold">Welcome to Recurrly!</Text>
      <Link href="/onboarding" className="mt-4 font-sans-bold rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Get Started</Text>
      </Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Sign In</Text>
      </Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded-lg bg-primary px-4 py-2">
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
    </SafeAreaView>
  );
}
