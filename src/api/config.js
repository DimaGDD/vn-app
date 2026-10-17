export const BASE = process.env.EXPO_PUBLIC_STORY_BASE || (
  __DEV__ 
    ? 'story' 
    : 'https://dimagdd.github.io/vn-app/story'
);