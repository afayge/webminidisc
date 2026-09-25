import { useEffect, useRef, useState } from 'react';

const DEFAULT_HEIGHT = 220;
const MIN_HEIGHT = 96;
const PROPERTY_MIN_HEIGHT = 160;
const STORAGE_KEY = 'md-layer-list-height';

export function useInspectorHeight() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [preferredHeight, setPreferredHeight] = useState(() => {
        try {
            const saved = Number(localStorage.getItem(STORAGE_KEY));
            if (Number.isFinite(saved) && saved >= MIN_HEIGHT) return saved;
        } catch {
            /* Optional UI preference. */
        }
        return DEFAULT_HEIGHT;
    });
    const [maxHeight, setMaxHeight] = useState(DEFAULT_HEIGHT);
    const drag = useRef<{ y: number; height: number } | null>(null);

    useEffect(() => {
        if (!container) return;
        const fixedRows = Array.from(container.children).filter((child) =>
            child.matches('.md-panel-heading, .md-mini-buttons, .md-inspector-resizer')
        );
        const measure = () => {
            const fixedHeight = fixedRows.reduce((sum, row) => sum + row.getBoundingClientRect().height, 0);
            setMaxHeight(Math.max(MIN_HEIGHT, Math.floor(container.clientHeight - fixedHeight - PROPERTY_MIN_HEIGHT)));
        };
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        fixedRows.forEach((row) => observer.observe(row));
        measure();
        return () => {
            observer.disconnect();
            drag.current = null;
        };
    }, [container]);

    const height = Math.max(MIN_HEIGHT, Math.min(maxHeight, preferredHeight));
    const adjust = (value: number) => {
        const next = Math.max(MIN_HEIGHT, Math.min(maxHeight, Math.round(value)));
        setPreferredHeight(next);
        try {
            localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
            /* Optional UI preference. */
        }
    };

    return { setContainer, height, maxHeight, minHeight: MIN_HEIGHT, adjust, drag, reset: () => adjust(DEFAULT_HEIGHT) };
}
