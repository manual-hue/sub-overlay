import React from 'react';
import { LAYER_TYPES } from '../hooks/useResourceManager';

const EditorLayerItem = ({ resource, isSelected, onSelect, onRemove }) => {
    return (
        <div
            className={`p-2 mb-1 flex items-center justify-between rounded cursor-pointer transition-colors ${
                isSelected
                    ? 'bg-dark-selected shadow-md'
                    : 'bg-dark-paper shadow-sm hover:bg-dark-hover'
            }`}
            onClick={(e) => onSelect(e)}
        >
            <div className="flex items-center gap-2 min-w-0">
                {resource.type === LAYER_TYPES.IMAGE && (
                    <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )}
                {resource.type === LAYER_TYPES.TEXT && (
                    <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                )}
                {resource.type === LAYER_TYPES.SHAPE && (
                    <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {resource.shapeType === 'circle' ? (
                            <circle cx="12" cy="12" r="9" strokeWidth={2} />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                        )}
                    </svg>
                )}
                <span className="text-sm truncate">{resource.name}</span>
            </div>
            <button
                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(resource.id);
                }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default EditorLayerItem;
