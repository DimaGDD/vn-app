import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, BackHandler, useWindowDimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { createAudioPlayer } from 'expo-audio';

import { FONT_FAMILY, BASE } from '../api/config';


export default function MainMenu({ onStart, volume, setVolume }) {
    const playerRef = useRef(null);

    const { width, height } = useWindowDimensions();
    const isSmallScreen = width > height && height < 500;

    useEffect(() => {
        const player = createAudioPlayer({ uri: `${BASE}/audio/main_menu.m4a` });
        player.loop = true;
        player.volume = volume;

        try { player.play(); } catch (e) {}
        playerRef.current = player;

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.pause();
                    playerRef.current.remove();
                } catch (e) {}

                playerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.volume = volume;
        }
    }, [volume]);

    const handleVolumeChange = (val) => {
        setVolume(parseFloat(val));
    };

    const handleStartGame = () => {
        if (playerRef.current) {
            try {
                playerRef.current.pause();
                playerRef.current.remove();
            } catch (e) {}

            playerRef.current = null;
        }

        onStart();
    }
    
    const handleExit = () => {
        if (Platform.OS === 'android') {
            BackHandler.exitApp();
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, isSmallScreen && styles.contentLandscape]}>
                <Text style={[styles.title, isSmallScreen && styles.titleLandscape]}>ВЕДЬМАК</Text>
                <Text style={[styles.subtitle, isSmallScreen && styles.subtitleLandscape]}>С трепещущим сердцем</Text>

                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={({ pressed }) => [styles.btn, isSmallScreen && styles.btnLandscape, pressed && styles.pressed]} 
                        onPress={handleStartGame}
                    >
                        <Text style={styles.btnText}>Начать игру</Text>
                    </Pressable>

                    {Platform.OS === 'android' && (
                        <Pressable 
                            style={({ pressed }) => [styles.btn, isSmallScreen && styles.btnLandscape, pressed && styles.pressed]} 
                            onPress={handleExit}
                        >
                            <Text style={styles.btnText}>Выйти</Text>
                        </Pressable>
                    )}
                </View>

                <View style={[styles.volumeContainer, isSmallScreen && styles.volumeContainerLandscape]}>
                    <Text style={styles.volumeIcon}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</Text>

                    <Slider 
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        onValueChange={handleVolumeChange}
                        minimumTrackTintColor='#C5A059'
                        maximumTrackTintColor='#4a4a5a'
                        thumbTintColor='#C5A059'
                    />
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
    contentLandscape: {
        padding: 10,
    },
    title: {
        color: '#C5A059',
        fontSize: 56,
        fontFamily: "Cinzel_700Bold",
        letterSpacing: 6,
        marginBottom: 5,
        textShadowColor: 'rgba(197, 160, 89, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 15,
    },
    titleLandscape: {
        fontSize: 36,
        letterSpacing: 4,
        marginBottom: 0,
    },
    subtitle: {
        color: '#888',
        fontSize: 20,
        fontFamily: "Cinzel_700Bold",
        marginBottom: 60,
    },
    subtitleLandscape: {
        fontSize: 14,
        marginBottom: 15,
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
    btnLandscape: {
        paddingVertical: 10,
        marginBottom: 10,
    },
    pressed: {
        backgroundColor: '#2a2a3d',
        borderColor: '#C5A059',
    },
    btnText: {
        color: '#e8e8e8',
        fontSize: 20,
        fontFamily: FONT_FAMILY,
        letterSpacing: 1,
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20
    },
    volumeContainerLandscape: {
        marginTop: 10,
    },
    volumeIcon: {
        fontSize: 24,
        marginRight: 10
    },
    slider: {
        flex: 1,
        height: 40
    },
});