import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';

import NovelScreen from './src/screens/NovelScreen';
import MainMenu from './src/screens/MainMenu';


export default function App() {
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [volume, setVolume] = useState(0.01);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Cinzel_700Bold,
        MedievalSharp_400Regular,
    });

    if (!fontsLoaded) {
        return <View style={styles.safe} />;
    }

    return (
        <SafeAreaProvider>
            <StatusBar hidden={true} style="light" />

            <View style={styles.safe}>
                {isGameRunning ? (
                    <NovelScreen 
                        onExitGame={() => setIsGameRunning(false)} 
                        volume={volume}    
                    />
                ) : (
                    <MainMenu 
                        onStart={() => setIsGameRunning(true)} 
                        volume={volume}
                        setVolume={setVolume}    
                    />
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