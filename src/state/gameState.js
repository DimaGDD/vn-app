export const initialState = {
    hp: 100,
    gold: 0,
    reputation: 0,
    checkedClothes: false,
    checkedHands: false,
    checkedBack: false,
    hasSplinter: false,
    hasBook: false,
};

export function applyEffects(state, effects = {}) {
    const next = { ...state };
    for (const [key, op] of Object.entries(effects)) {
        if (typeof op == 'number') {
            next[key] = (next[key] ?? 0) + op;
        } else {
            next[key] = op;
        }
    }

    next.hp = Math.max(0, Math.min(100, next.hp));
    return next;
}

export function checkCondition(state, condition) {
    if (!condition) return true;

    return Object.entries(condition).every(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
            if ('gte' in v) return (state[k] ?? 0) >= v.gte;
            if ('lte' in v) return (state[k] ?? 0) <= v.lte;
            if ('eq' in v) return state[k] === v.eq;
        }

        return state[k] === v;
    });
}