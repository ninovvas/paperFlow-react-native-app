import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';

const FEATURES = [
    { icon: 'newspaper-outline', title: 'Personalized Feed', desc: 'Get papers tailored to your research interests from arXiv and Crossref' },
    { icon: 'filter-outline', title: 'Smart Filters', desc: 'Set keywords, categories, date ranges, and sources to curate your daily reading' },
    { icon: 'search-outline', title: 'Powerful Search', desc: 'Search across multiple academic databases directly from the app' },
    { icon: 'camera-outline', title: 'Scan Paper Titles', desc: 'Take a photo of a paper title and instantly find it with OCR' },
    { icon: 'heart-outline', title: 'Save Favorites', desc: 'Bookmark papers for later reading and organize your library' },
    { icon: 'share-outline', title: 'Share & Collaborate', desc: 'Easily share papers with colleagues via PDF links' },
];

export default function WelcomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.hero}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="newspaper" size={48} color="#fff" />
                    </View>
                    <Text style={styles.appName}>PaperFlow</Text>
                    <Text style={styles.tagline}>Your Academic Paper Discovery Hub</Text>
                    <Text style={styles.subtitle}>
                        Stay up-to-date with the latest research from arXiv and Crossref — all in one app.
                    </Text>
                </View>

                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    {FEATURES.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <Ionicons name={feature.icon} size={24} color="#1B4F72" />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc}>{feature.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.sourcesSection}>
                    <Text style={styles.sectionTitle}>Data Sources</Text>
                    <View style={styles.sourcesRow}>
                        <View style={styles.sourceChip}>
                            <Text style={styles.sourceChipName}>arXiv</Text>
                            <Text style={styles.sourceChipDesc}>2M+ papers</Text>
                        </View>
                        <View style={styles.sourceChip}>
                            <Text style={styles.sourceChipName}>Crossref</Text>
                            <Text style={styles.sourceChipDesc}>130M+ works</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.ctaSection}>
                    <Button title="Get Started" size="large" onPress={() => navigation.navigate('Register')}
                        icon={<Ionicons name="person-add" size={20} color="#fff" />} style={styles.ctaButton} />
                    <Button title="I Already Have an Account" variant="outline" onPress={() => navigation.navigate('Login')}
                        icon={<Ionicons name="log-in-outline" size={20} color="#1B4F72" />} style={styles.ctaButton} />
                </View>

                <Text style={styles.footer}>Free • No ads • Open source data</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { paddingBottom: 40 },
    hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 32, backgroundColor: '#1B4F72', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    logoContainer: { width: 90, height: 90, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    appName: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    tagline: { fontSize: 16, color: '#93C5FD', fontWeight: '600', marginTop: 6, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#D6EAF8', marginTop: 12, textAlign: 'center', lineHeight: 20 },
    featuresSection: { padding: 24 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    featureCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#D6EAF8', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    featureText: { flex: 1 },
    featureTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 2 },
    featureDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
    sourcesSection: { paddingHorizontal: 24, marginBottom: 24 },
    sourcesRow: { flexDirection: 'row', gap: 12 },
    sourceChip: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
    sourceChipName: { fontSize: 16, fontWeight: '700', color: '#1B4F72' },
    sourceChipDesc: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    ctaSection: { paddingHorizontal: 24, gap: 12 },
    ctaButton: { width: '100%' },
    footer: { textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 24 },
});
