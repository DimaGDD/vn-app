import { View, Text, StyleSheet, Platform } from 'react-native';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function StatusBar({ state }) {


    return (
        <View style={styles.bar}>

            <View style={styles.statBox}>
                <Text style={styles.value}>❤️ {state.hp}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={styles.value}>🪙 {state.gold}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={styles.value}>⭐ {state.reputation}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={[styles.value, !state.hasSplinter && styles.inactive]}>{state.hasSplinter ? '🗡️' : '—'}</Text>
            </View>

            <View style={styles.statBox}>
                <Text style={[styles.value, !state.hasBook && styles.inactive]}>{state.hasBook ? '📖' : '—'}</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#0d0d12',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#C5A059',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    statBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        color: '#e8e8e8',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
    },
    inactive: {
        color: '#444',
    }
});