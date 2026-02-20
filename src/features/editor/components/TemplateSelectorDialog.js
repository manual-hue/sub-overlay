import React from 'react';
import { TEMPLATES } from '../data/overlayTemplates';

const TemplateSelectorDialog = ({ open, onClose, onSelect }) => {
    if (!open) return null;

    const handleSelect = (template) => {
        onSelect(template.resources);
        onClose();
    };

    const handleEmpty = () => {
        onSelect([]);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[1300]" onClick={onClose} />
            <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
                <div className="bg-dark-paper rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-lg font-medium">템플릿 선택</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            템플릿을 선택하면 현재 캔버스가 교체됩니다. 로드 후 자유롭게 편집할 수 있습니다.
                        </p>
                    </div>

                    <div className="p-6 grid grid-cols-2 gap-4">
                        {/* Empty canvas */}
                        <button
                            onClick={handleEmpty}
                            className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-dark-hover transition-colors group"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-10 h-10 text-gray-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span className="text-sm font-medium text-gray-300">빈 캔버스</span>
                                <span className="text-xs text-gray-500">모든 요소를 제거하고 처음부터 시작</span>
                            </div>
                        </button>

                        {/* Template cards */}
                        {TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleSelect(template)}
                                className="border border-gray-700 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-dark-hover transition-colors group"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-200">{template.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{template.description}</span>
                                    <span className="text-xs text-gray-600">{template.resources.length}개 요소</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="px-6 py-4 flex justify-end border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:bg-dark-hover rounded transition-colors"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TemplateSelectorDialog;
