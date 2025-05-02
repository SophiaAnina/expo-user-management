import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import AccountStack from "../components/AccountStack";
import Account from "../components/Account";
import Avatar from "../components/Avatar";
import { SvgXml } from 'react-native-svg';
const Stack = createStackNavigator();
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";



export function ProfileScreen({ session }: { session: Session }) {

  const navigation = useNavigation();
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

   useEffect(() => {
      if (session) getProfile();
    }, [session]);
  
    async function getProfile() {
      try {
        setLoading(true);
        if (!session?.user) throw new Error('No user on the session!');
  
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, bio, avatar_url`)
          .eq('id', session?.user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }
  
        if (data) {
          setUsername(data.username);
          setBio(data.bio || '');
          setAvatar(data.avatar_url || null); // Set the avatar URL from the profile data
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  

  return (
    <View style={styles.container}>
      {avatar ? (
        <SvgXml xml={avatar} style={{ width: 300, height: 300, transform: [{ scale: 0.8 }] }} />
      ) : (
        <Text>Loading avatar...</Text>
      )}
      <Text style={styles.username}>{username || "Loading..."}</Text>
      {bio && <Text>{bio}</Text>}

      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("Account")}
      />
    
    </View>
  );
}

export default function ProfileStack({ session }: { session: any }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Account">
        {() => <AccountStack session={session} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEFAEF",
  },
  username: {
    fontSize: 20,
    marginTop: 12,
    fontWeight: "bold",
  },
  avatar: {
    marginBottom: 20,
    borderRadius: 50,
  },

});
