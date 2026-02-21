import { View, StyleSheet, ScrollView } from 'react-native';


export default function SettingsScreen() {

    const bg = settings.darkMode ? '#0f172a' : '#f8fafc';
    
    return (
        <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
});
