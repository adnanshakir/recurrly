import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/expo/legacy";
import AuthHeader from "@/components/AuthHeader";
import AuthInput from "@/components/AuthInput";
import { getClerkErrorMessage, isValidEmail } from "@/lib/auth";
import clsx from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

type AuthMode = "sign-in" | "forgot-request" | "forgot-reset";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("sign-in");

  // Sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password state
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Form status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const resetFormErrors = () => {
    setErrorMessage(null);
    setEmailError(null);
    setPasswordError(null);
  };

  // Handle standard email & password sign in
  const handleSignIn = async () => {
    resetFormErrors();

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Email address is required.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError || !isLoaded || !signIn) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setErrorMessage("Additional verification steps required.");
      }
    } catch (err: any) {
      const msg = getClerkErrorMessage(err);
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("password")) {
        setPasswordError(msg);
      } else if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("identifier")) {
        setEmailError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password step 1: Request verification code
  const handleRequestResetCode = async () => {
    resetFormErrors();

    if (!email.trim()) {
      setEmailError("Email address is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!isLoaded || !signIn) return;

    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setMode("forgot-reset");
    } catch (err: any) {
      const msg = getClerkErrorMessage(err);
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("identifier")) {
        setEmailError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password step 2: Verify code & reset password
  const handleResetPassword = async () => {
    resetFormErrors();

    if (!resetCode.trim()) {
      setErrorMessage("Please enter the verification code sent to your email.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (!isLoaded || !signIn) return;

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode.trim(),
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      const msg = getClerkErrorMessage(err);
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("password")) {
        setPasswordError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="auth-safe-area"
      style={{ flex: 1, backgroundColor: "#fff9e3" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <ScrollView
          className="auth-scroll"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content" style={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}>
            {/* Header Section */}
            {mode === "sign-in" && (
              <AuthHeader
                title="Welcome back"
                subtitle="Sign in to continue managing your subscriptions"
              />
            )}
            {mode === "forgot-request" && (
              <AuthHeader
                title="Reset password"
                subtitle="Enter your email to receive a password reset code"
              />
            )}
            {mode === "forgot-reset" && (
              <AuthHeader
                title="Set new password"
                subtitle="Enter the verification code sent to your email and your new password"
              />
            )}

            {/* Auth Form Card */}
            <View className="auth-card" style={{ marginTop: 32, borderRadius: 24, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "#fff8e7", padding: 20 }}>
              {errorMessage ? (
                <View className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3">
                  <Text className="text-center text-sm font-sans-medium text-destructive">
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              {/* Standard Sign In Form */}
              {mode === "sign-in" && (
                <View className="auth-form" style={{ gap: 16 }}>
                  <AuthInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (emailError) setEmailError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={emailError || undefined}
                  />

                  <View className="gap-1">
                    <AuthInput
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        if (passwordError) setPasswordError(null);
                      }}
                      secureTextEntry
                      error={passwordError || undefined}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        resetFormErrors();
                        setMode("forgot-request");
                      }}
                      className="align-self-end self-end py-1"
                    >
                      <Text className="text-xs font-sans-semibold text-accent">
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleSignIn}
                    disabled={loading || !isLoaded}
                    activeOpacity={0.8}
                    className={clsx(
                      "auth-button",
                      (loading || !isLoaded) && "auth-button-disabled"
                    )}
                    style={{ backgroundColor: "#ea7a53", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Sign in</Text>
                    )}
                  </TouchableOpacity>

                  <View className="auth-link-row">
                    <Text className="auth-link-copy">New to Recurrly?</Text>
                    <Link href="/(auth)/sign-up" asChild>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Text className="auth-link">Create an account</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              )}

              {/* Forgot Password - Step 1: Request Code */}
              {mode === "forgot-request" && (
                <View className="auth-form" style={{ gap: 16 }}>
                  <AuthInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (emailError) setEmailError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={emailError || undefined}
                  />

                  <TouchableOpacity
                    onPress={handleRequestResetCode}
                    disabled={loading || !isLoaded}
                    activeOpacity={0.8}
                    className={clsx(
                      "auth-button",
                      (loading || !isLoaded) && "auth-button-disabled"
                    )}
                    style={{ backgroundColor: "#ea7a53", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Send Reset Code</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      resetFormErrors();
                      setMode("sign-in");
                    }}
                    activeOpacity={0.7}
                    className="mt-2 items-center py-2"
                  >
                    <Text className="text-sm font-sans-semibold text-accent">
                      Back to Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Forgot Password - Step 2: Code & New Password */}
              {mode === "forgot-reset" && (
                <View className="auth-form" style={{ gap: 16 }}>
                  <AuthInput
                    label="Reset Code"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChangeText={setResetCode}
                    keyboardType="numeric"
                  />

                  <AuthInput
                    label="New Password"
                    placeholder="Enter new password (min. 8 characters)"
                    value={newPassword}
                    onChangeText={(val) => {
                      setNewPassword(val);
                      if (passwordError) setPasswordError(null);
                    }}
                    secureTextEntry
                    error={passwordError || undefined}
                  />

                  <TouchableOpacity
                    onPress={handleResetPassword}
                    disabled={loading || !isLoaded}
                    activeOpacity={0.8}
                    className={clsx(
                      "auth-button",
                      (loading || !isLoaded) && "auth-button-disabled"
                    )}
                    style={{ backgroundColor: "#ea7a53", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Reset & Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      resetFormErrors();
                      setMode("sign-in");
                    }}
                    activeOpacity={0.7}
                    className="mt-2 items-center py-2"
                  >
                    <Text className="text-sm font-sans-semibold text-accent">
                      Back to Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}