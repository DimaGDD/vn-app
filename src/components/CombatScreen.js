import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ChoiceButton from './ChoiceButton';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const ATTACKS = ['top', 'bottom', 'left', 'right', 'magic'];

export default function CombatScreen({ hp, onDamage, onWin, onLose }) {
    const [attack, setAttack] = useState(null);
    const [parries, setParries] = useState(0);

    // Выбираем случайную атаку при старте
    useEffect(() => {
        nextAttack();
    }, []);

    function nextAttack() {
        const random = ATTACKS[Math.floor(Math.random() * ATTACKS.length)];
        setAttack(random);
    }

    function handleAction(action) {
        let isCorrect = false;
        let isParry = false;

        // Логика по твоему ТЗ
        if (attack === 'magic' && action === 'quen') isCorrect = true;
        if (attack === 'bottom' && action === 'dodge') isCorrect = true;
        if (attack === 'top' && action === 'parry') { isCorrect = true; isParry = true; }
        if ((attack === 'left' || attack === 'right') && (action === 'dodge' || action === 'parry')) {
            isCorrect = true;
            if (action === 'parry') isParry = true;
        }

        if (isCorrect) {
            if (isParry) {
                const newParries = parries + 1;
                setParries(newParries);
                if (newParries >= 5) {
                    onWin(); // Победа!
                    return;
                }
            }
            nextAttack(); // Успешное действие, бьет снова
        } else {
            onDamage(20); // Ошибка, отнимаем 20 хп
            if (hp - 20 <= 0) {
                onLose(); // Смерть
                return;
            }
            nextAttack(); // Даже если ошибся, суккуб бьет снова
        }
    }

    if (!attack) return null;

    // Красивое описание атаки для игрока
    let attackText = "";
    if (attack === 'top') attackText = "Суккуб заносит когти для удара сверху!";
    if (attack === 'bottom') attackText = "Суккуб делает подсечку снизу!";
    if (attack === 'left') attackText = "Суккуб атакует с левой стороны!";
    if (attack === 'right') attackText = "Суккуб атакует с правой стороны!";
    if (attack === 'magic') attackText = "Суккуб плетет магический знак!";

    return (
        <View style={styles.container}>
            <Text style={styles.enemyText}>{attackText}</Text>
            <Text style={styles.parryText}>Парировано: {parries} / 5</Text>

            <View style={styles.buttonsContainer}>
                <ChoiceButton label="Парировать (Меч)" onPress={() => handleAction('parry')} />
                <ChoiceButton label="Уклониться" onPress={() => handleAction('dodge')} />
                <ChoiceButton label="Поставить Квен" onPress={() => handleAction('quen')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        alignItems: 'center',
    },
    enemyText: {
        color: '#ff5b5b',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
        marginBottom: 10,
    },
    parryText: {
        color: '#C5A059',
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        marginBottom: 20,
    },
    buttonsContainer: {
        width: '100%',
    }
});