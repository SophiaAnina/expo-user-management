import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, AppState, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import AvatarList from './PickAvatar';
import { useNavigation } from '@react-navigation/native';

import AntDesign from '@expo/vector-icons/AntDesign';

import { useFonts, DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import { AnekDevanagari_400Regular } from '@expo-google-fonts/anek-devanagari';
import { SpecialGothicExpandedOne_400Regular } from '@expo-google-fonts/special-gothic-expanded-one';

import Frida from '../assets/FridaFart/frida-dobbelt-thumps-up.svg';

export default function NewUser() {
  
  const [fontsLoaded] = useFonts({ DynaPuff_400Regular, AnekDevanagari_400Regular, SpecialGothicExpandedOne_400Regular});
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brugernavn, setBrugernavn] = useState('');
  const [loading, setLoading] = useState(false);

  // AppState listener properly inside useEffect
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);

  // Prevent rendering until fonts are ready
  if (!fontsLoaded) return null;

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign-up error:', error);
        Alert.alert(error.message);
        return;
      }

      if (!user) {
        Alert.alert('Check your inbox for verification.');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username: brugernavn, avatar_url: '', onboarding_complete: false }]);

      if (profileError) {
        Alert.alert('Profile error:', profileError.message);
      }

    
      navigation.navigate('PickAvatar');

    } catch (error) {
      console.error('Sign-up error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Hej med dig! Mit navn er Frida Fart!</Text>
          <Text style={[styles.text, styles.longText]}>Jeg er din guide gennem appen!</Text>
          <Text style={styles.text}>Skal vi få dig oprettet?</Text>
        </View>

        <Frida style={styles.frida} width={400} height={400} />
      </View>

      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Brugernavn:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setBrugernavn}
          value={brugernavn}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Mail:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Kodeord:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
      <TouchableOpacity
  onPress={signUpWithEmail}
  disabled={loading}
  style={styles.button}
>
  <Text style={styles.buttonText}>Næste</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    paddingTop: 30,
    backgroundColor: '#CD1F4D',
    aspectRatio: 1,
  },
  frida: {
    position: 'absolute',
    top: '20%',
    transform: [{ rotate: '43.371deg' }],
    left: '-42%',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#112045',
    width: '100%',
    textAlign: 'center',
    marginTop: 24,
  },
  input: {
    backgroundColor: '#E6E5E5',
    borderRadius: 6,
    marginHorizontal: 40,
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'DynaPuff_400Regular',
    width: '100%',
    maxWidth: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  textContainer: {
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: '65%',
  },
  longText: {
    maxWidth: 200,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    marginTop: 30,
    marginBottom: 80,
    marginLeft: 40,
    marginRight: 40,
    paddingVertical: 10,
    backgroundColor: '#CD1F4D',
    borderRadius: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'AnekDevanagari_400Regular',
    textAlign: 'center',
  },
  backButton: {
    borderColor: 'white',
    borderWidth: 1,
    width: 120,
    paddingVertical: 10,
    marginLeft: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'DynaPuff_400Regular',
    justifyContent: 'space-between',
  },
});
