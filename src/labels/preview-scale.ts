export const mmToPixels = (mm: number) => (mm * 96) / 25.4;
// Screen-only pixels per millimetre. The ruler, label and hit targets share this
// scale; physical geometry and the export pipeline never use it.
export function fitEditorScale(width: number, height: number, viewportWidth: number, viewportHeight: number): number {
    if (width <= 0 || height <= 0) return 1;
    return Math.max(0.01, Math.min(8, Math.max(1, viewportWidth - 104) / width, Math.max(1, viewportHeight - 104) / height));
}
export function fitPreviewZoom(width: number, height: number, availableWidth: number, availableHeight: number): number {
    return Math.max(
        10,
        Math.min(500, Math.floor(Math.min(availableWidth / mmToPixels(width), availableHeight / mmToPixels(height)) * 10) * 10)
    );
}
