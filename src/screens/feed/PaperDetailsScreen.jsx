import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';


const { width } = Dimensions.get('window');

const PaperDetailsScreen = ({ route, navigation }) => {
   

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View>
                Test
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    
});

export default PaperDetailsScreen;
