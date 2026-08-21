import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link href="/(auth)/sign-in" className="mt-4 rounded-lg bg-primary px-4 py-2">
        <Text className="text-white">Sign In</Text>
      </Link>
    </View>
  )
}

export default signUp