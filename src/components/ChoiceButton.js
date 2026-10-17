import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { FONT_FAMILY } from '../api/config';


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
        backgroundColor: '#1a1a24',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#4a4a5a',
        alignItems: 'center',
    },
    pressed: {
        backgroundColor: '#2a2a3d',
        borderColor: '#C5A059',
    },
    disabled: { 
        opacity: 0.4
    },
    text: {
        color: '#e8e8e8', 
        fontSize: 17,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        letterSpacing: 0.5,
    },
});