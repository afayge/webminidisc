import { Buffer } from 'buffer';

// Real ID3 frames followed by valid MPEG audio frames; no parser mocks.
export function taggedMP3(title?: string, encoding: 'utf8' | 'utf16le' = 'utf8') {
    let frames = Buffer.alloc(0);
    if (title !== undefined) {
        const text = encoding === 'utf8' ? Buffer.from(title) : Buffer.concat([Buffer.from([255, 254]), Buffer.from(title, 'utf16le')]);
        const value = Buffer.concat([Buffer.from([encoding === 'utf8' ? 3 : 1]), text]);
        const header = Buffer.alloc(10);
        header.write('TIT2');
        header.writeUInt32BE(value.length, 4);
        frames = Buffer.concat([header, value]);
    }
    const id3 = Buffer.alloc(10);
    id3.write('ID3');
    id3[3] = encoding === 'utf8' ? 4 : 3;
    let size = frames.length;
    for (let i = 9; i >= 6; i--) {
        id3[i] = size & 127;
        size >>>= 7;
    }
    const audio = Buffer.alloc(417 * 3);
    for (let i = 0; i < 3; i++) Buffer.from([255, 251, 144, 0]).copy(audio, i * 417);
    return new File([id3, frames, audio], 'fallback.mp3', { type: 'audio/mpeg' });
}
