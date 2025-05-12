import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Frida from '../assets/FridaFart/frida-thumps-up.svg';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity style={styles.tab}>
            <Text style={{ color: 'white', fontSize:20, }}>Trending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={{ color: 'white', fontSize:20, }}>Nyheder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={{ color: 'white',fontSize:20, }}>Din Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={{ color: 'white',fontSize:20, }}>Indstillinger</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </View>

      <Frida style={styles.frida} />
    </View>
  );
}

const styles = StyleSheet.create({
  frida: {
    position: 'absolute',
    top: -200,
    right: -180,
    transform: [{ rotate: '-45.353deg' }],
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '-6%',
  },
  tabScroll: {
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 60,
    width: '150%',
  },
  tab: {
    backgroundColor: '#112045',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
  }
});
