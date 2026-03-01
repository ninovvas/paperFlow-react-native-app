import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import DatePickerField from '../../components/DatePickerField';
import { useFilters } from '../../contexts/filters/useFilters.js';
import { ARXIV_CATEGORIES } from '../../utils/categories.js';
import { useTheme } from '@react-navigation/native';

const MAX_RESULTS_OPTIONS = [10, 25, 50, 100];

export default function EditFilterScreen({ route, navigation }) {
    const { colors } = useTheme();
    const { filterId } = route.params;
    const { getFilterById, updateFilter, deleteFilter } = useFilters();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const filter = getFilterById(filterId);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { name: '', keywords: '', source: 'arxiv', isActive: true, maxResults: '25', dateFrom: '', dateUntil: '' },
    });

    useEffect(() => {
        if (filter) {
            reset({ name: filter.name || '', keywords: (filter.keywords || []).join(', '), source: filter.source || 'arxiv',
                isActive: filter.isActive !== false, maxResults: String(filter.maxResults || 25),
                dateFrom: filter.dateFrom || '', dateUntil: filter.dateUntil || '' });
            setSelectedCategories(filter.categories || []);
        }
    }, [filter, reset]);

    const toggleCategory = (v) => setSelectedCategories((p) => p.includes(v) ? p.filter((c) => c !== v) : [...p, v]);

    const onSubmit = async (data) => {
        const kw = data.keywords.split(',').map((k) => k.trim()).filter(Boolean);
        if (kw.length === 0 && selectedCategories.length === 0) { Alert.alert('Validation', 'Add at least one keyword or category.'); return; }
        try {
            setIsSubmitting(true);
            await updateFilter(filterId, { name: data.name.trim(), keywords: kw, categories: selectedCategories, source: data.source, isActive: data.isActive, maxResults: parseInt(data.maxResults, 10) || 25, dateFrom: data.dateFrom || null, dateUntil: data.dateUntil || null });
            navigation.goBack();
        } catch (err) { Alert.alert('Error', 'Failed to update filter.'); } finally { setIsSubmitting(false); }
    };

    const handleDelete = () => {
        Alert.alert('Delete Filter', `Delete "${filter?.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => { await deleteFilter(filterId); navigation.goBack(); } },
        ]);
    };

    if (!filter) return <View style={styles.center}><ActivityIndicator size="large" color="#1B4F72" /></View>;

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filter Details</Text>
                    <Controller control={control} name="name" rules={{ required: 'Required', minLength: { value: 2, message: 'Min 2' }, maxLength: { value: 50, message: 'Max 50' } }}
                        render={({ field: { onChange, value } }) => <Input label="Filter Name" placeholder="e.g., AI Research" value={value} onChangeText={onChange} error={errors.name?.message} />} />
                    <Controller control={control} name="keywords" rules={{ required: 'Required' }}
                        render={({ field: { onChange, value } }) => <Input label="Keywords" placeholder="transformer, neural network" value={value} onChangeText={onChange} error={errors.keywords?.message} multiline numberOfLines={2} />} />
                    <Text style={styles.hint}>Separate keywords with commas</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paper Source</Text>
                    <Controller control={control} name="source" render={({ field: { onChange, value } }) => (
                        <View style={styles.sourceRow}>
                            {['arxiv', 'crossref', 'both'].map((src) => (
                                <TouchableOpacity key={src} style={[styles.opt, value === src && styles.optActive]} onPress={() => onChange(src)}>
                                    <Text style={[styles.optText, value === src && styles.optTextActive]}>{src === 'arxiv' ? 'arXiv' : src === 'crossref' ? 'Crossref' : 'Both'}</Text>
                                </TouchableOpacity>))}
                        </View>)} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Date Range (Optional)</Text>
                    <Text style={styles.sectionHint}>Only applies to Crossref. arXiv always shows newest papers.</Text>
                    <View style={styles.dateRow}>
                        <Controller control={control} name="dateFrom" render={({ field: { onChange, value } }) => (
                            <DatePickerField label="From" value={value || null} onChange={(d) => onChange(d || '')} placeholder="Start date" />)} />
                        <Controller control={control} name="dateUntil" render={({ field: { onChange, value } }) => (
                            <DatePickerField label="Until" value={value || null} onChange={(d) => onChange(d || '')} placeholder="End date" />)} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Max Results</Text>
                    <Controller control={control} name="maxResults" render={({ field: { onChange, value } }) => (
                        <View style={styles.sourceRow}>
                            {MAX_RESULTS_OPTIONS.map((o) => (
                                <TouchableOpacity key={o} style={[styles.opt, String(value) === String(o) && styles.optActive]} onPress={() => onChange(String(o))}>
                                    <Text style={[styles.optText, String(value) === String(o) && styles.optTextActive]}>{o}</Text>
                                </TouchableOpacity>))}
                        </View>)} />
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCategories(!showCategories)}>
                        <Text style={styles.sectionTitle}>arXiv Categories ({selectedCategories.length})</Text>
                        <Ionicons name={showCategories ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
                    </TouchableOpacity>
                    {showCategories && <View style={styles.grid}>{ARXIV_CATEGORIES.map((cat) => { const s = selectedCategories.includes(cat.value); return (
                        <TouchableOpacity key={cat.value} style={[styles.chip, s && styles.chipActive]} onPress={() => toggleCategory(cat.value)}>
                            <Text style={[styles.chipText, s && styles.chipTextActive]}>{cat.value}</Text></TouchableOpacity>); })}</View>}
                </View>

                <View style={styles.section}>
                    <Controller control={control} name="isActive" render={({ field: { onChange, value } }) => (
                        <View style={styles.switchRow}><View><Text style={styles.switchLabel}>Enable Filter</Text><Text style={styles.switchHint}>Active filters appear in feed</Text></View>
                            <Switch value={value} onValueChange={onChange} trackColor={{ false: '#e2e8f0', true: '#93C5FD' }} thumbColor={value ? '#1B4F72' : '#cbd5e1'} /></View>)} />
                </View>

                <Button title="Save Changes" onPress={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting} icon={<Ionicons name="checkmark" size={20} color="#fff" />} style={{ marginTop: 8 }} />
                <Button title="Delete Filter" variant="danger" onPress={handleDelete} icon={<Ionicons name="trash-outline" size={20} color="#fff" />} style={{ marginTop: 12 }} />
                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20, paddingBottom: 40 }, section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
    sectionHint: { fontSize: 12, color: '#94a3b8', marginTop: -12, marginBottom: 12 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    hint: { fontSize: 12, color: '#94a3b8', marginTop: -8 },
    sourceRow: { flexDirection: 'row', gap: 8 },
    opt: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center' },
    optActive: { borderColor: '#1B4F72', backgroundColor: '#D6EAF8' },
    optText: { fontSize: 14, fontWeight: '600', color: '#64748b' }, optTextActive: { color: '#1B4F72' },
    dateRow: { flexDirection: 'row', gap: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { borderRadius: 8, borderWidth: 1.5, borderColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#fff' },
    chipActive: { borderColor: '#1B4F72', backgroundColor: '#D6EAF8' },
    chipText: { fontSize: 12, color: '#64748b', fontWeight: '500' }, chipTextActive: { color: '#1B4F72', fontWeight: '600' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12 },
    switchLabel: { fontSize: 15, fontWeight: '600', color: '#1e293b' }, switchHint: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
});
