import { Platform } from "react-native";

export const BASE = process.env.EXPO_PUBLIC_STORY_BASE || (
    (Platform.OS === 'web' && __DEV__) ? 'story' :'https://dimagdd.github.io/vn-app/story'
);

export const FONT_FAMILY = 'Montserrat_400Regular';