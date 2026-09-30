import React, { useEffect, useRef, useState } from 'react';
import catalog from '../../public/label-assets/catalog.json';
import { Asset, LabelProject } from './model';
import { importAsset } from './storage';

export function AssetLibrary({
    project,
    tab,
    busy,
    onAdd,
    onRename,
    onDelete,
    onError,
}: {
    project: LabelProject;
    tab: string;
    busy: boolean;
    onAdd: (asset: Asset) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onError: (error: string) => void;
}) {
    const [query, setQuery] = useState(''),
        [category, setCategory] = useState('all');
    const [source, setSource] = useState<'bundled' | 'project'>(tab === 'art' ? 'project' : 'bundled');
    const [loading, setLoading] = useState('');
    const [page, setPage] = useState(0);
    const grid = useRef<HTMLDivElement>(null);
    const generation = useRef(0);
    useEffect(() => {
        generation.current++;
        setLoading('');
        return () => {
            generation.current++;
        };
    }, [project.active, project.name, tab]);
    useEffect(() => {
        setCategory('all');
        setQuery('');
        setSource(tab === 'art' ? 'project' : 'bundled');
    }, [tab]);
    const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
    const available = catalog
        .filter((a) => (tab === 'logo' ? a.kind === 'logo' : tab === 'decal' ? a.kind === 'decal' : true))
        .sort(
            (a, b) =>
                Number(b.category === '音频徽标') - Number(a.category === '音频徽标') ||
                Number(b.category === '媒体徽标') - Number(a.category === '媒体徽标')
        );
    const categories = Array.from(new Set(available.map((a) => a.category)));
    const filtered = available.filter(
        (a) => (category === 'all' || a.category === category) && normalize(`${a.name} ${a.category}`).includes(normalize(query))
    );
    const assets = Object.values(project.assets).filter((a) => normalize(a.name).includes(normalize(query)));
    const total = source === 'bundled' ? filtered.length : assets.length;
    const pages = Math.max(1, Math.ceil(total / 24));
    const currentPage = Math.min(page, pages - 1);
    useEffect(() => {
        setPage(0);
    }, [query, category, source, tab]);
    useEffect(() => {
        setPage((p) => Math.min(p, pages - 1));
    }, [pages]);
    const changePage = (next: number) => {
        setPage(next);
        requestAnimationFrame(() => {
            grid.current?.focus();
            grid.current?.scrollIntoView({ block: 'nearest' });
        });
    };
    const insert = async (item: (typeof catalog)[number]) => {
        if (loading || busy) return;
        const request = generation.current;
        setLoading(item.id);
        onError('');
        try {
            const id = `bundled-${item.id}`;
            let asset = project.assets[id];
            if (!asset) {
                const response = await fetch(new URL(`label-assets/${item.file}`, document.baseURI));
                if (!response.ok) throw new Error('内置素材读取失败，请重新安装完整应用');
                const blob = await response.blob();
                asset = {
                    ...(await importAsset(new File([blob], item.file, { type: item.file.endsWith('.png') ? 'image/png' : 'image/webp' }))),
                    id,
                    name: item.name,
                };
            }
            if (request === generation.current) onAdd(asset);
        } catch (e) {
            if (request === generation.current) onError(e instanceof Error ? e.message : String(e));
        } finally {
            if (request === generation.current) setLoading('');
        }
    };
    return (
        <section className="md-asset-library" aria-label="离线素材库">
            <div className="md-library-toolbar">
                <button
                    aria-pressed={source === 'bundled'}
                    className={source === 'bundled' ? 'is-selected' : ''}
                    onClick={() => setSource('bundled')}
                >
                    内置素材 · {available.length}
                </button>
                <button
                    aria-pressed={source === 'project'}
                    className={source === 'project' ? 'is-selected' : ''}
                    onClick={() => setSource('project')}
                >
                    工程素材 · {Object.keys(project.assets).length}
                </button>
                <input
                    aria-label="搜索素材"
                    placeholder="搜索名称，如 Stereo / HiFi"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {source === 'bundled' && (
                    <select aria-label="素材分类" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">全部分类</option>
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                )}
            </div>
            <p className="md-muted">
                {source === 'bundled'
                    ? '图片已随应用离线安装；点击即可加入当前面板和工程。'
                    : '点击图片可重复使用。名称可修改；未使用的素材可移除，支持撤销。'}
            </p>
            <div className="md-library-pagination">
                <span role="status">
                    {total} 项 · 第 {currentPage + 1} / {pages} 页
                </span>
                <button disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}>
                    上一页素材
                </button>
                <button disabled={currentPage === pages - 1} onClick={() => changePage(currentPage + 1)}>
                    下一页素材
                </button>
            </div>
            <div className="md-library-grid" ref={grid} tabIndex={-1} aria-label="素材搜索结果">
                {source === 'bundled'
                    ? filtered.slice(currentPage * 24, (currentPage + 1) * 24).map((a) => (
                          <button
                              className="md-library-tile"
                              key={a.id}
                              title={`${a.name} · ${a.category}`}
                              aria-label={`添加素材 ${a.name}`}
                              disabled={busy || !!loading}
                              onClick={() => insert(a)}
                          >
                              <img loading="lazy" src={new URL(`label-assets/${a.file}`, document.baseURI).href} alt="" />
                              <span>{loading === a.id ? '正在添加…' : a.name}</span>
                              <small>{a.category}</small>
                          </button>
                      ))
                    : assets.slice(currentPage * 24, (currentPage + 1) * 24).map((a) => {
                          const used = Object.values(project.designs).reduce(
                              (sum, d) => sum + (d?.layers.filter((l) => l.assetId === a.id).length || 0),
                              0
                          );
                          return (
                              <div className="md-library-tile" key={a.id}>
                                  <button aria-label={`使用素材 ${a.name}`} disabled={busy} onClick={() => onAdd(a)}>
                                      <img loading="lazy" src={a.data} alt={a.name} />
                                  </button>
                                  <AssetName name={a.name} onRename={(name) => onRename(a.id, name)} />
                                  <div className="md-library-meta">
                                      <small>{used ? `${used} 个图层使用` : '未使用'}</small>
                                      <button
                                          disabled={used > 0 || busy}
                                          aria-label={`移除素材 ${a.name}`}
                                          title={used ? '先删除所有引用此素材的图层（包括隐藏面板）' : '移除素材，可撤销'}
                                          onClick={() => onDelete(a.id)}
                                      >
                                          移除
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                {!(source === 'bundled' ? filtered.length : assets.length) && (
                    <p className="md-muted">没有匹配素材。可更换搜索条件或导入本地图片。</p>
                )}
            </div>
            {source === 'bundled' && (
                <small className="md-muted">图片来源：TaperCraft / vhs.texs.org；来源与文件校验记录随应用保存。</small>
            )}
        </section>
    );
}

function AssetName({ name, onRename }: { name: string; onRename: (name: string) => void }) {
    const [draft, setDraft] = useState(name);
    useEffect(() => setDraft(name), [name]);
    const commit = () => {
        const next = draft.trim();
        if (next && next !== name) onRename(next);
        setDraft(next || name);
    };
    return (
        <input
            aria-label={`素材名称 ${name}`}
            value={draft}
            maxLength={200}
            autoComplete="off"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    commit();
                }
            }}
        />
    );
}
