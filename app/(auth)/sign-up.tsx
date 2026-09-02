import React, { useState, useEffect } from "react";
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
import { useSignUp } from "@clerk/expo/legacy";
import AuthHeader from "@/components/AuthHeader";
import AuthInput from "@/components/AuthInput";
import { getClerkErrorMessage, isValidEmail, isValidPassword } from "@/lib/auth";
import clsx from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // UI / Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Resend code timer state
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetErrors = () => {
    setErrorMessage(null);
    setFirstNameError(null);
    setEmailError(null);
    setPasswordError(null);
  };

  // Handle Initial Sign Up Submission
  const handleSignUp = async () => {
    resetErrors();

    let hasError = false;
    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      hasError = true;
    }

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
    } else if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }

    if (hasError || !isLoaded || !signUp) return;

    setLoading(true);

    try {
      // 1. Create sign-up object in Clerk
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password,
      });

      // 2. Prepare email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsVerifying(true);
      setResendCooldown(30);
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

  // Handle Resending Email Verification Code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || !isLoaded || !signUp) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendCooldown(30);
    } catch (err: any) {
      setErrorMessage(getClerkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Code Verification & Finalization
  const handleVerify = async () => {
    setErrorMessage(null);

    if (!verificationCode.trim()) {
      setErrorMessage("Please enter the verification code sent to your email.");
      return;
    }

    if (!isLoaded || !signUp) return;

    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setErrorMessage("Verification could not be completed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(getClerkErrorMessage(err));
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
            {!isVerifying ? (
              <>
                <AuthHeader
                  title="Create Account"
                  subtitle="Start tracking and optimizing your subscriptions today"
                />

                <View className="auth-card" style={{ marginTop: 32, borderRadius: 24, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "#fff8e7", padding: 20 }}>
                  {errorMessage ? (
                    <View className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3">
                      <Text className="text-center text-sm font-sans-medium text-destructive">
                        {errorMessage}
                      </Text>
                    </View>
                  ) : null}

                  <View className="auth-form" style={{ gap: 16 }}>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <AuthInput
                          label="First Name"
                          placeholder="John"
                          value={firstName}
                          onChangeText={(val) => {
                            setFirstName(val);
                            if (firstNameError) setFirstNameError(null);
                          }}
                          autoCapitalize="words"
                          error={firstNameError || undefined}
                        />
                      </View>
                      <View className="flex-1">
                        <AuthInput
                          label="Last Name"
                          placeholder="Doe"
                          value={lastName}
                          onChangeText={setLastName}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>

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

                    <AuthInput
                      label="Password"
                      placeholder="Enter password"
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        if (passwordError) setPasswordError(null);
                      }}
                      secureTextEntry
                      error={passwordError || undefined}
                    />

                    <TouchableOpacity
                      onPress={handleSignUp}
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
                        <Text className="auth-button-text">Create account</Text>
                      )}
                    </TouchableOpacity>

                    <View className="auth-link-row">
                      <Text className="auth-link-copy">
                        Already have an account?
                      </Text>
                      <Link href="/(auth)/sign-in" asChild>
                        <TouchableOpacity activeOpacity={0.7}>
                          <Text className="auth-link">Sign in</Text>
                        </TouchableOpacity>
                      </Link>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <AuthHeader
                  title="Verify Email"
                  subtitle={`We've sent a 6-digit code to ${email}`}
                />

                <View className="auth-card" style={{ marginTop: 32, borderRadius: 24, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "#fff8e7", padding: 20 }}>
                  {errorMessage ? (
                    <View className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3">
                      <Text className="text-center text-sm font-sans-medium text-destructive">
                        {errorMessage}
                      </Text>
                    </View>
                  ) : null}

                  <View className="auth-form" style={{ gap: 16 }}>
                    <AuthInput
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="numeric"
                      maxLength={6}
                    />

                    <TouchableOpacity
                      onPress={handleVerify}
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
                        <Text className="auth-button-text">
                          Verify & Continue
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between mt-2">
                      <TouchableOpacity
                        onPress={() => setIsVerifying(false)}
                        activeOpacity={0.7}
                        className="py-2"
                      >
                        <Text className="text-xs font-sans-semibold text-muted-foreground">
                          Change Email
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={resendCooldown > 0 || loading}
                        activeOpacity={0.7}
                        className="py-2"
                      >
                        <Text
                          className={clsx(
                            "text-xs font-sans-semibold",
                            resendCooldown > 0
                              ? "text-muted-foreground"
                              : "text-accent"
                          )}
                        >
                          {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : "Resend Code"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}