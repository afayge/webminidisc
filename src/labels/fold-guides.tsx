import React from 'react';
import { TemplateDefinition } from './model';

export function FoldGuides({ definition: def }: { definition: TemplateDefinition }) {
    if (!def.folds.length) return null;
    return (
        <g className="md-fold-guides" pointerEvents="none" fill="none" stroke="#b45e23" strokeWidth=".25" strokeDasharray="1.5 1">
            {def.folds.map((position) => (
                <line
                    key={position}
                    x1={def.foldAxis === 'x' ? position : 0}
                    y1={def.foldAxis === 'y' ? position : 0}
                    x2={def.foldAxis === 'x' ? position : def.width}
                    y2={def.foldAxis === 'y' ? position : def.height}
                />
            ))}
        </g>
    );
}
