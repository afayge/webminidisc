import * as opentype from 'opentype.js';
import { Design, PrintSettings, definition, fullPaths } from './model';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ExportTarget {
    panel?: string;
    piece?: number;
}
/** All coordinates are millimetres. source is in the original panel/artwork space. */
export interface ExportPiece extends ExportTarget {
    id: string;
    source: Rect;
    trimPath?: string;
    bleedBounds: Rect;
    footprint: Rect;
    inset: number;
    markSpace: number;
    folded: boolean;
}
export const MARK_GAP = 1;
export const MARK_LENGTH = 2;
// Includes half the mark stroke and a small rounding allowance.
export const MARK_SPACE = 3.1;
export const MIN_BLEED_GAP = 8;

/** The bundled contours use only absolute M/H/V/C/Z commands. Convert before stroking,
 * so even a non-proportional size adjustment retains a uniform physical bleed width. */
export function fullContour(index: number, width: number, height: number) {
    const path = new opentype.Path();
    const sx = width / 1995.7,
        sy = height / 1897.1;
    let x = 0,
        y = 0;
    for (const part of fullPaths[index].matchAll(/([MHVCZ])([^MHVCZ]*)/g)) {
        const values = (part[2].match(/-?\d*\.?\d+/g) || []).map(Number);
        switch (part[1]) {
            case 'M':
                x = values[0] * sx;
                y = values[1] * sy;
                path.moveTo(x, y);
                break;
            case 'H':
                x = values[0] * sx;
                path.lineTo(x, y);
                break;
            case 'V':
                y = values[0] * sy;
                path.lineTo(x, y);
                break;
            case 'C':
                x = values[4] * sx;
                y = values[5] * sy;
                path.curveTo(values[0] * sx, values[1] * sy, values[2] * sx, values[3] * sy, x, y);
                break;
            case 'Z':
                path.close();
                break;
        }
    }
    const b = path.getBoundingBox();
    return { path: path.toPathData(5), bounds: { x: b.x1, y: b.y1, width: b.x2 - b.x1, height: b.y2 - b.y1 } };
}
export function exportPieces(d: Design, settings: PrintSettings, target: ExportTarget = {}): ExportPiece[] {
    const def = definition(d);
    const split = d.template === 'label' || d.template === 'full';
    const specs: (ExportTarget & { id: string; source: Rect; trimPath?: string })[] = [];
    if (split || target.panel) {
        for (const panel of def.panels.filter((p) => !target.panel || target.panel === p.id)) {
            if (d.template === 'full' && panel.id === 'main') {
                for (const piece of target.piece === undefined ? [0, 1, 2] : [target.piece]) {
                    if (piece < 0 || piece > 2 || !Number.isInteger(piece)) throw new Error('无效的全面标签裁片');
                    const contour = fullContour(piece, panel.width, panel.height);
                    specs.push({ id: `main-${piece}`, panel: 'main', piece, source: contour.bounds, trimPath: contour.path });
                }
            } else specs.push({ id: panel.id, panel: panel.id, source: { x: 0, y: 0, width: panel.width, height: panel.height } });
        }
    } else specs.push({ id: d.template, source: { x: 0, y: 0, width: def.width, height: def.height } });
    if (!specs.length) throw new Error('未找到导出面板');
    return specs.map((spec) => {
        const folded = !spec.panel && def.folds.length > 0;
        const markSpace = settings.crop || (settings.folds && folded) ? MARK_SPACE : 0;
        const b = settings.bleed,
            inset = b + markSpace;
        return {
            ...spec,
            folded,
            markSpace,
            inset,
            bleedBounds: { x: -b, y: -b, width: spec.source.width + b * 2, height: spec.source.height + b * 2 },
            footprint: { x: -inset, y: -inset, width: spec.source.width + inset * 2, height: spec.source.height + inset * 2 },
        };
    });
}
export function pieceGap(a: ExportPiece, b: ExportPiece, requested: number) {
    return Math.max(requested, MIN_BLEED_GAP - a.markSpace - b.markSpace);
}
