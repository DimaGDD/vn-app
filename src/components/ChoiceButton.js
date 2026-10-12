import { Pressable, Text, StyleSheet } from 'react-native';

export default function ChoiceButton({ label, onPress, disabled }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.btn,
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#2a2a3d',
        padding: 14,
        borderRadius: 10,
        marginVertical: 6,
    },
    pressed: { opacity: 0.7 },
    disabled: { opacity: 0.3 },
    text: { color: '#fff', fontSize: 16, textAlign: 'center' },
});