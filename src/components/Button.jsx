import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
}) => {
    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? '#fff' : '#1B4F72'}
                    size="small"
                />
            ) : (
                <>
                    {icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        gap: 8,
    },
    primary: {
        backgroundColor: '#1B4F72',
    },
    secondary: {
        backgroundColor: '#D6EAF8',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1B4F72',
    },
    danger: {
        backgroundColor: '#ef4444',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 18,
        paddingHorizontal: 32,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#1B4F72',
    },
    outlineText: {
        color: '#1B4F72',
    },
    dangerText: {
        color: '#fff',
    },
    ghostText: {
        color: '#1B4F72',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    disabledText: {
        color: '#94a3b8',
    },
});

export default Button;
