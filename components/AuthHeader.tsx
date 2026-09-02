import React from "react";
import { View, Text } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <View className="auth-brand-block" style={{ alignItems: "center", marginTop: 8 }}>
      <View className="auth-logo-wrap" style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <View
          className="auth-logo-mark"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "#ea7a53",
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 6,
            borderBottomRightRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="auth-logo-mark-text" style={{ fontSize: 36, color: "#fff9e3" }}>
            R
          </Text>
        </View>
        <View>
          <Text className="auth-wordmark" style={{ fontSize: 28, color: "#081126" }}>
            Recurrly
          </Text>
          <Text className="auth-wordmark-sub" style={{ fontSize: 11, color: "rgba(0,0,0,0.6)", marginTop: -2, letterSpacing: 1 }}>
            SMART BILLING
          </Text>
        </View>
      </View>
      <Text className="auth-title" style={{ fontSize: 28, color: "#081126", textAlign: "center" }}>
        {title}
      </Text>
      <Text className="auth-subtitle" style={{ fontSize: 15, color: "rgba(0,0,0,0.6)", textAlign: "center", marginTop: 8, maxWidth: 320 }}>
        {subtitle}
      </Text>
    </View>
  );
};

export default AuthHeader;
