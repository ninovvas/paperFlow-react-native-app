import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function DatePickerField({ label, value, onChange, placeholder = 'Select date' }) {
    const [showPicker, setShowPicker] = useState(false);

    const dateValue = value ? new Date(value + 'T00:00:00') : new Date();

    const formatDisplay = (dateStr) => {
        if (!dateStr) return placeholder;
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (event.type === 'dismissed') {
            setShowPicker(false);
            return;
        }

        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
        }

        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
    };

    const handleClear = () => {
        onChange(null);
        setShowPicker(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={styles.field}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
            >
                <Ionicons name="calendar-outline" size={18} color="#64748b" />
                <Text style={[styles.fieldText, !value && styles.placeholder]}>
                    {formatDisplay(value)}
                </Text>
                {value ? (
                    <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close-circle" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                ) : (
                    <Ionicons name="chevron-down" size={16} color="#94a3b8" />
                )}
            </TouchableOpacity>

            {showPicker && (
                <>
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(2000, 0, 1)}
                    />
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity style={styles.doneButton} onPress={() => setShowPicker(false)}>
                            <Text style={styles.doneText}>Done</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 6,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    fieldText: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
    },
    placeholder: {
        color: '#94a3b8',
    },
    doneButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    doneText: {
        fontSize: 16,
        color: '#1B4F72',
        fontWeight: '600',
    },
});
