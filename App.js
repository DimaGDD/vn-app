import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NovelScreen from './src/screens/NovelScreen';
import MainMenu from './src/screens/MainMenu';


export default function App() {
    const [isGameRunning, setIsGameRunning] = useState(false);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safe}>

                {isGameRunning ? (
                    <NovelScreen onExitGame={() => setIsGameRunning(false)} />
                ) : (
                    <MainMenu onStart={() => setIsGameRunning(true)} />
                )}

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#09090b',
    },
});