import React from 'react';

/** Rounded MiniDisc cartridge; the shutter and hub remain legible at 22px. */
export function DiscIcon({ size = 28 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M7 3.5h10.2a2 2 0 0 1 1.4.6l1.3 1.3a2 2 0 0 1 .6 1.4v10.7a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V7a2 2 0 0 1 .6-1.4l1.5-1.5A2 2 0 0 1 7 3.5Z" />
            <path d="M15.5 3.5v8h5M7.5 17h5" />
            <circle cx="9.5" cy="10.5" r="3" />
            <circle cx="9.5" cy="10.5" r=".8" fill="currentColor" stroke="none" />
        </svg>
    );
}

// Common 24px grid, rounded terminals and generous interior space at small sizes.
const paths = {
    open: <path d="M3.5 8V6.5a2 2 0 0 1 2-2h3.4a2 2 0 0 1 1.5.7l1.1 1.3H18a2.5 2.5 0 0 1 2.5 2.5v8a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V8Zm0 1h17" />,
    save: (
        <>
            <path d="M6.5 3.5h10a2 2 0 0 1 1.4.6l2 2a2 2 0 0 1 .6 1.4v10a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3Z" />
            <path d="M8 3.5v5h7.5v-5M7.5 20.5V15a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v5.5" />
        </>
    ),
    close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
    down: <path d="m7 9.5 5 5 5-5" />,
    up: <path d="m7 14.5 5-5 5 5" />,
    arrowUp: <path d="M12 19V5m-5 5 5-5 5 5" />,
    arrowDown: <path d="M12 5v14m-5-5 5 5 5-5" />,
    undo: <path d="m8 5-4.5 4.5L8 14M4 9.5h10a6 6 0 0 1 6 6V19" />,
    redo: <path d="m16 5 4.5 4.5L16 14m4-4.5H10a6 6 0 0 0-6 6V19" />,
    settings: (
        <>
            <path d="M4 7h3m4 0h9M4 17h9m4 0h3" />
            <circle cx="9" cy="7" r="2" />
            <circle cx="15" cy="17" r="2" />
        </>
    ),
    download: <path d="M12 3.5v12m-4.5-4.5 4.5 4.5 4.5-4.5M4.5 16v2a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-2" />,
    print: (
        <>
            <path d="M7.5 8V3.5h9V8M7.5 17h-2a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2" />
            <rect x="7.5" y="14" width="9" height="6.5" rx="1" />
            <circle cx="17" cy="11" r=".8" fill="currentColor" stroke="none" />
        </>
    ),
    preview: (
        <>
            <path d="M8 3.5H6a2.5 2.5 0 0 0-2.5 2.5v2m12-4.5H18A2.5 2.5 0 0 1 20.5 6v2m0 8v2a2.5 2.5 0 0 1-2.5 2.5h-2m-8 0H6A2.5 2.5 0 0 1 3.5 18v-2" />
            <rect x="7.5" y="7.5" width="9" height="9" rx="2" />
        </>
    ),
    visible: (
        <>
            <path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </>
    ),
    hidden: <path d="m4 4 16 16M9 6.5a10 10 0 0 1 3-.5c6 0 9 6 9 6a17 17 0 0 1-2.4 3.2M6.3 7.6A17 17 0 0 0 3 12s3 6 9 6a10 10 0 0 0 4.3-1M9.6 11.3a2.5 2.5 0 0 0 3.1 3.1" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5.5 12 4.2 4.2L18.5 7" />,
    minus: <path d="M5 12h14" />,
    grip: (
        <>
            {[7, 12, 17].flatMap((y) =>
                [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.15" fill="currentColor" stroke="none" />)
            )}
        </>
    ),
    text: <path d="M5 7V4.5h14V7m-7-2.5v15m-3 0h6" />,
    image: (
        <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
            <path d="m4 17 4.5-4.5 3.5 3.5 3.5-5 5 6" />
        </>
    ),
    badge: (
        <>
            <path d="M9.5 4a3.5 3.5 0 0 1 5 0l1.2 1.2 1.6.3a3.5 3.5 0 0 1 3 4l-.3 1.7.3 1.6a3.5 3.5 0 0 1-2.5 4.3l-1.6.4-1.3 1.4a4 4 0 0 1-5.8 0l-1.3-1.4-1.6-.4a3.5 3.5 0 0 1-2.5-4.3l.3-1.6-.3-1.7a3.5 3.5 0 0 1 3-4l1.6-.3Z" />
            <circle cx="12" cy="11.5" r="2.5" />
        </>
    ),
    sticker: (
        <>
            <path d="M7.5 3.5h9a4 4 0 0 1 4 4V13L13 20.5H7.5a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z" />
            <path d="M13 20.5V16a3 3 0 0 1 3-3h4.5" />
        </>
    ),
    background: (
        <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
            <path d="m4 16 12-12M8 20l12-12" />
        </>
    ),
    code: (
        <>
            <rect x="4" y="4" width="6" height="6" rx="1.5" />
            <rect x="14" y="4" width="6" height="6" rx="1.5" />
            <rect x="4" y="14" width="6" height="6" rx="1.5" />
            <path d="M14 14h6v6h-6v-2" />
        </>
    ),
    ruler: (
        <>
            <rect x="3.5" y="6.5" width="17" height="11" rx="3" />
            <path d="M8 6.5v4m4-4V9m4-2.5v4" />
        </>
    ),
    panel: (
        <>
            <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
            <path d="M9 4.5v15" />
        </>
    ),
    layers: <path d="m4 8 7.1-3.6a2 2 0 0 1 1.8 0L20 8l-7.1 3.6a2 2 0 0 1-1.8 0Zm0 5 7.1 3.6a2 2 0 0 0 1.8 0L20 13M4 18l7.1 3.1a2 2 0 0 0 1.8 0L20 18" />,
};
export type IconName = keyof typeof paths;

// Selected tools have their own closed silhouettes and transparent cutouts.
// A fill on the outline paths would close open strokes and obscure the symbol.
const filledPaths: Partial<Record<IconName, React.ReactNode>> = {
    text: <path d="M5 3.5h14a1 1 0 0 1 1 1V7a1 1 0 0 1-2 0V6h-4.5v12.5H15a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h1.5V6H6v1a1 1 0 0 1-2 0V4.5a1 1 0 0 1 1-1Z" />,
    image: (
        <path
            fillRule="evenodd"
            d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM10 8.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM5 17v-.5l3.5-3.5 3.5 3.5 3.5-5L19 16v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
        />
    ),
    badge: (
        <path
            fillRule="evenodd"
            d="M9.5 4a3.5 3.5 0 0 1 5 0l1.2 1.2 1.6.3a3.5 3.5 0 0 1 3 4l-.3 1.7.3 1.6a3.5 3.5 0 0 1-2.5 4.3l-1.6.4-1.3 1.4a4 4 0 0 1-5.8 0l-1.3-1.4-1.6-.4a3.5 3.5 0 0 1-2.5-4.3l.3-1.6-.3-1.7a3.5 3.5 0 0 1 3-4l1.6-.3ZM14.5 11.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
        />
    ),
    sticker: <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5V12h-5a4 4 0 0 0-4 4v5H7.5A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM14 16a2 2 0 0 1 2-2h4l-6 6Z" />,
    background: (
        <path
            fillRule="evenodd"
            d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM5 7.5v9c0 .7.3 1.3.7 1.8L18.3 5.7A2.5 2.5 0 0 0 16.5 5h-9A2.5 2.5 0 0 0 5 7.5Z"
        />
    ),
    code: (
        <path
            fillRule="evenodd"
            d="M5.5 3.5h3A2 2 0 0 1 10.5 5.5v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2ZM5.5 5.5v3h3v-3ZM15.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2ZM15.5 5.5v3h3v-3ZM5.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2ZM5.5 15.5v3h3v-3ZM13.5 13.5h7v7h-7v-3h2v1h3v-3h-5Z"
        />
    ),
    ruler: <path d="M7 6h.2v4.5a.8.8 0 0 0 1.6 0V6h2.4v3a.8.8 0 0 0 1.6 0V6h2.4v4.5a.8.8 0 0 0 1.6 0V6h.2a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4Z" />,
};

/** Interface decoration only; accessible names belong to the owning controls. */
export function StudioIcon({ name, size = 20, variant = 'outline' }: { name: IconName; size?: 16 | 18 | 20; variant?: 'outline' | 'filled' }) {
    const filled = variant === 'filled' ? filledPaths[name] : undefined;
    return (
        <svg
            className="md-ui-icon"
            data-variant={filled ? 'filled' : 'outline'}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {filled || paths[name]}
        </svg>
    );
}
