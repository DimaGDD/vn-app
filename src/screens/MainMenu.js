import { View, Text, StyleSheet, Pressable, Platform, BackHandler } from 'react-native';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function MainMenu({ onStart }) {
    
    const handleExit = () => {
        if (Platform.OS === 'android') {
            BackHandler.exitApp(); // Закрывает приложение на Android
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>ВЕДЬМАК</Text>
                <Text style={styles.subtitle}>С трепетом в сердце</Text>

                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={({ pressed }) => [styles.btn, pressed && styles.pressed]} 
                        onPress={onStart}
                    >
                        <Text style={styles.btnText}>Начать игру</Text>
                    </Pressable>

                    {/* Показываем кнопку выхода только на Android */}
                    {Platform.OS === 'android' && (
                        <Pressable 
                            style={({ pressed }) => [styles.btn, pressed && styles.pressed]} 
                            onPress={handleExit}
                        >
                            <Text style={styles.btnText}>Выйти</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        padding: 20,
    },
    title: {
        color: '#C5A059', // Золотой
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        letterSpacing: 4,
        marginBottom: 5,
        textShadowColor: 'rgba(197, 160, 89, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: '#888',
        fontSize: 20,
        fontFamily: FONT_FAMILY,
        marginBottom: 60,
        fontStyle: 'italic',
    },
    buttonContainer: {
        width: '100%',
    },
    btn: {
        backgroundColor: '#1a1a24',
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4a4a5a',
        marginBottom: 15,
        alignItems: 'center',
    },
    pressed: {
        backgroundColor: '#2a2a3d',
        borderColor: '#C5A059',
    },
    btnText: {
        color: '#e8e8e8',
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        letterSpacing: 1,
    },
});