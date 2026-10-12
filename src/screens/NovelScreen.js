import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { loadStory } from '../api/storyLoader';
import { initialState, applyEffects, checkCondition } from '../state/gameState';
import ChoiceButton from '../components/ChoiceButton';
import StatusBar from '../components/StatusBar';

const BASE = process.env.EXPO_PUBLIC_STORY_BASE || 'https://dimagdd.github.io/vn-app/story';

export default function NovelScreen() {
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
                <ActivityIndicator />
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
                <Text style={{ color: '#fff' }}>Сцена не найдена</Text>
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
            <ScrollView contentContainerStyle={styles.content}>
                {node.art && (
                    <Image
                        source={{ uri: `${BASE}/${node.art}?v=${version}` }}
                        style={styles.art}
                        resizeMode='cover'
                    />
                )}
                <Text style={styles.text}>{node.text}</Text>

                {node.ending ? (
                    <View>
                        <Text style={styles.endingTitle}>Концовка: {node.ending}</Text>
                        <ChoiceButton
                            label="Начать заного"
                            onPress={() => {
                                setState(initialState);
                                setNodeId(story.start);
                            }}
                        />
                    </View>
                ) : (
                    choices.map((c, i) => (
                        <ChoiceButton 
                            key={i}
                            label={c.text}
                            onPress={() => go(c.next, c.effects)}
                        />
                    ))
                )}

                <Text style={styles.version}>Контент: v{version}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0d0d16' },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: { padding: 16 },
    art: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        backgroundColor: '#222',
    },
    text: {
        color: '#f2f2f2',
        fontSize: 17,
        lineHeight: 24,
        marginBottom: 16,
    },
    endingTitle: {
        color: '#ffd166',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    err: {color: '#ff5b5b', marginBottom: 12, textAlign: 'center'},
    version: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
    },
});