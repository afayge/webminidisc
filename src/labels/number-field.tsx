import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { parseNumberDraft } from './edit-state';

export const NumberReset = createContext(0);
type Props = {
    label: string;
    value: number | null;
    onChange: (n: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    nullable?: boolean;
    integer?: boolean;
};
function NumberInput({ label, value, onChange, min = -1000, max = 1000, step = 0.1, nullable = false, integer = false }: Props) {
    const format = (n: number | null) => (n === null ? '' : String(Number(n.toFixed(3))));
    const [draft, setDraft] = useState(() => format(value));
    const [error, setError] = useState('');
    const edited = useRef(false);
    const reset = useContext(NumberReset);
    const errorId = useId();
    useEffect(() => {
        setDraft(format(value));
        setError('');
        edited.current = false;
    }, [value, reset]);
    const submit = () => {
        if (!edited.current) return;
        edited.current = false;
        const next = parseNumberDraft(draft, min, max, nullable);
        if (next === undefined || (integer && next !== null && !Number.isInteger(next))) {
            setDraft(format(value));
            setError(
                nullable
                    ? `${label}需为非负数字；留空表示未知，已恢复原值。`
                    : `${label}需为 ${min}–${max} 范围内的${integer ? '整数' : '数字'}，已恢复原值。`
            );
        } else {
            setDraft(format(next));
            setError('');
            if (next !== value) onChange(next);
        }
    };
    return (
        <label className="md-field">
            <span>{label}</span>
            <input
                type="text"
                aria-label={label}
                inputMode="decimal"
                role="spinbutton"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value ?? undefined}
                autoComplete="off"
                value={draft}
                aria-describedby={error ? errorId : undefined}
                onChange={(e) => {
                    edited.current = true;
                    setDraft(e.target.value);
                    setError('');
                }}
                onBlur={submit}
                onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        submit();
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        e.stopPropagation();
                        edited.current = false;
                        setDraft(format(value));
                        setError('');
                    }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const parsed = parseNumberDraft(draft, min, max, nullable);
                        const base = parsed ?? value ?? 0;
                        const next = Math.max(
                            min,
                            Math.min(max, Number(((integer ? Math.round(base) : base) + (e.key === 'ArrowUp' ? step : -step)).toFixed(3)))
                        );
                        edited.current = false;
                        setDraft(format(next));
                        setError('');
                        if (next !== value) onChange(next);
                    }
                }}
            />
            {error && (
                <small id={errorId} role="status" className="md-field-error">
                    {error}
                </small>
            )}
        </label>
    );
}
export function NumberField(props: Omit<Props, 'value' | 'onChange' | 'nullable'> & { value: number; onChange: (n: number) => void }) {
    return <NumberInput {...props} onChange={(n) => props.onChange(n!)} />;
}
export function DurationField(props: Pick<Props, 'label' | 'value' | 'onChange'>) {
    return <NumberInput {...props} min={0} max={Number.MAX_SAFE_INTEGER} step={1} nullable />;
}
