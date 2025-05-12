import React, { useState, useRef } from 'react'
import { Alert, StyleSheet, View, AppState, Image, Text, TouchableOpacity, } from 'react-native'
import { supabase } from '../lib/supabase'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useFonts, DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import { AnekDevanagari_400Regular } from '@expo-google-fonts/anek-devanagari';
import { SpecialGothicExpandedOne_400Regular } from '@expo-google-fonts/special-gothic-expanded-one';

import Frida from '../assets/FridaFart/frida-dæk.svg';
import Logo from '../assets/svg/Logo.svg';
import Car from '../assets/svg/Car.svg';
import Racetrack from '../assets/svg/Racetrack.svg';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else 
    supabase.auth.stopAutoRefresh()
  })

export default function OnboardingStep2() {
   const [fontsLoaded] = useFonts({ DynaPuff_400Regular, AnekDevanagari_400Regular, SpecialGothicExpandedOne_400Regular});
  const navigation = useNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSelected, setSelected] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(null)

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
      .insert([{
        id: user.id,
        username: email.split('@')[0],
        bio: '',
        avatar_url: '',
        niveau: selectedLevel,  // <-- send selected level here!
      }]);
      if (!selectedLevel) {
        Alert.alert('Vælg venligst et niveau før du fortsætter!');
        setLoading(false);
        return;
      }
      
    
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
    <View style={styles.container}>
      <View style={styles.header}>

    <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.backButtonText}>Tilbage</Text>
    </TouchableOpacity>
    <View style={styles.question}>
          <Text style={styles.questionTitle}>Hvad er dit niveau</Text>
          <Text style={styles.questionText}>Du kan vælge mellem begynder, grundforståelse eller ekspert</Text>
        </View>
    </View>
    <View style={styles.content}>
   

    <TouchableOpacity
  style={[
    styles.questionButton,
    selectedLevel === 'begynder' && styles.selectedQuestionButton
  ]}
  onPress={() => setSelectedLevel('begynder')}
>
  <Text style={styles.buttonText}>Begynder</Text>
</TouchableOpacity>


        <TouchableOpacity
  style={[
    styles.questionButton,
    selectedLevel === 'grundforståelse' && styles.selectedQuestionButton
  ]}
  onPress={() => setSelectedLevel('grundforståelse')}
>
  <Text style={styles.buttonText}>Grundforståelse</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.questionButton,
    selectedLevel === 'ekspert' && styles.selectedQuestionButton
  ]}
  onPress={() => setSelectedLevel('ekspert')}
>
  <Text style={styles.buttonText}>Ekspert</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.button}  disabled={loading} onPress={() => navigation.navigate('OnboardingStep3' , { email, password })}>
          <Text style={styles.buttonText}>Næste</Text>
        </TouchableOpacity>
      
      </View>
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },

  header:{
    backgroundColor:'#FCFAED',
    paddingBottom:60,
    paddingTop:100,
    alignContent:'center',
    justifyContent:'center',
    paddingHorizontal:20,
  },
 question:{
  borderRadius:10,
  backgroundColor:'#112045',
  width:'100%',
  padding:24,
  
 },
 questionTitle:{
   fontSize:20,
   color:'white',
   fontWeight:'bold',
   textAlign:'center',
   marginBottom:12.5,
 },
 questionText:{
   fontSize:24,
   color:'white',
   textAlign:'center',
 },
 content:{
  backgroundColor:'#112045',
  paddingTop:21,

 },
 selectedQuestionButton:{
  backgroundColor:'#CD1F4D',
 },
  title: {
    fontSize: 27,
    marginTop: 18,
    marginBottom: 18,
    fontWeight: "bold",
    color:'#112045',
    fontFamily:'Special Gothic Expanded One',
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
    color:'white',
    fontFamily:'DynaPuff',
    width: '100%',
    marginLeft:'auto',
    marginRight:'auto',
    textAlign:'center',
    maxWidth:150,
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
     fontFamily:'Anek Devanagari',
     textAlign:'center',
 },
 questionButton:{

  marginBottom:10,
  marginLeft:40,
  marginRight:40,
  paddingVertical:30,
  backgroundColor:'transparent',
  borderWidth:1,
  borderRadius:16,
  textAlign:'center',
  borderColor:'#CD1F4D',
 },
 backButton:{
    borderColor:'black',
    borderWidth:1,
    width:120,
    paddingVertical:10,
    marginLeft:10,
    position:'absolute',
    top:20,
    flexDirection:'row',
    paddingHorizontal:10,
    justifyContent:'space-between',
    borderRadius:8,
    

  },
  backButtonText:{
    color:'black',
    fontSize:17,
    fontWeight:'bold',
    fontFamily:'Anek Devanagari',
   justifyContent:'space-between',

  },
})