import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const FEATURES = [
    { icon: 'newspaper-outline', label: 'Personalized Feed' },
    { icon: 'search-outline', label: 'Multi-Source Search' },
    { icon: 'filter-outline', label: 'Smart Filters' },
    { icon: 'heart-outline', label: 'Favorites Library' },
    { icon: 'camera-outline', label: 'OCR Scan to Search' },
    { icon: 'person-outline', label: 'Profile & Settings' },
];

export default function AboutScreen() {
    const { colors } = useTheme();
    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="newspaper" size={40} color="#1B4F72" />
                    </View>
                    <Text style={styles.appName}>PaperFlow</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                    <Text style={styles.tagline}>Academic Paper Discovery Hub</Text>
                </View>

                <Text style={styles.description}>
                    PaperFlow helps researchers and students stay up-to-date with the latest academic papers.
                    Create personalized filters, search across arXiv and Crossref, and save your favorite papers for later reading.
                </Text>

                <Text style={styles.sectionTitle}>Data Sources</Text>
                <TouchableOpacity style={styles.sourceCard} onPress={() => Linking.openURL('https://arxiv.org')}>
                    <View><Text style={styles.sourceName}>arXiv.org</Text><Text style={styles.sourceDesc}>2M+ preprints in Physics, Mathematics, CS, and more</Text></View>
                    <Ionicons name="open-outline" size={18} color="#94a3b8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sourceCard} onPress={() => Linking.openURL('https://www.crossref.org')}>
                    <View><Text style={styles.sourceName}>Crossref</Text><Text style={styles.sourceDesc}>130M+ scholarly works with DOI metadata</Text></View>
                    <Ionicons name="open-outline" size={18} color="#94a3b8" />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Features</Text>
                <View style={styles.featuresGrid}>
                    {FEATURES.map((f, i) => (
                        <View key={i} style={styles.featureItem}>
                            <Ionicons name={f.icon} size={22} color="#1B4F72" />
                            <Text style={styles.featureLabel}>{f.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Tech Stack</Text>
                <Text style={styles.techText}>React Native • Expo • React Navigation • React Hook Form • Axios • json-server-auth • arXiv API • Crossref API • OCR.space API</Text>

                <Text style={styles.credits}>Built with React Native & Expo{'\n'}SoftUni React Native Course 2026</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 24, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 24 },
    iconContainer: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#D6EAF8', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    appName: { fontSize: 28, fontWeight: '800', color: '#1B4F72' },
    version: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
    tagline: { fontSize: 15, color: '#64748b', marginTop: 4 },
    description: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12, marginTop: 8 },
    sourceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    sourceName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    sourceDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    featureLabel: { fontSize: 13, color: '#475569', fontWeight: '500' },
    techText: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 24 },
    credits: { textAlign: 'center', fontSize: 13, color: '#94a3b8', lineHeight: 20, marginTop: 16 },
});
