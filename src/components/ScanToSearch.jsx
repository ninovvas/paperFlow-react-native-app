import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    launchCameraAsync,
    requestCameraPermissionsAsync,
} from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Button from './Button';




export default function ScanToSearch({ onSearch, style = {} }) {
    const [imageUri, setImageUri] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [ocrStatus, setOcrStatus] = useState(''); // 'success', 'partial', 'failed'

    const handleTakePhoto = async () => {
        const { status } = await requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed to scan paper titles.');
            return;
        }

        try {
            const result = await launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
                aspect: [16, 4],
            });

            if (!result.canceled && result.assets?.[0]) {
                const uri = result.assets[0].uri;
                setImageUri(uri);
                setShowPreview(true);
                setOcrStatus('');
                await performOCR(uri);
            }
        } catch (err) {
            console.error('Camera error:', err);
            Alert.alert('Error', 'Failed to open camera.');
        }
    };

    const performOCR = async (uri) => {
        setIsProcessing(true);
        setExtractedText('');
        setOcrStatus('');

        try {
            // Read image as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log('Sending image to OCR.space...');

            // Send to OCR.space free API
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            formData.append('OCREngine', '2'); // Engine 2 is better for photos

            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                    apikey: 'helloworld', // Free demo key from OCR.space
                },
                body: formData,
            });

            const data = await response.json();
            console.log('📸 OCR response:', JSON.stringify(data).substring(0, 200));

            if (data?.ParsedResults?.[0]?.ParsedText) {
                const text = data.ParsedResults[0].ParsedText
                    .replace(/\r\n/g, ' ')
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (text.length > 0) {
                    setExtractedText(text);
                    setOcrStatus('success');
                    console.log(`OCR extracted: "${text}"`);
                } else {
                    setOcrStatus('failed');
                }
            } else {
                console.log('OCR: No text found');
                setOcrStatus('failed');
            }
        } catch (err) {
            console.error('OCR error:', err);
            setOcrStatus('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSearch = () => {
        const text = extractedText.trim();
        if (!text) {
            Alert.alert('Empty Text', 'Please enter or correct the paper title.');
            return;
        }
        onSearch(text);
        handleReset();
    };

    const handleReset = () => {
        setImageUri(null);
        setExtractedText('');
        setShowPreview(false);
        setIsProcessing(false);
        setOcrStatus('');
    };

    if (!showPreview) {
        return (
            <View style={[styles.container, style]}>
                <TouchableOpacity style={styles.scanButton} onPress={handleTakePhoto}>
                    <View style={styles.scanIconContainer}>
                        <Ionicons name="camera-outline" size={24} color="#1B4F72" />
                    </View>
                    <View style={styles.scanTextContainer}>
                        <Text style={styles.scanTitle}>Scan Paper Title</Text>
                        <Text style={styles.scanHint}>
                            Take a photo → auto-extract text → search
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.previewContainer, style]}>
            <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Scanned Image</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Ionicons name="close-circle" size={24} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            {isProcessing ? (
                <View style={styles.processingRow}>
                    <ActivityIndicator size="small" color="#1B4F72" />
                    <Text style={styles.processingText}>Extracting text with OCR...</Text>
                </View>
            ) : (
                <>
                    {ocrStatus === 'success' && (
                        <View style={styles.statusRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                            <Text style={styles.statusSuccess}>Text extracted! Edit if needed:</Text>
                        </View>
                    )}
                    {ocrStatus === 'failed' && (
                        <View style={styles.statusRow}>
                            <Ionicons name="alert-circle" size={16} color="#f59e0b" />
                            <Text style={styles.statusWarning}>Could not extract text. Please type manually:</Text>
                        </View>
                    )}

                    <TextInput
                        style={styles.textInput}
                        placeholder="Paper title will appear here..."
                        placeholderTextColor="#94a3b8"
                        value={extractedText}
                        onChangeText={setExtractedText}
                        multiline
                        numberOfLines={3}
                        autoFocus={ocrStatus === 'failed'}
                    />

                    <View style={styles.actionRow}>
                        <Button
                            title="Retake"
                            variant="outline"
                            size="small"
                            onPress={handleTakePhoto}
                            icon={<Ionicons name="camera" size={16} color="#1B4F72" />}
                            style={styles.halfButton}
                        />
                        <Button
                            title="Search"
                            size="small"
                            onPress={handleSearch}
                            icon={<Ionicons name="search" size={16} color="#fff" />}
                            style={styles.halfButton}
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginHorizontal: 16, marginVertical: 8 },
    scanButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    scanIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#D6EAF8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    scanTextContainer: { flex: 1 },
    scanTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    scanHint: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    previewContainer: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    previewTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    previewImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 12, backgroundColor: '#f1f5f9' },
    processingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
    processingText: { fontSize: 14, color: '#64748b' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    statusSuccess: { fontSize: 13, color: '#22c55e', fontWeight: '500' },
    statusWarning: { fontSize: 13, color: '#f59e0b', fontWeight: '500' },
    textInput: {
        backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12,
        padding: 12, fontSize: 14, color: '#1e293b', minHeight: 60, textAlignVertical: 'top', marginBottom: 12,
    },
    actionRow: { flexDirection: 'row', gap: 8 },
    halfButton: { flex: 1 },
});
