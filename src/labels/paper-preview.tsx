import React, { useEffect, useRef, useState } from 'react';
import { LabelProject } from './model';
import { Fonts, PrintResult, printPages } from './render';
import { fitPreviewZoom, mmToPixels } from './preview-scale';
import { StudioIcon } from './icons';

/** A result is exportable only for the exact project/font snapshot that produced it. */
export function usePrintLayout(open: boolean, project: LabelProject, fonts: Fonts | null) {
    const [result, setResult] = useState<{ project: LabelProject; fonts: Fonts; output?: PrintResult; error?: string } | null>(null);
    useEffect(() => {
        if (!open || !fonts) {
            setResult(null);
            return;
        }
        const timer = setTimeout(() => {
            try {
                setResult({ project, fonts, output: printPages(project, fonts) });
            } catch (e) {
                setResult({ project, fonts, error: e instanceof Error ? e.message : String(e) });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [open, project, fonts]);
    const current = open && result?.project === project && result?.fonts === fonts ? result : null;
    return { output: current?.output, error: current?.error, pending: open && !current };
}

export function PaperPreview({ layout, duplex }: { layout: ReturnType<typeof usePrintLayout>; duplex: boolean }) {
    const [page, setPage] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [fit, setFit] = useState(true);
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
    const [image, setImage] = useState<{ svg: string; url: string } | null>(null);
    const previousOutput = useRef(layout.output);
    const output = layout.output;
    const index = Math.min(page, Math.max(0, (output?.pages.length || 1) - 1));
    const svg = output?.pages[index];
    const url = image?.svg === svg ? image?.url : undefined;
    useEffect(() => {
        if (output && output !== previousOutput.current) {
            setPage((p) => Math.min(p, output.pages.length - 1));
            previousOutput.current = output;
        }
    }, [output]);
    useEffect(() => {
        if (!svg) {
            setImage(null);
            return;
        }
        const next = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
        setImage({ svg, url: next });
        return () => URL.revokeObjectURL(next);
    }, [svg]);
    useEffect(() => {
        if (!fit || !viewport || !output) return;
        const resize = () =>
            setZoom(fitPreviewZoom(output.paperSize.width, output.paperSize.height, viewport.clientWidth - 40, viewport.clientHeight - 40));
        const observer = new ResizeObserver(resize);
        observer.observe(viewport);
        resize();
        return () => observer.disconnect();
    }, [fit, viewport, output]);
    const changeZoom = (delta: number) => {
        setFit(false);
        setZoom((z) => Math.max(10, Math.min(500, z + delta)));
    };
    return (
        <section className="md-paper-preview" aria-label="纸张排版预览" aria-busy={layout.pending}>
            <h3>纸张预览</h3>
            <div className="md-paper-controls">
                <button aria-label="上一页" disabled={!output || index === 0} onClick={() => setPage(index - 1)}>
                    上一页
                </button>
                <span role="status">
                    {output
                        ? `第 ${index + 1} / ${output.pages.length} 页${duplex ? ` · ${index % 2 ? '背面' : '正面'}` : ''}`
                        : '尚无排版'}
                </span>
                <button aria-label="下一页" disabled={!output || index >= output.pages.length - 1} onClick={() => setPage(index + 1)}>
                    下一页
                </button>
            </div>
            <div className="md-paper-controls">
                <button aria-label="缩小纸张预览" disabled={!output || zoom <= 10} onClick={() => changeZoom(-10)}>
                    <StudioIcon name="minus" />
                </button>
                <span>{zoom}%</span>
                <button aria-label="放大纸张预览" disabled={!output || zoom >= 500} onClick={() => changeZoom(10)}>
                    <StudioIcon name="plus" />
                </button>
                <button disabled={!output} aria-pressed={fit} onClick={() => setFit(true)}>
                    适合窗口
                </button>
            </div>
            <div className="md-paper-viewport" ref={setViewport}>
                {layout.pending && <p role="status">正在更新排版…</p>}
                {layout.error && (
                    <p role="alert" className="md-field-error">
                        {layout.error}
                    </p>
                )}
                {output && url && (
                    <img
                        src={url}
                        alt={`打印第 ${index + 1} 页${duplex ? (index % 2 ? '背面' : '正面') : ''}`}
                        width={(mmToPixels(output.paperSize.width) * zoom) / 100}
                        height={(mmToPixels(output.paperSize.height) * zoom) / 100}
                    />
                )}
            </div>
            <p className="md-muted">
                {output && `${output.paperSize.width} × ${output.paperSize.height} mm · `}缩放仅影响显示，按 100% 实际尺寸导出。
            </p>
        </section>
    );
}
