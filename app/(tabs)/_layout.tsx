import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 90, 
          paddingBottom: 15, 
          paddingTop: 10, 
          backgroundColor: '#A7c957',
          borderTopWidth: 1,
          borderTopColor: '#A7c957',
        },
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => ( 
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 90, 
              height: 70, 
            }}>
              <Image 
                source={require('@/assets/icons/home.png')} 
                style={{ 
                  width: 25, 
                  height: 25, 
                  tintColor: focused ? '#bc4749' : '#386641',
                  marginBottom: 4, 
                }}
              />
              <Text style={{ 
                color: focused ? '#bc4749' : '#386641', 
                fontSize: 13, 
                textAlign: 'center',
                width: '100%',
              }}>
                Home
              </Text>
            </View>
          )
        }}
      />

      <Tabs.Screen 
        name="saved"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => ( 
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 90,
              height: 70,
            }}>
              <Image 
                source={require('@/assets/icons/saved.png')} 
                style={{ 
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#bc4749' : '#386641',
                  marginBottom: 4,
                }}
              />
              <Text style={{ 
                color: focused ? '#bc4749' : '#386641', 
                fontSize: 13,
                textAlign: 'center',
                width: '100%',
              }}>
                Ricette
              </Text>
            </View>
          )
        }}
      />

      <Tabs.Screen 
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => ( 
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 90,
              height: 70,
            }}>
              <Image 
                source={require('@/assets/icons/profile.png')} 
                style={{ 
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#bc4749' : '#386641',
                  marginBottom: 4,
                }}
              />
              <Text style={{ 
                color: focused ? '#bc4749' : '#386641', 
                fontSize: 13,
                textAlign: 'center',
                width: '100%',
              }}>
                Profilo
              </Text>
            </View>
          )
        }}
      />
    </Tabs>
  );
}

export default _Layout;