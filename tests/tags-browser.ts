import { readUnicodeTag } from '../src/unicode-tags';
import { actions, reducer, RenameType } from '../src/redux/rename-dialog-feature';
import { taggedMP3 } from './tag-fixtures';

function check(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

// This entrypoint is bundled with the production Vite browser configuration.
// Node's native process/stream modules must not mask browser polyfill failures.
export async function runTagChecks() {
    const passed: string[] = [];
    for (const encoding of ['utf8', 'utf16le'] as const) {
        const tag = await readUnicodeTag(taggedMP3('走马 孙燕姿 音樂 😀', encoding), 1000);
        check(tag.title === '走马 孙燕姿 音樂 😀', `${encoding}: Unicode title changed`);
        check(tag.source === 'Tag: fallback.mp3', `${encoding}: source missing`);
        passed.push(`${encoding} tags resolve in the browser bundle`);
    }
    const fallback = await readUnicodeTag(taggedMP3(), 1000);
    check(fallback.title === 'fallback', 'Missing title must fall back to filename');
    passed.push('missing title falls back to filename');

    try {
        await readUnicodeTag(new File(['broken metadata'], 'broken.mp3', { type: 'audio/mpeg' }), 1000);
        throw new Error('Malformed file unexpectedly succeeded');
    } catch (error) {
        check(error instanceof Error && !/timed out|unexpectedly/.test(error.message), 'Malformed file must reject promptly');
    }
    passed.push('malformed input rejects without hanging');

    // Delay actual Blob reads, then release them after timeout to exercise a late
    // parser result as well as recovery and retry through the dialog reducer.
    const file = taggedMP3('late title');
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const slice = file.slice.bind(file);
    file.slice = (...args) => {
        const blob = slice(...args);
        const arrayBuffer = blob.arrayBuffer.bind(blob);
        blob.arrayBuffer = async () => { await gate; return arrayBuffer(); };
        return blob;
    };
    let state = reducer(undefined, { type: 'init' });
    state = reducer(state, actions.setVisible(true));
    state = reducer(state, actions.setCurrentName('existing title'));
    state = reducer(state, actions.setRenameType(RenameType.TRACK));
    state = reducer(state, actions.startTagRead());
    const token = { sessionId: state.sessionId, revision: state.unicodeRevision };
    try {
        await readUnicodeTag(file, 20);
        throw new Error('Stalled read unexpectedly succeeded');
    } catch (error) {
        check(error instanceof Error && /timed out/.test(error.message), 'Stalled read must time out');
        state = reducer(state, actions.finishTagRead({ ...token, error: error.message }));
    } finally {
        release();
    }
    check(!state.tagLoading && !!state.tagError, 'Timeout must unlock the dialog and explain the failure');
    check(state.unicodeTitle === 'existing title', 'Timeout must preserve the title');
    state = reducer(state, actions.setUnicodeName('manual title'));
    state = reducer(state, actions.finishTagRead({ ...token, title: 'late title' }));
    check(state.unicodeTitle === 'manual title', 'Late results must not overwrite an edit');
    state = reducer(state, actions.startTagRead());
    const retry = await readUnicodeTag(file, 1000);
    state = reducer(state, actions.finishTagRead({ sessionId: state.sessionId, revision: state.unicodeRevision, ...retry }));
    check(!state.tagLoading && !state.tagError && state.unicodeTitle === 'late title', 'Retry must recover');
    passed.push('timeout unlocks the dialog, preserves edits, and allows retry');

    state = reducer(state, actions.startTagRead());
    const closedToken = { sessionId: state.sessionId, revision: state.unicodeRevision };
    state = reducer(state, actions.setVisible(false));
    state = reducer(state, actions.setVisible(true));
    state = reducer(state, actions.setUnicodeName('reopened title'));
    state = reducer(state, actions.finishTagRead({ ...closedToken, title: 'old session' }));
    check(!state.tagLoading && state.unicodeTitle === 'reopened title', 'Closed session result must be ignored');
    passed.push('closing and reopening ignores the previous read');
    return passed;
}

(globalThis as any).tagChecks = runTagChecks();
