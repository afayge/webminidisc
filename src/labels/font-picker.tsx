import React, { useState } from 'react';
import { Layer, LocalFontRef } from './model';
import { Fonts, GlyphFont } from './render';
import { listLocalFonts, loadLocalFont, LocalFontData } from './local-fonts';

export function FontPicker({
    layer,
    fonts,
    onChange,
    onLoad,
}: {
    layer: Layer;
    fonts: Fonts | null;
    onChange: (patch: Partial<Layer>) => void;
    onLoad: (ref: LocalFontRef, font: GlyphFont) => void;
}) {
    const [list, setList] = useState<LocalFontData[] | null>(null);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const load = async () => {
        setBusy(true);
        setError('');
        try {
            setList(await listLocalFonts());
        } catch (e) {
            setError(String(e));
        } finally {
            setBusy(false);
        }
    };
    const choose = async (postscriptName: string) => {
        const data = list?.find((f) => f.postscriptName === postscriptName);
        if (!data) return;
        setBusy(true);
        setError('');
        try {
            const ref = { postscriptName: data.postscriptName, family: data.family, style: data.style };
            const font = await loadLocalFont(ref);
            onLoad(ref, font);
            onChange({ localFont: ref });
        } catch (e) {
            setError(`无法使用此字体：${String(e)}`);
        } finally {
            setBusy(false);
        }
    };
    const filtered =
        list?.filter((f) =>
            `${f.family} ${f.style} ${f.fullName} ${f.postscriptName}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        ) || [];
    return (
        <div className="md-font-picker">
            <label className="md-field">
                <span>字体</span>
                <select
                    value={layer.localFont ? 'local' : layer.font}
                    onChange={(e) => {
                        if (e.target.value !== 'local') onChange({ font: e.target.value as Layer['font'], localFont: undefined });
                    }}
                >
                    <option value="sans">思源黑体</option>
                    <option value="serif">思源宋体</option>
                    <option value="mono">等宽排版</option>
                    {layer.localFont && (
                        <option value="local">
                            {layer.localFont.family} · {layer.localFont.style}
                        </option>
                    )}
                </select>
            </label>
            <button type="button" onClick={load} disabled={busy}>
                {busy ? '正在读取字体…' : '加载本机字体'}
            </button>
            {layer.localFont && !fonts?.local?.[layer.localFont.postscriptName] && (
                <p role="alert">
                    缺少或尚未加载：{layer.localFont.family} · {layer.localFont.style}。暂用内置字体显示；请加载原字体或选择替代字体后导出。
                </p>
            )}
            {list && (
                <div className="md-font-options">
                    <input
                        type="search"
                        aria-label="搜索本机字体"
                        placeholder="搜索字体名称或样式"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        size={6}
                        aria-label="本机字体与样式"
                        value={layer.localFont?.postscriptName || ''}
                        disabled={busy}
                        onChange={(e) => choose(e.target.value)}
                    >
                        <option value="" disabled>
                            选择字体与样式
                        </option>
                        {filtered.map((f) => (
                            <option key={f.postscriptName} value={f.postscriptName}>
                                {f.family} · {f.style}
                            </option>
                        ))}
                    </select>
                    <small>{filtered.length} 个样式 · 工程仅保存字体引用</small>
                    <button type="button" onClick={() => setList(null)}>
                        收起字体列表
                    </button>
                </div>
            )}
            {error && <p role="alert">{error}</p>}
        </div>
    );
}
