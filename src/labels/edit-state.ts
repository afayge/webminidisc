/** Transient editing state only: never serialized into an .mdlabel project. */
export function parseNumberDraft(text: string, min: number, max: number, nullable = false): number | null | undefined {
    if (!text.trim()) return nullable ? null : undefined;
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text.trim())) return undefined;
    const value = Number(text);
    return Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

export class TextEditGroup {
    private field = '';
    private last = -Infinity;
    private composing = false;
    end() {
        this.field = '';
        this.last = -Infinity;
        this.composing = false;
    }
    compositionStart(now: number) {
        if (now - this.last >= 800) this.end();
        this.composing = true;
    }
    compositionEnd(now: number) {
        this.composing = false;
        this.last = now;
    }
    remember(field: string, now: number) {
        const remember = field !== this.field || (!this.composing && now - this.last >= 800);
        this.field = field;
        this.last = now;
        return remember;
    }
}

export function moveTrack<T extends { id: string }>(tracks: T[], id: string, target: number): T[] {
    const from = tracks.findIndex((t) => t.id === id);
    if (from < 0 || target < 0 || target >= tracks.length || from === target) return tracks;
    const next = [...tracks];
    next.splice(target, 0, next.splice(from, 1)[0]);
    return next;
}

export function virtualRange(count: number, scrollTop: number, height: number, rowHeight = 48, overscan = 5) {
    const start = Math.max(0, Math.min(count, Math.floor(scrollTop / rowHeight) - overscan));
    const end = Math.min(count, Math.ceil((scrollTop + height) / rowHeight) + overscan);
    return { start, end: Math.max(start, end) };
}
