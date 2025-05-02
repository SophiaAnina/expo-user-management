import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "./Account";
import Avatar from "./Avatar";


const Stack = createStackNavigator();

export default function AccountStack({ session }: { session: any }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account">
        {() => <Account session={session} />}
      </Stack.Screen>
      <Stack.Screen name="Avatar">
        {() => <Avatar session={session} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}