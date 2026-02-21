import { useState, useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';


const MAX_RESULTS_OPTIONS = [10, 25, 50, 100];

export default function EditFilterScreen({ route, navigation }) {
   

    return (
        <View style={styles.container}>
            <Text>Test</Text>
        </View>
           
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
