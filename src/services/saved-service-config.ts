import type { CustomParameterInfo, CustomParameters } from '../custom-parameters';

// New optional capabilities must not invalidate a previously saved connection.
export function restoreServiceParameters(schema: CustomParameterInfo[], saved: unknown): CustomParameters | null {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return null;
    const values = saved as Record<string, unknown>;
    if (Object.keys(values).some((key) => !schema.some((field) => field.varName === key))) return null;
    const restored: CustomParameters = {};
    for (const field of schema) {
        const value = Object.hasOwn(values, field.varName) ? values[field.varName] : field.defaultValue;
        const valid = Array.isArray(field.type)
            ? field.type.some((option) => option.value === value)
            : typeof value === (field.type.startsWith('host') ? 'string' : field.type);
        if (!valid) return null;
        restored[field.varName] = value as string | number | boolean;
    }
    return restored;
}

export function restoreServiceIndex(saved: unknown, count: number): number {
    return typeof saved === 'number' && Number.isInteger(saved) && saved >= 0 && saved < count ? saved : 0;
}
