import React, { useState, useEffect } from 'react';

const FONT_FAMILIES = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Verdana', 'Impact', 'Noto Sans KR', 'Nanum Gothic',
    'Pretendard JP', 'Pretendard'
];

const TextEditorDialog = ({ open, onClose, initialText = {}, onSave }) => {
    const [text, setText] = useState(initialText.text || '');
    const [fontFamily, setFontFamily] = useState(initialText.fontFamily || 'Pretendard');
    const [fontSize, setFontSize] = useState(initialText.fontSize || 24);
    const [color, setColor] = useState(initialText.color || '#000000');
    const [textStyles, setTextStyles] = useState(initialText.textStyles || []);

    useEffect(() => {
        if (open) {
            setText(initialText.text || '');
            setFontFamily(initialText.fontFamily || 'Pretendard');
            setFontSize(initialText.fontSize || 24);
            setColor(initialText.color || '#000000');
            setTextStyles(initialText.textStyles || []);
        }
    }, [open, initialText]);

    const handleSave = () => {
        onSave({ text, fontFamily, fontSize, color, textStyles });
        onClose();
    };

    const toggleBold = () => {
        setTextStyles(prev =>
            prev.includes('bold') ? prev.filter(s => s !== 'bold') : [...prev, 'bold']
        );
    };

    const toggleItalic = () => {
        setTextStyles(prev =>
            prev.includes('italic') ? prev.filter(s => s !== 'italic') : [...prev, 'italic']
        );
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-[1300]" onClick={onClose} />

            {/* Dialog */}
            <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
                <div className="bg-dark-paper rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    {/* Title */}
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-lg font-medium">
                            {initialText.text ? '텍스트 수정' : '텍스트 추가'}
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 space-y-5">
                        {/* Text input */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">텍스트</label>
                            <textarea
                                rows={3}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full bg-dark border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Font family */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">폰트</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full bg-dark border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                            >
                                {FONT_FAMILIES.map((font) => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Font size */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                폰트 크기: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min={10}
                                max={400}
                                step={1}
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        {/* Text styles */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">텍스트 스타일</label>
                            <div className="flex gap-1">
                                <button
                                    onClick={toggleBold}
                                    className={`px-3 py-2 rounded border text-sm font-bold transition-colors ${
                                        textStyles.includes('bold')
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-600 text-gray-300 hover:bg-dark-hover'
                                    }`}
                                >
                                    B
                                </button>
                                <button
                                    onClick={toggleItalic}
                                    className={`px-3 py-2 rounded border text-sm italic transition-colors ${
                                        textStyles.includes('italic')
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-600 text-gray-300 hover:bg-dark-hover'
                                    }`}
                                >
                                    I
                                </button>
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">색상</label>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-6 h-6 rounded border border-gray-500 flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1 bg-dark border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 border border-gray-600 rounded flex items-center justify-center min-h-[100px]">
                            <span
                                style={{
                                    fontFamily: fontFamily,
                                    fontSize: `${fontSize}px`,
                                    fontWeight: textStyles.includes('bold') ? 'bold' : 'normal',
                                    fontStyle: textStyles.includes('italic') ? 'italic' : 'normal',
                                    color: color
                                }}
                            >
                                {text || '텍스트 미리보기'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 flex justify-end gap-2 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:bg-dark-hover rounded transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!text.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextEditorDialog;
