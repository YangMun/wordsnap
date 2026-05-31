import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFBEB' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 16 }}>�</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1C1917', marginBottom: 8 }}>
          WordSnap
        </Text>
        <Text style={{ fontSize: 16, color: '#78716C' }}>
          앱 로딩 성공!
        </Text>
      </View>
    </SafeAreaView>
  );
}
