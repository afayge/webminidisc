// Read-only UI selection shared by the welcome/menu editor launchers in both themes.
let selection: number[] = [];
export function setLabelDiscSelection(indices: number[]) {
    selection = [...indices];
}
export function getLabelDiscSelection(): number[] {
    return [...selection];
}
