export type ColorThemePreference = 'light' | 'dark' | 'system';

export function resolveColorTheme(preference: ColorThemePreference, systemIsDark: boolean): 'light' | 'dark' {
    return preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;
}
