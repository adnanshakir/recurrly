import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const displayName = user?.fullName || `${user?.firstName || "User"} ${user?.lastName || ""}`.trim() || "Recurrly Member";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "No email available";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-sans-extrabold text-primary">Settings</Text>
          <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
            Manage your account & subscription preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-6 flex-row items-center gap-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full bg-muted"
          />
          <View className="flex-1">
            <Text className="text-xl font-sans-bold text-primary">{displayName}</Text>
            <Text className="text-sm font-sans-medium text-muted-foreground mt-0.5" numberOfLines={1}>
              {displayEmail}
            </Text>
            <View className="mt-2 self-start rounded-full bg-accent/15 px-3 py-1">
              <Text className="text-xs font-sans-bold text-accent">Active Account</Text>
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-6 gap-4">
          <Text className="text-base font-sans-bold text-primary">About Recurrly</Text>
          
          <View className="flex-row items-center justify-between border-b border-border/50 pb-3">
            <Text className="text-sm font-sans-medium text-muted-foreground">Version</Text>
            <Text className="text-sm font-sans-semibold text-primary">1.0.0 (Production)</Text>
          </View>

          <View className="flex-row items-center justify-between border-b border-border/50 pb-3">
            <Text className="text-sm font-sans-medium text-muted-foreground">Security Protocol</Text>
            <Text className="text-sm font-sans-semibold text-primary">Encrypted Clerk SSO</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-sans-medium text-muted-foreground">Support</Text>
            <Text className="text-sm font-sans-semibold text-accent">support@recurrly.com</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="rounded-2xl border border-destructive/30 bg-destructive/10 py-4 items-center justify-center mt-2"
        >
          <Text className="text-base font-sans-bold text-destructive">Sign Out of Recurrly</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}