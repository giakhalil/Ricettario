import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import LogoutButton from '../../components/LogoutButtn';

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LogoutButton /> 
      <Text style={{ fontSize: 24, textAlign: 'center', marginTop: 20 }}>
        Profile
      </Text>
    </SafeAreaView>
  );
};

export default Profile;
