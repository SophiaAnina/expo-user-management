import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import NewUser from './components/newUser'
import Account from './components/Account'
import ProfileStack from './screens/ProfilScreen'
import Avatar from './components/Avatar'
import HomeScreen from './screens/HomeScreen'
import Post from './components/Post';
import LiveRaceScreen from './screens/LiveRaceScreen';
import Quiz from './screens/quiz';
import { useFonts, DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';
import Start from './components/Start';
import Login from './components/Login';
import OnboardingStart from './components/onboardingStart';
import OnboardingStep2 from './components/onboardingStep2';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function AuthStack() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OnboardingStart" component={OnboardingStart} />
        <Stack.Screen name="OnboardingStep2s" component={OnboardingStep2} />
      </Stack.Navigator>
  );
}



export default function App() {
   

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session || !session.user) {
   
    return(
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      );
    }
    
  

 
  return (
    
    <NavigationContainer>
      
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { backgroundColor: '#112045' }} }>
      <Tab.Screen
         name='Post' 
         component={Post}
        options={{
           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="message-badge" size={32} color="white" /> }} />
         <Tab.Screen
          name="LiveRace"
          component={LiveRaceScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="videogame-asset" size={32} color="white" />,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={32} color="white" />,
          }}
        />
        <Tab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bookmark-box-multiple" size={32} color="white" />,
          }}
        >
          {() => <ProfileStack session={session} />}
        </Tab.Screen>
        <Tab.Screen
          name="Quiz"
          component={Quiz}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={32} color="white" />,
          }}
        />
          
      </Tab.Navigator>
    </NavigationContainer>
  )
}


