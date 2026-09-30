import { ThemeProvider } from '@mui/material/styles';
import { useAppTheme } from '../app-theme';
import { useLabelSurface } from './theme';
import './theme.css';
import { getLabelDiscSelection } from './disc-selection';
import { DiscIcon } from './icons';
import React, { lazy, Suspense, useEffect, useState } from 'react';
function HostStatus({ children, role }: React.PropsWithChildren<{ role: 'alert' | 'status' }>) {
    const surface = useLabelSurface();
    return (
        <div {...surface} className="md-studio-surface md-host-status" role={role}>
            {children}
        </div>
    );
}
class EditorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed)
            return (
                <HostStatus role="alert">
                    <p>标签编辑器遇到错误。最近自动保存的草稿仍保存在本机。</p>
                    <button onClick={() => this.setState({ failed: false })}>重新打开编辑器</button>
                </HostStatus>
            );
        return this.props.children;
    }
}
const Editor = lazy(() => import('./editor'));
export function openLabelEditor(selected?: number[]) {
    window.dispatchEvent(new CustomEvent('ewmd-label-editor', { detail: selected ?? getLabelDiscSelection() }));
}
export function LabelEditorHost() {
    const theme = useAppTheme();
    return (
        <ThemeProvider theme={theme}>
            <LabelEditorHostContent />
        </ThemeProvider>
    );
}
function LabelEditorHostContent() {
    const surface = useLabelSurface();
    const [state, setState] = useState<{ open: boolean; loaded: boolean; selected?: number[] }>({ open: false, loaded: false });
    useEffect(() => {
        const open = (e: Event) => setState({ open: true, loaded: true, selected: (e as CustomEvent).detail });
        window.addEventListener('ewmd-label-editor', open);
        return () => window.removeEventListener('ewmd-label-editor', open);
    }, []);
    return (
        <>
            <button className="md-studio-surface md-label-launch" {...surface} onClick={() => openLabelEditor()}>
                <DiscIcon size={22} /> MD Label Editor
            </button>
            {state.loaded && (
                <EditorBoundary>
                    <Suspense fallback={<HostStatus role="status">正在打开 MD 编辑器…</HostStatus>}>
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
