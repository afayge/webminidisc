import { useSyncExternalStore } from 'react';
import { version as rendererVersion } from '../package.json';
import type { ChangelogVersion, ChangelogVersionInjection } from './bridge-types';

export { rendererVersion };
export const versionLabel = (appVersion?: string) =>
    appVersion ? `ElectronWMD ${appVersion} · Web MiniDisc Pro ${rendererVersion}` : `Web MiniDisc Pro ${rendererVersion}`;
const subscribe = (callback: () => void) => {
    window.addEventListener('ewmd-native-ready', callback);
    return () => window.removeEventListener('ewmd-native-ready', callback);
};
export const useAppVersion = () => useSyncExternalStore(subscribe, () => window.native?.appVersion);

export function mergeChangelog(base: ChangelogVersion[], injections: ChangelogVersionInjection[] = []) {
    const result = [...base];
    for (const injection of injections) {
        const existing = result.findIndex((v) => v.name === injection.entry.name);
        if (existing >= 0) result.splice(existing, 1);
        const before = injection.before === null ? -1 : result.findIndex((v) => v.name === injection.before);
        result.splice(before < 0 ? result.length : before, 0, injection.entry);
    }
    return result;
}
