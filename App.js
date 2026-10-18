import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';

import NovelScreen from './src/screens/NovelScreen';
import MainMenu from './src/screens/MainMenu';


export default function App() {
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [volume, setVolume] = useState(0.01);

    const [fontsLoaded] = useFonts({
        'Cinzel_700Bold': require('./assets/fonts/Cinzel_700Bold.ttf'),
        'Montserrat_400Regular': require('./assets/fonts/Montserrat_400Regular.ttf'),
        'Montserrat_600SemiBold': require('./assets/fonts/Montserrat_600SemiBold.ttf'),
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