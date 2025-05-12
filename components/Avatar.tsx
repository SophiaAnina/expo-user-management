import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { supabase } from '../lib/supabase'; // Ensure you import your Supabase client
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

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

export default function AvatarList() {
  const navigation = useNavigation(); // Access navigation object

  // Array of 27 unique seed strings
  const seeds = Array.from({ length: 27 }, (_, i) => `Avatar${i + 1}`);

  // Create avatars for each seed
  const avatars = seeds.map((seed) =>
    createAvatar(lorelei, {
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('NewUser')} // Navigate back to Account screen
      >
        <Text style={styles.backButtonText}>Back</Text>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
