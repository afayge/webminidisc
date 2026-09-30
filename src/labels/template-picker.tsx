import { useLabelSurface } from './theme';
import React, { useId, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { definition, newDesign, TemplateId, templateIds, templateNames } from './model';
import { StudioIcon } from './icons';

const templates = Object.fromEntries(templateIds.map((id) => [id, definition(newDesign(id))]));
export function TemplateThumbnail({ id, selected = false }: { id: TemplateId; selected?: boolean }) {
    const def = templates[id];
    // Normalize only the thumbnail. Real template and export geometry stay in model.ts.
    const scale = Math.min(50 / def.width, 42 / def.height);
    const width = def.width * scale;
    const height = def.height * scale;
    const line = { vectorEffect: 'non-scaling-stroke' as const };
    const folded = def.folds.length > 0;
    return (
        <svg
            className="md-template-thumbnail"
            viewBox="0 0 56 48"
            data-selected={selected}
            fill={selected ? 'currentColor' : 'none'}
            stroke={selected ? 'none' : 'currentColor'}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <g transform={`translate(${(56 - width) / 2} ${(48 - height) / 2})`}>
                {folded && !selected ? (
                    <>
                        <rect width={width} height={height} rx={1.2} {...line} />
                        {def.folds.map((x) => (
                            <path key={x} d={`M${x * scale} 0V${height}`} {...line} />
                        ))}
                    </>
                ) : (
                    def.panels.map((p, index) => {
                        const w = p.width * scale;
                        const h = p.height * scale;
                        // Transparent fold gaps remain legible even in the 44px trigger.
                        const insetLeft = folded && index > 0 ? 0.8 : 0;
                        const insetRight = folded && index < def.panels.length - 1 ? 0.8 : 0;
                        return (
                            <g key={p.id} transform={`translate(${p.x * scale} ${p.y * scale})`}>
                                {p.clipPaths ? (
                                    <>
                                        {/* Optical simplification of the full label's three pieces.
                                            3.2-unit clearances keep fixed-width outlines separate. */}
                                        <path
                                            d={`M1.5 0H${w - 1.5}Q${w} 0 ${w} 1.5V${h * 0.347}H${w * 0.6 + 1.5}Q${w * 0.6} ${h * 0.347} ${w * 0.6} ${h * 0.347 + 1.5}V${h * 0.928 - 1.5}Q${w * 0.6} ${h * 0.928} ${w * 0.6 + 1.5} ${h * 0.928}H${w}V${h - 1}Q${w} ${h} ${w - 1} ${h}H1Q0 ${h} 0 ${h - 1}V1.5Q0 0 1.5 0Z`}
                                            {...line}
                                        />
                                        {[
                                            { top: h * 0.347 + 3.2, bottom: h * 0.64 - 1.6 },
                                            { top: h * 0.64 + 1.6, bottom: h * 0.928 - 3.2 },
                                        ].map(({ top, bottom }, i) => (
                                            <rect
                                                key={i}
                                                x={w * 0.6 + 3.2}
                                                y={top}
                                                width={w * 0.4 - 3.2}
                                                height={bottom - top}
                                                rx={0.9}
                                                {...line}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <rect
                                        x={insetLeft}
                                        width={w - insetLeft - insetRight}
                                        height={h}
                                        rx={Math.min(1.2, (w - insetLeft - insetRight) / 2)}
                                        {...line}
                                    />
                                )}
                            </g>
                        );
                    })
                )}
            </g>
        </svg>
    );
}
export function TemplatePicker({
    value,
    onChange,
    disabled,
}: {
    value: TemplateId;
    onChange: (id: TemplateId) => void;
    disabled: boolean;
}) {
    const surface = useLabelSurface();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const menuId = useId();
    return (
        <>
            <button
                className="md-template-trigger"
                aria-label={`选择模板：${templateNames[value]}`}
                aria-haspopup="menu"
                aria-expanded={!!anchor}
                aria-controls={anchor ? menuId : undefined}
                disabled={disabled}
                onClick={(e) => setAnchor(e.currentTarget)}
            >
                <TemplateThumbnail id={value} selected />
                <span>
                    <small>模板</small>
                    <strong>{templateNames[value]}</strong>
                </span>
                <StudioIcon name="down" />
            </button>
            <Menu
                id={menuId}
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(null)}
                sx={{ zIndex: 1600 }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    ...surface,
                    className: 'md-studio-surface md-template-menu',
                    sx: {
                        width: 300,
                        maxWidth: 'calc(100vw - 24px)',
                        mt: 0.75,
                    },
                }}
                MenuListProps={{ 'aria-label': '模板选择' }}
            >
                {templateIds.map((id) => (
                    <MenuItem
                        className="md-template-option"
                        key={id}
                        selected={value === id}
                        role="menuitemradio"
                        aria-checked={value === id}
                        onClick={() => {
                            onChange(id);
                            setAnchor(null);
                        }}
                    >
                        <TemplateThumbnail id={id} selected={value === id} />
                        <span>
                            <strong>{templateNames[id]}</strong>
                            <small>
                                {templates[id].width.toFixed(1)} × {templates[id].height.toFixed(1)} mm · 默认展开
                            </small>
                        </span>
                        {value === id && (
                            <span className="md-template-check" aria-hidden="true">
                                <StudioIcon name="check" size={16} />
                            </span>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
