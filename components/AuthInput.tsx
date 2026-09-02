import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import clsx from "clsx";

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  helperText,
  secureTextEntry,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View className="auth-field" style={{ gap: 8 }}>
      <Text className="auth-label" style={{ fontSize: 14, color: "#081126" }}>
        {label}
      </Text>
      <View style={{ position: "relative", justifyContent: "center" }}>
        <TextInput
          className={clsx("auth-input", error && "auth-input-error")}
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: error ? "#dc2626" : "rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff9e3",
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: "#081126",
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
            style={{ position: "absolute", right: 16, paddingVertical: 8, paddingHorizontal: 4 }}
          >
            <Text style={{ fontSize: 13, fontWeight: "bold", color: "#ea7a53" }}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text className="auth-error" style={{ fontSize: 12, color: "#dc2626", marginTop: 2 }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text className="auth-helper" style={{ fontSize: 13, color: "rgba(0, 0, 0, 0.6)", marginTop: 2 }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

export default AuthInput;
