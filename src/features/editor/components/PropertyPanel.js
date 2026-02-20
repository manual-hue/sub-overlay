import React from 'react';
import { LAYER_TYPES } from '../hooks/useResourceManager';

const FONT_FAMILIES = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Verdana', 'Impact', 'Noto Sans KR', 'Nanum Gothic',
    'Pretendard JP', 'Pretendard'
];

const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
        />
    </div>
);

const PropertyPanel = ({ resource, onUpdate }) => {
    if (!resource) {
        return (
            <div className="w-[280px] border-l border-gray-700 bg-dark-paper p-4 overflow-y-auto">
                <p className="text-sm text-gray-500 text-center mt-8">
                    요소를 선택하면 속성을 편집할 수 있습니다.
                </p>
            </div>
        );
    }

    const update = (key, value) => {
        onUpdate(resource.id, { [key]: value });
    };

    return (
        <div className="w-[280px] border-l border-gray-700 bg-dark-paper p-4 overflow-y-auto flex flex-col gap-4">
            <h3 className="text-sm font-bold border-b border-gray-700 pb-2">속성</h3>

            {/* Name */}
            <div>
                <label className="block text-xs text-gray-500 mb-0.5">이름</label>
                <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                />
            </div>

            {/* Position & Size */}
            <div>
                <label className="block text-xs text-gray-400 font-medium mb-1">위치 / 크기</label>
                <div className="grid grid-cols-2 gap-2">
                    <NumberInput label="X" value={Math.round(resource.x)} onChange={(v) => update('x', v)} />
                    <NumberInput label="Y" value={Math.round(resource.y)} onChange={(v) => update('y', v)} />
                    <NumberInput label="너비" value={Math.round(resource.width)} onChange={(v) => update('width', v)} min={1} />
                    <NumberInput label="높이" value={Math.round(resource.height)} onChange={(v) => update('height', v)} min={1} />
                </div>
            </div>

            {/* Opacity */}
            <div>
                <label className="block text-xs text-gray-400 mb-0.5">
                    불투명도: {Math.round((resource.opacity ?? 1) * 100)}%
                </label>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={resource.opacity ?? 1}
                    onChange={(e) => update('opacity', Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>

            {/* TEXT properties */}
            {resource.type === LAYER_TYPES.TEXT && (
                <>
                    <div>
                        <label className="block text-xs text-gray-400 font-medium mb-1">텍스트</label>
                        <textarea
                            rows={2}
                            value={resource.text}
                            onChange={(e) => update('text', e.target.value)}
                            className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">폰트</label>
                        <select
                            value={resource.fontFamily}
                            onChange={(e) => update('fontFamily', e.target.value)}
                            className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                        >
                            {FONT_FAMILIES.map((font) => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">
                            폰트 크기: {resource.fontSize}px
                        </label>
                        <input
                            type="range"
                            min={10}
                            max={400}
                            step={1}
                            value={resource.fontSize}
                            onChange={(e) => update('fontSize', Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">색상</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={resource.color}
                                onChange={(e) => update('color', e.target.value)}
                                className="w-7 h-7 rounded border border-gray-500 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={resource.color}
                                onChange={(e) => update('color', e.target.value)}
                                className="flex-1 bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">스타일</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => {
                                    const styles = resource.textStyles || [];
                                    update('textStyles', styles.includes('bold') ? styles.filter(s => s !== 'bold') : [...styles, 'bold']);
                                }}
                                className={`px-2.5 py-1 rounded border text-xs font-bold transition-colors ${
                                    resource.textStyles?.includes('bold')
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-gray-600 text-gray-300 hover:bg-dark-hover'
                                }`}
                            >
                                B
                            </button>
                            <button
                                onClick={() => {
                                    const styles = resource.textStyles || [];
                                    update('textStyles', styles.includes('italic') ? styles.filter(s => s !== 'italic') : [...styles, 'italic']);
                                }}
                                className={`px-2.5 py-1 rounded border text-xs italic transition-colors ${
                                    resource.textStyles?.includes('italic')
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-gray-600 text-gray-300 hover:bg-dark-hover'
                                }`}
                            >
                                I
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* SHAPE properties */}
            {resource.type === LAYER_TYPES.SHAPE && (
                <>
                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">도형 타입</label>
                        <select
                            value={resource.shapeType}
                            onChange={(e) => update('shapeType', e.target.value)}
                            className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                        >
                            <option value="rect">사각형</option>
                            <option value="circle">원</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">채우기</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={resource.fill?.startsWith('rgba') ? '#3b82f6' : (resource.fill || '#3b82f6')}
                                onChange={(e) => update('fill', e.target.value)}
                                className="w-7 h-7 rounded border border-gray-500 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={resource.fill}
                                onChange={(e) => update('fill', e.target.value)}
                                className="flex-1 bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-0.5">테두리</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={resource.stroke === 'transparent' ? '#000000' : (resource.stroke || '#000000')}
                                onChange={(e) => update('stroke', e.target.value)}
                                className="w-7 h-7 rounded border border-gray-500 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={resource.stroke}
                                onChange={(e) => update('stroke', e.target.value)}
                                className="flex-1 bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <NumberInput
                        label="테두리 두께"
                        value={resource.strokeWidth}
                        onChange={(v) => update('strokeWidth', v)}
                        min={0}
                        max={20}
                    />

                    {resource.shapeType === 'rect' && (
                        <div>
                            <label className="block text-xs text-gray-400 mb-0.5">
                                모서리 둥글기: {resource.borderRadius}px
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={resource.borderRadius}
                                onChange={(e) => update('borderRadius', Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    )}
                </>
            )}

            {/* IMAGE properties */}
            {resource.type === LAYER_TYPES.IMAGE && (
                <div>
                    <label className="block text-xs text-gray-400 mb-0.5">이미지 소스</label>
                    <input
                        type="text"
                        value={resource.src}
                        readOnly
                        className="w-full bg-dark border border-gray-600 rounded px-2 py-1 text-sm text-gray-400 outline-none truncate"
                    />
                </div>
            )}
        </div>
    );
};

export default PropertyPanel;
