import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState,Button, TextInput, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { supabase } from '../lib/supabase'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Frida from '../assets/FridaFart/frida-done-flag-glad.svg';
import Logo from '../assets/svg/Logo.svg';
import Car from '../assets/svg/Car.svg';
import Racetrack from '../assets/svg/Racetrack.svg';

import { useFonts, DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import { AnekDevanagari_400Regular } from '@expo-google-fonts/anek-devanagari';
import { SpecialGothicExpandedOne_400Regular } from '@expo-google-fonts/special-gothic-expanded-one';
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else 
    supabase.auth.stopAutoRefresh()
  })

export default function OnboardingStep3() {
  const [fontsLoaded] = useFonts({ DynaPuff_400Regular, AnekDevanagari_400Regular, SpecialGothicExpandedOne_400Regular});
  const navigation = useNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const fridaSvg= require('../assets/frida-hjerte-pokal.svg');

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
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
      <View style={styles.header}>

      <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backButton}>
         <AntDesign name="arrowleft" size={24} color="white" />
        <Text style={styles.backButtonText}>Tilbage</Text>
      </TouchableOpacity>
         <Text style={styles.headerText}>Godt klaret!</Text>
        <Frida width={300} height={300} style={styles.frida}  />
    </View>
      <Text style={styles.title}>Du har valgt dit niveau </Text>
      <Text style={styles.text}>Du kan til en hver tid ændre din preference i din profil</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity style={styles.button}  disabled={loading}onPress={() => navigation.navigate('OnboardingStep4' , { email, password })}>
          <Text style={styles.buttonText}>Næste</Text>
        </TouchableOpacity>
        <View>
        <Frida />
    </View>
      </View>
     
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  

  header:{
    paddingTop:30,
    backgroundColor:'#CD1F4D',
    aspectRatio:1,
  },
  headerText:{
    position:'absolute',
    top:'38%',
    right:'20%',
    color:'white',
    fontFamily:'DynaPuff_400Regular',
    fontSize:24,
    transform: [{ rotate: '20.357deg' }],
  },
  frida:{
    position:'absolute',
    width:'100%',
    height:'100%',
    left:0,
    bottom:-35,
  },
  title: {
    fontSize: 27,
    marginTop: 18,
    marginBottom: 18,
    fontWeight: "bold",
    color:'#112045',
    fontFamily:'SpecialGothicExpandedOne_400Regular',
    width:'100%',
    textAlign:'center',
},
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color:'#112045',
    width: '100%',
    textAlign:'center',
    marginTop:24,
  },
  input:{
    backgroundColor:'#E6E5E5',
    borderRadius:6,
    marginHorizontal:20,
  },
  text:{
    fontSize: 24,
    color:'black',
    fontFamily:'AnekDevanagari_400Regular',
    width: '100%',
    marginLeft:'auto',
    marginRight:'auto',
    textAlign:'center',
   fontWeight: 500,
  },
  longText:{
  color:'white',
    
  },
  textContainer:{
    marginLeft:'auto',
    justifyContent:'center',
    alignItems:'center',
    
    width:'65%',
  },
  longText:{
    maxWidth:200,
    marginBottom:30,
  },
  button:{
    marginTop:30,
    marginBottom:80,
    marginLeft:40,
    marginRight:40,
     paddingVertical:10,
     backgroundColor:'#CD1F4D',
     borderRadius:16,
     textAlign:'center',
     
 },
 buttonText:{
     color:'white',
     fontSize:24,
     fontWeight:'bold',
     fontFamily:'AnekDevanagari_400Regular',
     textAlign:'center',
 },
 backButton:{
    borderColor:'white',
    borderWidth:1,
    width:120,
    paddingVertical:10,
    marginLeft:10,

    flexDirection:'row',
    paddingHorizontal:10,
    justifyContent:'space-between',
    borderRadius:8,

  },
  backButtonText:{
    color:'white',
    fontSize:17,
    fontWeight:'bold',
    fontFamily:'Anek Devanagari',
   justifyContent:'space-between',

  },
})