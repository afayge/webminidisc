import { useTheme } from '@mui/material/styles';

export function useLabelSurface() {
    return { 'data-md-theme': useTheme().palette.mode };
}
