import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { createAvatar } from '@dicebear/core';
import * as style from '../hjealm'
import { SvgXml } from 'react-native-svg';
import { supabase } from '../lib/supabase'; // Ensure you import your Supabase client
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
async function updateAvatarInSupabase(selectedAvatar: string) {
  try {
    // Get the authenticated user's ID
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('User not authenticated');

    // Update the avatar_url in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: selectedAvatar })
      .eq('id', user.id);

    if (updateError) throw updateError;

    console.log('Avatar updated successfully');
  } catch (error) {
    console.error('Error updating avatar:', error);
  }
}

async function fetchAvatarFromSupabase() {
  try {
    // Get the authenticated user's ID
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('User not authenticated');

    // Fetch the avatar_url from the profiles table
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (fetchError) throw fetchError;

    return data?.avatar_url || null;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return null;
  }
}

async function signUpUser(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error signing up:', error.message);
    } else {
      navigation.navigate('PickAvatar', { email, password }); // Pass email and password to PickAvatar
    }
  } catch (error) {
    console.error('Error during sign-up:', error);
  }
}

export default function AvatarList( ) {
  const navigation = useNavigation(); // Access navigation object
  const route = useRoute();
  const { email, password } = route.params; // Get email and password from route params
  // Array of 27 unique seed strings
  const seeds = [
    'seed1',
    'seed2',
    'seed3',
    'seed4',
    'seed5',
    'seed6',
    'seed7',
    'seed8',
    'seed9',
    'seed10',
    'seed11',
    'seed12',
  ]
  // Create avatars for each seedr
  const avatars = seeds.map((seed) =>
    createAvatar(style, {
      seed,
    }).toString()
  );

  // State to track the selected avatar
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Fetch the avatar when the component mounts
  useEffect(() => {
    const fetchAvatar = async () => {
      const avatarUrl = await fetchAvatarFromSupabase();
      setSelectedAvatar(avatarUrl);
    };

    fetchAvatar();
  }, []);

  const handleAvatarSelection = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateAvatarInSupabase(avatar); // Update avatar in Supabase
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>

      <View id="ProfileAvatar" style={styles.ProfileAvatar}>
        {selectedAvatar ? (
          <SvgXml xml={selectedAvatar} style={{ width: 300, height: 300, transform: [{ scale: 0.8 }] }} />
        ) : (
          <Text>Pick your avatar</Text>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {avatars.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedAvatar(avatar); // Update the local state
              updateAvatarInSupabase(avatar); // Update the avatar in Supabase
            }}
            style={[
              styles.avatarContainer,
              selectedAvatar === avatar && styles.selectedAvatarBorder, // Add border if selected
            ]}
          >
            <SvgXml xml={avatar} style={{ width: 300, height: 300, transform: [{ scale: 0.35 }] }} />
          </TouchableOpacity>
        ))}
             <TouchableOpacity
          style={styles.button}
         
         
        >
          <Text style={styles.buttonText}>Næste</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  avatarContainer: {
    margin: 8,
    width: '100%',
    height: '100%',
    maxWidth: 100,
    maxHeight: 100,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ProfileAvatar: {
    aspectRatio: 1,
    width: 250,
    height: 250,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    borderColor: '#000000',
    borderWidth: 2,
  },
  selectedAvatarBorder: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 20,
  },
 button: {
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
});
