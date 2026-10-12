import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NovelScreen from './src/screens/NovelScreen';


export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safe}>
                <NovelScreen />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#0d0d16',
    },
});