import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { loadStory } from '../api/storyLoader';
import { initialState, applyEffects, checkCondition } from '../state/gameState';
import ChoiceButton from '../components/ChoiceButton';
import StatusBar from '../components/StatusBar';
import CombatScreen from '../components/CombatScreen';
import { BASE } from '../api/config';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function NovelScreen({ onExitGame }) {
    const [story, setStory] = useState(null);
    const [nodeId, setNodeId] = useState(null);
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(null);

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const MAX_WIDTH = 1400;
    const containerWidth = Math.min(width, MAX_WIDTH) - 32;
    const containerHeight = height - 80;

    let artWidth, artHeight, textWidth;

    if (isLandscape) {
        let idealArtWidth = containerWidth * 0.66;
        let idealArtHeight = idealArtWidth * (9 / 16);

        if (idealArtHeight > containerHeight) {
            artHeight = containerHeight;
            artWidth = artHeight * (16 / 9);
        } else {
            artWidth = idealArtWidth;
            artHeight = idealArtHeight;
        }

        textWidth = containerWidth - artWidth - 20;
    }

    const confirmExit = () => {
        onExitGame();
    }

    function takeDamage(amount) {
        setState((s) => applyEffects(s, { hp: -amount }));
    }

    async function bootstrap(force = false) {
        setLoading(true);
        setError(null);
        try {
            const { story, version } = await loadStory({ forceRefresh: force });
            setStory(story);
            setVersion(version);
            setNodeId(story.start);
            setState(initialState);
        } catch (e) {
            setError('Не удалось загрузить сюжет.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        bootstrap(true);
    }, []);

    useEffect(() => {
        const onFocus = () => bootstrap(true);
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('focus', onFocus);
            return () => window.removeEventListener('focus', onFocus);
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#C5A059" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.err}>{error}</Text>
                <ChoiceButton label="Повторить" onPress={() => bootstrap(true)} />
                <ChoiceButton label="Выйти в меню" onPress={onExitGame} />
            </View>
        );
    }

    const node = story.nodes[nodeId];
    if (!node) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#fff', fontFamily: FONT_FAMILY }}>Сцена не найдена</Text>
                <ChoiceButton label="Выйти в меню" onPress={onExitGame} />
            </View>
        );
    }

    const choices = (node.choices || []).filter((c) =>
        checkCondition(state, c.condition)
    );

    function go(nextId, extraEffects) {
        setState((s) => 
            applyEffects(s, { ...(node.effects || {}), ...(extraEffects || {}) }));
        setNodeId(nextId);
    }

    return (
        <View style={styles.root}>
            <StatusBar state={state} onExit={confirmExit} />

            <View style={[styles.gameContainer, isLandscape ? styles.gameContainerLandscape : styles.gameContainerPortrait]}>
                
                <View style={[
                    styles.artWrapper,
                    isLandscape 
                        ? { width: artWidth, height: artHeight, marginRight: 20 }
                        : { width: '100%', height: height * 0.35, marginBottom: 15 }
                ]}>
                    {node.art && (
                        <Image
                            source={{ uri: `${BASE}/${node.art}?v=${version}` }}
                            style={styles.art}
                            resizeMode='cover'
                        />
                    )}
                </View>

                <View style={[
                    styles.textContainer,
                    isLandscape 
                        ? { width: textWidth, height: artHeight }
                        : { flex: 1, width: '100%' }
                ]}>
                    <ScrollView 
                        style={{ flex: 1, width: '100%' }}
                        contentContainerStyle={styles.textScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.text}>{node.text}</Text>

                        {node.ending ? (
                            <View style={styles.endingBox}>
                                <Text style={styles.endingTitle}>Концовка: {node.ending}</Text>
                                <ChoiceButton label="Вернуться в меню" onPress={onExitGame} />
                            </View>
                        ) : node.type === 'combat' ? (
                            <CombatScreen 
                                hp={state.hp}
                                onDamage={takeDamage}
                                onWin={() => go(node.winNode)}
                                onLose={() => go(node.loseNode)}
                            />
                        ) : (
                            <View style={styles.choicesContainer}>
                                {choices.map((c, i) => (
                                    <ChoiceButton 
                                        key={i}
                                        label={c.text}
                                        onPress={() => go(c.next, c.effects)}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { 
        flex: 1, 
        backgroundColor: '#09090b' 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    gameContainer: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        padding: 16,
    },
    gameContainerPortrait: {
        flexDirection: 'column',
        maxWidth: 800, 
    },
    gameContainerLandscape: {
        flexDirection: 'row',
        maxWidth: 1400, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    artWrapper: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2a2a35',
        backgroundColor: '#111',
        overflow: 'hidden', 
    },
    art: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
        overflow: 'hidden',
    },
    textScroll: {
        padding: 20,
        paddingBottom: 30,
        flexGrow: 1, 
    },
    text: {
        color: '#e8e8e8',
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 16,
        fontFamily: FONT_FAMILY,
    },
    choicesContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#333',
        paddingTop: 16,
    },
    endingBox: {
        marginTop: 20,
        alignItems: 'center',
    },
    endingTitle: {
        color: '#C5A059',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
    },
    err: {
        color: '#ff5b5b', 
        marginBottom: 12, 
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontSize: 18,
    },
});