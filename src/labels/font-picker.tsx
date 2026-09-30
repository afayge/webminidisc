import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { virtualRange } from './edit-state';
import { Layer, LocalFontRef } from './model';
import { Fonts, GlyphFont } from './render';
import { listLocalFonts, loadLocalFont, loadLocalFontPreview, LocalFontData } from './local-fonts';

function LocalFontList({
    items,
    selected,
    busy,
    onChoose,
}: {
    items: LocalFontData[];
    selected?: string;
    busy: boolean;
    onChoose: (name: string) => void;
}) {
    const root = useRef<HTMLDivElement>(null);
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [focused, setFocused] = useState('');
    const [scrollTop, setScrollTop] = useState(0);
    const [height, setHeight] = useState(240);
    const id = useId();
    const focusName = [focused, selected, items[0]?.postscriptName].find((name) => items.some((f) => f.postscriptName === name));
    const focusIndex = items.findIndex((f) => f.postscriptName === focusName);
    const { start, end } = virtualRange(items.length, scrollTop, height);
    const visible = useMemo(() => items.slice(start, end), [items, start, end]);
    const reveal = (index: number) => {
        const list = root.current;
        if (!list) return;
        const top = index * 48;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (top + 48 > list.scrollTop + list.clientHeight) list.scrollTop = top + 48 - list.clientHeight;
        setScrollTop(list.scrollTop);
    };
    useEffect(() => {
        const list = root.current;
        if (!list) return;
        const observer = new ResizeObserver(() => setHeight(list.clientHeight));
        observer.observe(list);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        // Search and reopening retain the selected option when it is still present.
        const index = Math.max(
            0,
            items.findIndex((f) => f.postscriptName === selected)
        );
        setFocused(items[index]?.postscriptName || '');
        if (root.current) root.current.scrollTop = index * 48;
        setScrollTop(root.current?.scrollTop || 0);
    }, [items]);
    useEffect(() => {
        const list = root.current;
        if (!list) return;
        let active = true;
        const byName = new Map(visible.map((f) => [f.postscriptName, f]));
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    observer.unobserve(entry.target);
                    const data = byName.get((entry.target as HTMLElement).dataset.fontName!);
                    if (data)
                        void loadLocalFontPreview(data).then((family) => {
                            if (active && family) setPreviews((current) => ({ ...current, [data.postscriptName]: family }));
                        });
                }
            },
            { root: list }
        );
        list.querySelectorAll('[data-font-name]').forEach((row) => observer.observe(row));
        return () => {
            active = false;
            observer.disconnect();
        };
    }, [visible]);

    return (
        <div
            ref={root}
            className="md-local-font-list"
            role="listbox"
            tabIndex={0}
            aria-label="本机字体与样式"
            aria-busy={busy}
            aria-disabled={busy}
            aria-activedescendant={focusIndex >= start && focusIndex < end ? `${id}-${focusIndex}` : undefined}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            onKeyDown={(e) => {
                if (['Enter', ' '].includes(e.key)) {
                    e.preventDefault();
                    if (!busy && focusName) onChoose(focusName);
                }
                if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !items.length) return;
                e.preventDefault();
                const next = Math.max(
                    0,
                    Math.min(
                        items.length - 1,
                        e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : focusIndex + (e.key === 'ArrowDown' ? 1 : -1)
                    )
                );
                setFocused(items[next].postscriptName);
                reveal(next);
            }}
        >
            <div role="presentation" style={{ height: items.length * 48, position: 'relative' }}>
                {visible.map((f, offset) => (
                    <button
                        key={f.postscriptName}
                        id={`${id}-${start + offset}`}
                        type="button"
                        role="option"
                        className={`md-local-font-option${focusName === f.postscriptName ? ' is-focused' : ''}`}
                        data-font-name={f.postscriptName}
                        aria-selected={selected === f.postscriptName}
                        aria-disabled={busy}
                        aria-posinset={start + offset + 1}
                        aria-setsize={items.length}
                        tabIndex={-1}
                        title={`${f.family} · ${f.style}`}
                        aria-label={`${f.family} · ${f.style}`}
                        style={{ fontFamily: previews[f.postscriptName], position: 'absolute', top: (start + offset) * 48 }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            root.current?.focus({ preventScroll: true });
                            setFocused(f.postscriptName);
                            if (!busy) onChoose(f.postscriptName);
                        }}
                    >
                        {f.family} · {f.style}
                    </button>
                ))}
            </div>
            {!items.length && <div className="md-local-font-empty">没有匹配的字体</div>}
        </div>
    );
}

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
    const filtered = useMemo(
        () =>
            list?.filter((f) =>
                `${f.family} ${f.style} ${f.fullName} ${f.postscriptName}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
            ) || [],
        [list, search]
    );
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
                    <LocalFontList items={filtered} selected={layer.localFont?.postscriptName} busy={busy} onChoose={choose} />
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
