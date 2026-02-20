import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './components/Button';
import Input from './components/Input';
import EmptyState from './components/EmptyState';
import { useState } from 'react';

export default function App() {
    const [text, setText] = useState('');
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>PaperFlow</Text>
            <Text style={styles.subtitle}>Component Preview</Text>
            <View style={styles.section}>
                <Input label="Test Input" placeholder="Type something..." value={text} onChangeText={setText} />
                <Button title="Primary Button" onPress={() => {}} style={{ marginTop: 12 }} />
                <Button title="Secondary" variant="secondary" onPress={() => {}} style={{ marginTop: 8 }} />
                <Button title="Outline" variant="outline" onPress={() => {}} style={{ marginTop: 8 }} />
            </View>
            <EmptyState icon="newspaper-outline" title="No papers yet" message="Components are ready!" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 60, backgroundColor: '#f8fafc' },
    title: { fontSize: 28, fontWeight: '800', color: '#1B4F72', textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
    section: { marginBottom: 24 },
});

