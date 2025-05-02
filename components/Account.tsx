import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import { SvgXml } from 'react-native-svg';
import { createStackNavigator } from '@react-navigation/stack';
import Avatar from './Avatar';
import { useNavigation } from '@react-navigation/native';

export function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null); // State for avatar
  const navigation = useNavigation();
  const navigateToAvatar = () => {
    navigation.navigate('Avatar'); // navigerer til 'Avatar' siden.
  };

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

  async function updateProfile({
    username,
    bio,
    avatar, // Include avatar in the parameters
  }: {
    username: string;
    bio: string;
    avatar: string | null;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        bio,
        avatar_url: avatar, // Include the avatar URL
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert(error.message);
        return;
      }

      if (!user) {
        Alert.alert('Please check your inbox for email verification!');
        return;
      }

      // Insert user profile data into the `profiles` table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username: email.split('@')[0], bio: '', avatar_url: '' }]);

      if (profileError) {
        Alert.alert('Error creating profile:', profileError.message);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.AvatarContainer}
        onPress={() => navigation.navigate('Avatar')}
      >
        {avatar ? (
         <SvgXml xml={avatar} style={{ width: 300, height: 300, transform: [{ scale: 0.8 }] }} />
        ) : (
          <Text style={styles.avatarText}>No Avatar Found</Text> // Updated fallback text
        )}
      </TouchableOpacity>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Bio" value={bio || ''} onChangeText={(text) => setBio(text)} />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateProfile({ username, bio, avatar })}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading ...' : 'Update'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity style={styles.button} onPress={() => supabase.auth.signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function AccountStack({ session }: { session: any }) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account">
        {() => <Account session={session} />}
      </Stack.Screen>
      <Stack.Screen name="Avatar"  component={Avatar } />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 40,
    padding: 12,
    backgroundColor: '#FEFAEF',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  mt20: {
    marginTop: 20,
  },
  AvatarContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 2,
    marginBottom: 20,
    marginTop: 20,
  },
  avatarText: {
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 80,
    paddingBottom: 80,
  },
});