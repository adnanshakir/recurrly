import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href="/(auth)/sign-up" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white font-bold">Create Account</Text>
      </Link>
    </View>
  )
}

export default signIn