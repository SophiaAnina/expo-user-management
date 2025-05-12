import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from './lib/supabase';
import Start from './components/Start';
import NewUser from './components/newUser';
import OnboardingStart from './components/onboardingStart';
import AvatarList from './components/PickAvatar';
import OnboardingStep2 from './components/onboardingStep2';
import OnboardingStep3 from './components/onboardingStep3';
import OnboardingStep4 from './components/onboardingStep4';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfilScreen'


// Auth Context
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Screens for Main App
function MainApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
     
    </Tab.Navigator>
  );
}

// Auth Stack Screens (Onboarding + Start)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="NewUser" component={NewUser} />
      <Stack.Screen name="OnboardingStart" component={OnboardingStart} />
      <Stack.Screen name="AvatarList" component={AvatarList} />
      <Stack.Screen name="OnboardingStep2" component={OnboardingStep2} />
      <Stack.Screen name="OnboardingStep3" component={OnboardingStep3} />
      <Stack.Screen name="OnboardingStep4" component={OnboardingStep4} />
    </Stack.Navigator>
  );
}

// Root Navigation deciding based on session
export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Fetch current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      <NavigationContainer>
        {session ? <MainApp /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
