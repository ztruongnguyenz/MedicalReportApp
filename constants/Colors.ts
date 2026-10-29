export const Palette = {
  light: {
    bg: '#f0f3f1',
    surface: '#FFFFFF',
    surface2: '#E7EEE9',
    border: '#CFDBD4',
    ink: '#12211C',
    inkMuted: '#191f1c',
    accent: '#09554c',
    accentText: '#F4FBF9',
    success: '#256B44',
    danger: '#A93A3A',
    dangerSoft: '#FAEAE9',
    amber: '#bd8112',
  },
  dark: {
    bg: '#191817',
    surface: '#222120',
    surface2: '#2B2A28',
    border: '#403E3B',
    ink: '#ECEAE8',
    inkMuted: '#AEABA6',
    accent: '#52C1AF',
    accentText: '#12211C',
    success: '#6BC996',
    danger: '#E38A85',
    dangerSoft: '#382221',
    amber: '#E0AC4F',
  },
};

export default {
  light: {
    text: Palette.light.ink,
    background: Palette.light.bg,
    tint: Palette.light.accent,
    tabIconDefault: Palette.light.border,
    tabIconSelected: Palette.light.accent,
  },
  dark: {
    text: Palette.dark.ink,
    background: Palette.dark.bg,
    tint: Palette.dark.accent,
    tabIconDefault: Palette.dark.border,
    tabIconSelected: Palette.dark.accent,
  },
};