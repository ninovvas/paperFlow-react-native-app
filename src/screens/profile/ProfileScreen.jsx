import { useState } from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';



export default function ProfileScreen({ navigation }) {
    

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { paddingHorizontal: 24, paddingVertical: 32 },
});
