import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import NovelScreen from './src/screens/NovelScreen';
import MainMenu from './src/screens/MainMenu';


export default function App() {
    const [isGameRunning, setIsGameRunning] = useState(false);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View style={styles.safe} />;
    }

    return (
        <SafeAreaProvider>
            <StatusBar hidden={true} style="light" />

            <View style={styles.safe}>
                {isGameRunning ? (
                    <NovelScreen onExitGame={() => setIsGameRunning(false)} />
                ) : (
                    <MainMenu onStart={() => setIsGameRunning(true)} />
                )}
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#09090b',
    },
});