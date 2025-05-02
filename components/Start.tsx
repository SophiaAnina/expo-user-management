import React from "react";
import { View, Text,Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, } from "react-native";
import { supabase } from "../lib/supabase";
import { useState } from 'react';

import NewUser from "./newUser";
import Login from "./Login";
import { useNavigation } from '@react-navigation/native';
  

export default function Start( {}) {
    const navigation = useNavigation();
    
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [loading, setLoading] = useState(false)
      const [showLogin, setShowLogin] = useState(false)
    
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
            <Image source={require('../assets/dark-8 1.png')} />
          </View>
          {showLogin ? (
            <Login />   // <-- render your Login component
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>Formel 1 for alle!</Text>
              <Text style={styles.subtitle}>Din app til formel 1, uanset om du er nybegynder eller expert!</Text>
      
              <TouchableOpacity onPress={() => navigation.navigate('NewUser')} style={styles.buttonNewUser}>
                <Text style={styles.buttonText}>Ny bruger</Text>
              </TouchableOpacity>
      
              <Text style={styles.text}>Har du allerede en bruger?</Text>
      
              <TouchableOpacity onPress={() => setShowLogin(true)} style={styles.buttonLogin}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )
      
};
const styles = StyleSheet.create({
    container: {
       
       
        backgroundColor: "#FEFAEF",
    },
    header: {
        backgroundColor:'#CD1F4D', 
        aspectRatio:1, 
        justifyContent:'center', 
        alignItems:'center'}
    ,
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
    subtitle:{
        fontSize: 18,
        color:'black',
        fontFamily:'Anek Devanagari',
        marginBottom: 18,
        width:'100%',
        textAlign:'center',
    },
    text:{
        fontSize: 18,
        color:'black',
        fontWeight:'bold',
        fontFamily:'Anek Devanagari',
        marginBottom: 18,
        width:'100%',
        textAlign:'center',
    },
    buttonNewUser:{
       paddingHorizontal:32,
       paddingVertical:10,
       backgroundColor:'#CD1F4D',
       borderRadius:9,
      marginBottom:90,
       width:'auto',
       textAlign:'center',
       alignContent:'center',
       maxWidth:200,
       alignSelf:'center',

    },
    buttonLogin:{
       marginHorizontal:40,
        paddingHorizontal:32,
        paddingVertical:10,
        backgroundColor:'#CD1F4D',
        borderRadius:16,
        
    },
    buttonText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        fontFamily:'Anek Devanagari',
        width:'100%',
        textAlign:'center',
    },
    content:{
        backgroundColor:'#FFFDF1',
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
      },
      mt20: {
        marginTop: 20,
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
    
      longText:{
      color:'white',
        
      },
      textContainer:{
        marginLeft:'auto',
        justifyContent:'center',
        alignItems:'center',
        
        width:'65%',
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