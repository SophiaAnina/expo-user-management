import React, { useState, useRef, useEffect } from 'react';
import {Animated,View,Text,Image,StyleSheet,TouchableOpacity,ScrollView, Alert} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'; 
import { supabase } from '../lib/supabase';
import NewUser from './newUser';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';

import Logo from '../assets/svg/Logo.svg';
import Car from '../assets/svg/Car.svg';
import Racetrack from '../assets/svg/Racetrack.svg';
import RacetrackRed from '../assets/svg/RacetrackRed.svg';

import { useFonts, DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import { AnekDevanagari_400Regular } from '@expo-google-fonts/anek-devanagari';
import { SpecialGothicExpandedOne_400Regular } from '@expo-google-fonts/special-gothic-expanded-one';

export default function Start({}) {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ DynaPuff_400Regular, AnekDevanagari_400Regular, SpecialGothicExpandedOne_400Regular});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const slideAnim = useRef(new Animated.Value(1000)).current; // Start off screen

  useEffect(() => {
    if (showLogin) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showLogin]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const {
        data: { user },
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

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username: email.split('@')[0],
            bio: '',
            avatar_url: '',
          },
        ]);

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
      <View style={styles.header}>
       <Logo />
       <Racetrack style={styles.racetrack} />
       <Car style={styles.car} />
      </View>

      {showLogin ? (
        <View>
          <TouchableOpacity onPress={() => setShowLogin(false)} style={styles.backButton}>
                  <AntDesign name="arrowleft" size={24} color="#112045" />
                  <Text style={styles.backButtonText}>Tilbage</Text>
              </TouchableOpacity> 
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Login onBack={() => setShowLogin(false)} />
        </Animated.View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Formel 1 for alle!</Text>
          <Text style={styles.subtitle}>
            Din app til formel 1, uanset om du er nybegynder eller expert!
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('NewUser')}
            style={styles.buttonNewUser}
          >
            <Text style={styles.buttonText}>Ny bruger</Text>
          </TouchableOpacity>

          <Text style={styles.text}>Har du allerede en bruger?</Text>

          <TouchableOpacity
            onPress={() => setShowLogin(true)}
            style={styles.buttonLogin}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <RacetrackRed style={styles.racetrackRed} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEFAEF',
  },
  header: {
    backgroundColor: '#CD1F4D',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  car: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  racetrack:{
  position: 'absolute',
    right: -20,
    top:-20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    marginTop: 18,
    marginBottom: 18,
    fontWeight: 'bold',
    color: '#112045',
    fontFamily: 'Special Gothic Expanded One',
    width: '100%',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'Anek Devanagari',
    marginBottom: 18,
    width: '100%',
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Anek Devanagari',
    marginBottom: 18,
    width: '100%',
    textAlign: 'center',
  },
  buttonNewUser: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: '#CD1F4D',
    borderRadius: 9,
    marginBottom: 70,
    maxWidth: 200,
    alignSelf: 'center',
  },
  buttonLogin: {
    marginHorizontal: 40,
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: '#CD1F4D',
    borderRadius: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Anek Devanagari',
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#FFFDF1',
  },
  backButton:{
    margin: 10,
    borderColor:'#112045',
    borderWidth:1,
    width:120,
    paddingVertical:10,
    marginLeft:10,
    position:'absolute',
  
    zIndex:2,
    flexDirection:'row',
    paddingHorizontal:10,
    justifyContent:'space-between',
    borderRadius:8,
  },
  backButtonText:{
    color: '#112045',
    fontSize:17,
    fontWeight:'bold',
    fontFamily:'Anek Devanagari',
   justifyContent:'space-between',
  },
  racetrackRed: {
    position: 'absolute',
    left: -60,
    bottom: 70,
    transform: [{ rotate: '15deg' }],
    
  },
});
