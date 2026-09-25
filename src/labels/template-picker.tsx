import React, { useId, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { definition, newDesign, TemplateId, templateIds, templateNames } from './model';
import { StudioIcon } from './icons';

const templates = Object.fromEntries(templateIds.map((id) => [id, definition(newDesign(id))]));
export function TemplateThumbnail({ id }: { id: TemplateId }) {
    const key = useId().replace(/:/g, '');
    const def = templates[id];
    return (
        <svg className="md-template-thumbnail" viewBox={`-2 -2 ${def.width + 4} ${def.height + 4}`} aria-hidden="true">
            {def.panels.map((p) => {
                const clip = `${key}-${p.id}`;
                const shape = p.clipPaths ? (
                    p.clipPaths.map((d, i) => (
                        <path key={i} d={d} transform={`scale(${p.width / p.clipViewBox![0]} ${p.height / p.clipViewBox![1]})`} />
                    ))
                ) : (
                    <rect width={p.width} height={p.height} />
                );
                const narrow = p.width < 15;
                return (
                    <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
                        <defs>
                            <clipPath id={clip}>{shape}</clipPath>
                        </defs>
                        <g clipPath={`url(#${clip})`}>
                            <rect width={p.width} height={p.height} fill="#f3f6f7" />
                            <rect width={p.width} height={p.height * 0.62} fill="#b6d8dc" />
                            {!narrow && (
                                <>
                                    <circle cx={p.width * 0.7} cy={p.height * 0.22} r={p.width * 0.16} fill="#ffffff" />
                                    <path
                                        d={`M0 ${p.height * 0.62} L${p.width * 0.45} ${p.height * 0.2} L${p.width} ${p.height * 0.62}Z`}
                                        fill="#44858b"
                                    />
                                    <rect
                                        x={p.width * 0.08}
                                        y={p.height * 0.68}
                                        width={p.width * 0.72}
                                        height={p.height * 0.035}
                                        fill="#24343c"
                                    />
                                    {[0.77, 0.82, 0.87].map((y, i) => (
                                        <rect
                                            key={i}
                                            x={p.width * 0.08}
                                            y={p.height * y}
                                            width={p.width * (0.62 - i * 0.1)}
                                            height={p.height * 0.015}
                                            fill="#6c9298"
                                        />
                                    ))}
                                </>
                            )}
                            {narrow && (
                                <path
                                    d={`M${p.width / 2} ${p.height * 0.1}v${p.height * 0.7}`}
                                    stroke="#006c78"
                                    strokeWidth={Math.min(1, p.width * 0.2)}
                                />
                            )}
                        </g>
                        <g fill="none" stroke="#5d6d76" strokeWidth=".4">
                            {shape}
                        </g>
                    </g>
                );
            })}
            {def.folds.map((x) => (
                <path key={x} d={`M${x} 0V${def.height}`} stroke="#fff" strokeWidth=".7" strokeDasharray="2 1.5" />
            ))}
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
                <TemplateThumbnail id={value} />
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
                    className: 'md-studio-surface md-template-menu',
                    sx: {
                        width: 300,
                        maxWidth: 'calc(100vw - 24px)',
                        borderRadius: '8px',
                        mt: 0.75,

                        boxShadow: '0 12px 32px #24343c26',
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
                        <TemplateThumbnail id={id} />
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
