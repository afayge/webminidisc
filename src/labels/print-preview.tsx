import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { Fonts, renderDesign, svgDocument } from './render';
import { definition, Face, LabelProject, templateNames } from './model';
import { FoldGuides } from './fold-guides';
import { StudioIcon } from './icons';
import { fitPreviewZoom, mmToPixels } from './preview-scale';

export function DesignPreview({
    project,
    fonts,
    initialFace,
    onClose,
}: {
    project: LabelProject;
    fonts: Fonts;
    initialFace: Face;
    onClose: () => void;
}) {
    const [face, setFace] = useState(initialFace);
    const [zoom, setZoom] = useState(100);
    const [fit, setFit] = useState(true);
    const [showFolds, setShowFolds] = useState(() => {
        try {
            return localStorage.getItem('md-design-preview-show-folds') !== 'false';
        } catch {
            return true;
        }
    });
    const [url, setUrl] = useState('');
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
    const design = project.designs[project.active]!;
    const def = definition(design);
    const output = useMemo(() => renderDesign(project, design, face, fonts), [project, design, face, fonts]);
    useEffect(() => {
        const next = URL.createObjectURL(new Blob([svgDocument(output)], { type: 'image/svg+xml' }));
        setUrl(next);
        return () => URL.revokeObjectURL(next);
    }, [output]);
    useEffect(() => {
        if (!fit || !viewport) return;
        const element = viewport;
        const resize = () => setZoom(fitPreviewZoom(output.width, output.height, element.clientWidth - 48, element.clientHeight - 48));
        const observer = new ResizeObserver(resize);
        observer.observe(element);
        resize();
        return () => observer.disconnect();
    }, [fit, output.width, output.height, viewport]);
    const changeZoom = (delta: number) => {
        setFit(false);
        setZoom((z) => Math.max(10, Math.min(500, z + delta)));
    };
    return (
        <Dialog
            open
            onClose={onClose}
            maxWidth={false}
            aria-labelledby="md-design-preview-title"
            sx={{ zIndex: 1700 }}
            PaperProps={{ className: 'md-studio-surface md-print-preview-dialog' }}
        >
            <header className="md-print-preview-header">
                <div>
                    <h2 id="md-design-preview-title">设计预览</h2>
                    <p>{templateNames[project.active]} · 完整设计</p>
                </div>
                <button aria-label="关闭预览" title="关闭预览" onClick={onClose}>
                    <StudioIcon name="close" />
                </button>
            </header>
            <div className="md-print-preview-toolbar">
                <button aria-label="缩小预览 10%" title="缩小预览 10%" disabled={zoom <= 10} onClick={() => changeZoom(-10)}>
                    <StudioIcon name="minus" />
                </button>
                <span role="status" aria-label="预览缩放比例">
                    {zoom}%
                </span>
                <button aria-label="放大预览 10%" title="放大预览 10%" disabled={zoom >= 500} onClick={() => changeZoom(10)}>
                    <StudioIcon name="plus" />
                </button>
                <button onClick={() => setFit(true)} aria-pressed={fit}>
                    适合窗口
                </button>
                <label className="md-check" title={def.folds.length ? '仅显示或隐藏设计预览折线' : '此模板无折线'}>
                    <input
                        type="checkbox"
                        checked={showFolds && def.folds.length > 0}
                        disabled={!def.folds.length}
                        onChange={(e) => {
                            setShowFolds(e.target.checked);
                            try {
                                localStorage.setItem('md-design-preview-show-folds', String(e.target.checked));
                            } catch {
                                /* Optional UI preference. */
                            }
                        }}
                    />
                    折线
                </label>
                {design.duplex && (
                    <label>
                        预览面{' '}
                        <select value={face} onChange={(e) => setFace(e.target.value as Face)}>
                            <option value="front">正面</option>
                            <option value="back">背面</option>
                        </select>
                    </label>
                )}
            </div>
            <div ref={setViewport} className="md-print-preview-pages md-artwork-preview">
                {url && (
                    <div
                        className="md-design-preview-sheet"
                        style={{ width: (mmToPixels(output.width) * zoom) / 100, height: (mmToPixels(output.height) * zoom) / 100 }}
                    >
                        <img src={url} alt={`${templateNames[project.active]}${face === 'front' ? '正面' : '背面'}完整设计`} />
                        {showFolds && def.folds.length > 0 && (
                            <svg className="md-design-preview-folds" viewBox={`0 0 ${output.width} ${output.height}`} aria-hidden="true">
                                <FoldGuides definition={def} />
                            </svg>
                        )}
                    </div>
                )}
            </div>
            <footer className="md-print-preview-footer">
                <p>缩放仅影响屏幕显示，不改变工程或导出尺寸。</p>
                {output.warnings.length > 0 && (
                    <details>
                        <summary>设计提示 · {output.warnings.length}</summary>
                        <ul>
                            {output.warnings.map((w) => (
                                <li key={w}>{w}</li>
                            ))}
                        </ul>
                    </details>
                )}
            </footer>
        </Dialog>
    );
}
