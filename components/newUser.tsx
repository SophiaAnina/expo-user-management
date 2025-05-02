import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TextInput, Text, TouchableOpacity, ScrollView  } from 'react-native'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Start from './Start';
import OnboardingStart from './onboardingStart';




AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function NewUser() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [brugernavn, setBrugernavn] = useState('')
  const [loading, setLoading] = useState(false)


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
        .insert([{ id: user.id, username: brugernavn, bio: '', avatar_url: '' }]);
  
      if (profileError) {
        Alert.alert('Error creating profile:', profileError.message);
      }
  
      // Navigate to OnboardingStart after successful sign-up
     
    } catch (error) {
      console.error('Error during sign-up:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backButton}>¨
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
      <Text style={styles.text}>Hej med dig! Mit navn er Frida Fart!</Text>
      <Text style={[styles.text, styles.longText]} > Jeg er din guide gennem appen!</Text>
      <Text style={[styles.text, ]} >Skal vi få dig oprettet?</Text>
      </View>
      </View>

       <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}> Brugernavn:</Text>
        <TextInput
        style={styles.input}
        onChangeText={(text) => setBrugernavn(text)}
        value={brugernavn}
        autoCapitalize={'none'}
        />

      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}> Mail:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
         
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}> Kodeord:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
         
          autoCapitalize={'none'}
        />
      </View>
      
      <View style={{ alignItems: 'center', paddingHorizontal: 10,}}>
      
        <TouchableOpacity onPress={ signUpWithEmail} style={styles.button}>
          <Text style={styles.buttonText}>Næste</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
   
  },
  header:{
    paddingTop:30,
    backgroundColor:'#CD1F4D',
    aspectRatio:1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
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
    marginHorizontal:40,
  },
  text:{
    fontSize: 24,
    color:'white',
    fontFamily:'DynaPuff',
    width: '100%',
    maxWidth:150,
    marginLeft:'auto',
    marginRight:'auto',
    textAlign:'center',
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
    width:'100%',
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