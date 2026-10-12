import { View, Text, StyleSheet } from 'react-native';

export default function StatusBar({ state }) {
    return (
        <View style={styles.bar}>
            <Text style={styles.item}>❤️ {state.hp}</Text>
            <Text style={styles.item}>🪙 {state.gold}</Text>
            <Text style={styles.item}>⭐ {state.reputation}</Text>
            <Text style={styles.item}>{state.hasAmulet ? '🔮' : '—'}</Text>
            <Text style={styles.item}>{state.visitedCave ? '🕳️' : '—'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        backgroundColor: '#111',
    },
    item: {color: '#eee', fontSize: 14},
});