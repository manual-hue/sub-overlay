import React, { useState, useEffect } from 'react';

const ShapeEditorDialog = ({ open, onClose, initialShape = {}, onSave }) => {
    const [shapeType, setShapeType] = useState(initialShape.shapeType || 'rect');
    const [fill, setFill] = useState(initialShape.fill || '#3b82f6');
    const [stroke, setStroke] = useState(initialShape.stroke || 'transparent');
    const [strokeWidth, setStrokeWidth] = useState(initialShape.strokeWidth || 0);
    const [borderRadius, setBorderRadius] = useState(initialShape.borderRadius || 0);
    const [opacity, setOpacity] = useState(initialShape.opacity ?? 1);

    useEffect(() => {
        if (open) {
            setShapeType(initialShape.shapeType || 'rect');
            setFill(initialShape.fill || '#3b82f6');
            setStroke(initialShape.stroke || 'transparent');
            setStrokeWidth(initialShape.strokeWidth || 0);
            setBorderRadius(initialShape.borderRadius || 0);
            setOpacity(initialShape.opacity ?? 1);
        }
    }, [open, initialShape]);

    const handleSave = () => {
        onSave({ shapeType, fill, stroke, strokeWidth, borderRadius, opacity });
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[1300]" onClick={onClose} />
            <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
                <div className="bg-dark-paper rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-lg font-medium">
                            {initialShape.shapeType ? '도형 수정' : '도형 추가'}
                        </h2>
                    </div>

                    <div className="px-6 py-4 space-y-5">
                        {/* Shape type */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">도형 타입</label>
                            <select
                                value={shapeType}
                                onChange={(e) => setShapeType(e.target.value)}
                                className="w-full bg-dark border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                            >
                                <option value="rect">사각형</option>
                                <option value="circle">원</option>
                            </select>
                        </div>

                        {/* Fill color */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">채우기 색상</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={fill.startsWith('rgba') ? '#3b82f6' : fill}
                                    onChange={(e) => setFill(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-500 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={fill}
                                    onChange={(e) => setFill(e.target.value)}
                                    className="flex-1 bg-dark border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Stroke color */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">테두리 색상</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={stroke === 'transparent' ? '#000000' : stroke}
                                    onChange={(e) => setStroke(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-500 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={stroke}
                                    onChange={(e) => setStroke(e.target.value)}
                                    className="flex-1 bg-dark border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Stroke width */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                테두리 두께: {strokeWidth}px
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={20}
                                step={1}
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        {/* Border radius (rect only) */}
                        {shapeType === 'rect' && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    모서리 둥글기: {borderRadius}px
                                </label>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={borderRadius}
                                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                        )}

                        {/* Opacity */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                불투명도: {Math.round(opacity * 100)}%
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={opacity}
                                onChange={(e) => setOpacity(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 border border-gray-600 rounded flex items-center justify-center min-h-[120px]">
                            <div
                                style={{
                                    width: 100,
                                    height: shapeType === 'circle' ? 100 : 60,
                                    backgroundColor: fill,
                                    border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
                                    borderRadius: shapeType === 'circle' ? '50%' : `${borderRadius}px`,
                                    opacity,
                                }}
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 flex justify-end gap-2 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:bg-dark-hover rounded transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShapeEditorDialog;
