import { getLabelDiscSelection } from './disc-selection';
import { DiscIcon } from './icons';
import React, { lazy, Suspense, useEffect, useState } from 'react';
class EditorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed)
            return (
                <div role="alert" style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#f3f1eb', padding: 40 }}>
                    <p>标签编辑器遇到错误。最近自动保存的草稿仍保存在本机。</p>
                    <button onClick={() => this.setState({ failed: false })}>重新打开编辑器</button>
                </div>
            );
        return this.props.children;
    }
}
const Editor = lazy(() => import('./editor'));
export function openLabelEditor(selected?: number[]) {
    window.dispatchEvent(new CustomEvent('ewmd-label-editor', { detail: selected ?? getLabelDiscSelection() }));
}
export function LabelEditorHost() {
    const [state, setState] = useState<{ open: boolean; loaded: boolean; selected?: number[] }>({ open: false, loaded: false });
    useEffect(() => {
        const open = (e: Event) => setState({ open: true, loaded: true, selected: (e as CustomEvent).detail });
        window.addEventListener('ewmd-label-editor', open);
        return () => window.removeEventListener('ewmd-label-editor', open);
    }, []);
    return (
        <>
            <button
                className="md-label-launch"
                style={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                    zIndex: 1200,
                    padding: '10px 16px',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '1px solid #dbe4f4',
                    background: '#f4f7ff',
                    color: '#315db6',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer',
                }}
                onClick={() => openLabelEditor()}
            >
                <DiscIcon size={22} /> MD Label Editor
            </button>
            {state.loaded && (
                <EditorBoundary>
                    <Suspense
                        fallback={
                            <div
                                role="status"
                                style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#f3f1eb', padding: 40, color: '#315db6' }}
                            >
                                正在打开 MD 编辑器…
                            </div>
                        }
                    >
                        <Editor
                            open={state.open}
                            selectedTracks={state.selected}
                            onClose={() => setState((s) => ({ ...s, open: false }))}
                        />
                    </Suspense>
                </EditorBoundary>
            )}
        </>
    );
}
