import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { loadStory } from '../api/storyLoader';
import { initialState, applyEffects, checkCondition } from '../state/gameState';
import ChoiceButton from '../components/ChoiceButton';
import StatusBar from '../components/StatusBar';
import { BASE } from '../api/config';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function NovelScreen({ onExitGame }) {
    const [story, setStory] = useState(null);
    const [nodeId, setNodeId] = useState(null);
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(null);

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
        bootstrap();
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
            </View>
        );
    }

    const node = story.nodes[nodeId];
    if (!node) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#fff', fontFamily: FONT_FAMILY }}>Сцена не найдена</Text>
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
            <StatusBar state={state} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.gameContainer}>
                    {node.art && (
                        <Image
                            source={{ uri: `${BASE}/${node.art}?v=${version}` }}
                            style={styles.art}
                            resizeMode='cover'
                        />
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{node.text}</Text>

                        {node.ending ? (
                            <View style={styles.endingBox}>
                                <Text style={styles.endingTitle}>Концовка: {node.ending}</Text>

                                <ChoiceButton
                                    label="Вернуться в меню"
                                    onPress={onExitGame}
                                />
                            </View>
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
                    </View>

                    <Text style={styles.version}>Контент: v{version}</Text>
                </View>
            </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    gameContainer: {
        width: '100%',
        maxWidth: 900,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    art: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2a2a35',
        marginBottom: 20,
        backgroundColor: '#111',
    },
    textContainer: {
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
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
    version: {
        color: '#555',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
        fontFamily: FONT_FAMILY,
    },
});