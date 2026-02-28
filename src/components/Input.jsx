import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    multiline = false,
    numberOfLines = 1,
    style,
    inputStyle,
    editable = true,
    returnKeyType,
    onSubmitEditing,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = secureTextEntry;

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                multiline && styles.multiline,
                multiline && { height: numberOfLines * 24 + 24 },
                error && styles.inputError,
                !editable && styles.disabled,
            ]}>
                <TextInput
                    style={[styles.input, isPassword && styles.inputWithIcon, inputStyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={isPassword && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    editable={editable}
                    autoCorrect={false}
                    blurOnSubmit={!multiline}
                    returnKeyType={returnKeyType || (multiline ? 'default' : 'done')}
                    onSubmitEditing={onSubmitEditing}
                    underlineColorAndroid="transparent"
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#94a3b8"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1e293b',
    },
    inputWithIcon: {
        paddingRight: 48,
    },
    multiline: {
        paddingTop: 14,
        alignItems: 'flex-start',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    disabled: {
        backgroundColor: '#f1f5f9',
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
    },
});

export default Input;
