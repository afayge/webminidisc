import React from 'react';

/** MiniDisc cartridge: clipped case, shutter and the disc hub, legible at 22px. */
export function DiscIcon({ size = 28 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M7 3h17l5 5v19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
            <path d="M21 3v11h8M8 24h10" />
            <circle cx="12" cy="13" r="5.5" />
            <circle cx="12" cy="13" r="1.5" />
        </svg>
    );
}

const paths = {
    open: <path d="M3 9V6a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v1M3 10h18l-2 9a1.3 1.3 0 0 1-1.3 1H5a2 2 0 0 1-2-2Z" />,
    save: (
        <>
            <path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
            <path d="M7 3v6h9V3M7 21v-7h10v7" />
        </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    down: <path d="m7 10 5 5 5-5" />,
    undo: <path d="m8 5-5 5 5 5M3 10h10a7 7 0 0 1 7 7v2" />,
    redo: <path d="m16 5 5 5-5 5m5-5H11a7 7 0 0 0-7 7v2" />,
    settings: (
        <>
            <path d="M4 6h16M4 12h16M4 18h16" />
            <path d="M8 4v4m8 2v4m-7 2v4" />
        </>
    ),
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />,
    print: (
        <>
            <path d="M7 8V3h10v5M7 17H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-3M7 14h10v7H7Z" />
            <path d="M17 11h.01" />
        </>
    ),
    preview: (
        <>
            <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
        </>
    ),
    visible: (
        <>
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    hidden: (
        <>
            <path d="m3 3 18 18M9.5 5.3A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.3 4.2M6.3 6.3A20 20 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.7-1.7M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    minus: <path d="M5 12h14" />,
    grip: (
        <>
            {[6, 12, 18].flatMap((y) =>
                [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" stroke="none" />)
            )}
        </>
    ),
    text: <path d="M4 6V4h16v2M12 4v16m-4 0h8" />,
    image: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8" cy="8" r="1.5" />
            <path d="m3 17 5-5 4 4 4-6 5 7" />
        </>
    ),
    badge: (
        <>
            <path d="m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9Z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    sticker: (
        <>
            <path d="M5 3h14a2 2 0 0 1 2 2v8l-8 8H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
            <path d="M13 21v-6a2 2 0 0 1 2-2h6" />
        </>
    ),
    background: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 16 16 3M8 21 21 8M3 9l6-6m6 18 6-6" />
        </>
    ),
    code: (
        <>
            <rect x="3" y="3" width="6" height="6" rx=".75" />
            <rect x="15" y="3" width="6" height="6" rx=".75" />
            <rect x="3" y="15" width="6" height="6" rx=".75" />
            <path d="M15 15h6v6h-3v-3h-3v3M12 3v6m-9 3h6m3 0h3m6 0h-3M12 18v3" />
        </>
    ),
    ruler: (
        <>
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M7 6v5m5-5v3m5-3v5" />
        </>
    ),
    panel: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
        </>
    ),
    layers: (
        <>
            <path d="m12 3 10 5-10 5L2 8Zm-9 9 9 4.5 9-4.5m-18 5 9 4.5 9-4.5" />
        </>
    ),
};
export type IconName = keyof typeof paths;

/** Interface decoration only; accessible names belong to the owning controls. */
export function StudioIcon({ name, size = 18 }: { name: IconName; size?: 16 | 18 }) {
    return (
        <svg
            className="md-ui-icon"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {paths[name]}
        </svg>
    );
}
