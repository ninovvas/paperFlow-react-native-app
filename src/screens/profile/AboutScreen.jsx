import { View, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
               
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 24, paddingBottom: 40 },
   
});
