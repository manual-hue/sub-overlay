import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import EditorLayerItem from "./EditorLayerItem";
import TextEditorDialog from "./TextEditorDialog";
import ShapeEditorDialog from "./ShapeEditorDialog";
import TemplateSelectorDialog from "./TemplateSelectorDialog";
import PropertyPanel from "./PropertyPanel";
import useResourceManager, { LAYER_TYPES } from "../hooks/useResourceManager";
import Spinner from '../../../shared/components/Spinner';
import { toEmbedUrl } from '../../../shared/utils/embedUrl';

const SportsOverlayEditor = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [textDialogOpen, setTextDialogOpen] = useState(false);
    const [shapeDialogOpen, setShapeDialogOpen] = useState(false);
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [currentTextResource, setCurrentTextResource] = useState(null);
    const [currentShapeResource, setCurrentShapeResource] = useState(null);
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loadedPreviewUrl, setLoadedPreviewUrl] = useState('');
    const [editMode, setEditMode] = useState(true);
    const fileInputRef = useRef(null);
    const [fileTypeError, setFileTypeError] = useState(null);
    const menuRef = useRef(null);

    const {
        resources, selectedIds, setSelectedIds,
        isModified, isLoading, isSaving, isUploading, error,
        handleResizeOrDrag, moveResourcesByDelta, saveCurrentState,
        resetToPreviousPositions, resetToInitialPositions, uploadImage,
        addTextResource, updateTextResource, addShapeResource, updateResource,
        loadTemplate, removeResource, removeResources, addResource, checkResourceLimit
    } = useResourceManager();

    // 단일 선택된 리소스 (PropertyPanel용)
    const selectedResource = selectedIds.size === 1
        ? resources.find(r => r.id === [...selectedIds][0]) || null
        : null;

    // 드래그 시작 위치 기록용
    const dragStartRef = useRef(null);

    // 선택 헬퍼
    const selectResource = useCallback((id, shiftKey) => {
        setSelectedIds(prev => {
            if (shiftKey) {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            }
            // 이미 다중 선택에 포함된 요소를 클릭하면 선택 유지 (그룹 드래그용)
            if (prev.has(id) && prev.size > 1) return prev;
            return new Set([id]);
        });
    }, [setSelectedIds]);

    // Delete 키 삭제 + 화살표 키 이동
    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

            if (e.key === 'Delete' && selectedIds.size > 0) {
                if (selectedIds.size === 1) {
                    removeResource([...selectedIds][0]);
                } else {
                    removeResources([...selectedIds]);
                }
                return;
            }

            // 화살표 키 이동 (Shift: 10px, 기본: 1px)
            if (selectedIds.size > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                const delta = {
                    ArrowUp: [0, -step],
                    ArrowDown: [0, step],
                    ArrowLeft: [-step, 0],
                    ArrowRight: [step, 0],
                };
                const [dx, dy] = delta[e.key];
                moveResourcesByDelta([...selectedIds], dx, dy);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, removeResource, removeResources, moveResourcesByDelta]);

    const handleFileUpload = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.match(/image\/(png|gif)/)) {
            setFileTypeError('PNG 또는 GIF 파일만 업로드 가능합니다.');
            event.target.value = '';
            return;
        }

        try {
            setFileTypeError(null);
            const result = await uploadImage(file);
            const newResource = {
                id: `resource-${Date.now()}`,
                type: LAYER_TYPES.IMAGE,
                name: result.filename,
                src: result.path,
                x: 100, y: 100, width: 200, height: 200,
                opacity: 1,
            };
            addResource(newResource);
        } catch (error) {
            console.error('Upload failed:', error);
            setFileTypeError(error.message);
        } finally {
            event.target.value = '';
        }
    }, [uploadImage, addResource]);

    const handleAddImageClick = () => {
        if (checkResourceLimit()) {
            alert('이미지 리소스는 최대 15개까지만 추가할 수 있습니다.');
            setMenuOpen(false);
            return;
        }
        fileInputRef.current?.click();
        setMenuOpen(false);
    };

    const handleAddTextClick = () => {
        setCurrentTextResource(null);
        setTextDialogOpen(true);
        setMenuOpen(false);
    };

    const handleAddShapeClick = () => {
        setCurrentShapeResource(null);
        setShapeDialogOpen(true);
        setMenuOpen(false);
    };

    const handleTextSave = (textData) => {
        if (currentTextResource) {
            updateTextResource(currentTextResource.id, textData);
        } else {
            addTextResource(textData.text, textData.fontFamily, textData.fontSize, textData.color, textData.textStyles);
        }
    };

    const handleShapeSave = (shapeData) => {
        if (currentShapeResource) {
            updateResource(currentShapeResource.id, shapeData);
        } else {
            addShapeResource(shapeData);
        }
    };

    const handleEditText = (resource) => {
        setCurrentTextResource(resource);
        setTextDialogOpen(true);
    };

    const handleEditShape = (resource) => {
        setCurrentShapeResource(resource);
        setShapeDialogOpen(true);
    };

    const handlePreviewLoad = useCallback(() => {
        const trimmed = previewUrl.trim();
        if (!trimmed) {
            setLoadedPreviewUrl('');
            return;
        }
        const raw = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        setLoadedPreviewUrl(toEmbedUrl(raw));
    }, [previewUrl]);

    const disabled = isLoading || isSaving || isUploading;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-dark">
            {/* Toolbar */}
            <div className="bg-dark-paper border-b border-gray-700 px-4 py-2 flex items-center justify-between">
                <h1 className="text-lg font-medium">방송용 오버레이 에디터</h1>

                <div className="flex items-center gap-2">
                    {/* Template button */}
                    <button
                        onClick={() => setTemplateDialogOpen(true)}
                        disabled={disabled}
                        className="flex items-center gap-1.5 px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        템플릿
                    </button>

                    {/* Add button with dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            disabled={disabled}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            추가하기
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 mt-1 w-40 bg-dark-paper rounded shadow-xl z-50 py-1 border border-gray-700">
                                    <button
                                        onClick={handleAddImageClick}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-dark-hover"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        이미지 추가
                                    </button>
                                    <button
                                        onClick={handleAddTextClick}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-dark-hover"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                                        </svg>
                                        텍스트 추가
                                    </button>
                                    <button
                                        onClick={handleAddShapeClick}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-dark-hover"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                                        </svg>
                                        도형 추가
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Save button */}
                    <button
                        onClick={async () => {
                            try {
                                const success = await saveCurrentState();
                                if (success) alert('현위치가 저장되었습니다.');
                            } catch (err) {
                                console.error('Save error:', err);
                                alert(`저장 실패: ${err.message}`);
                            }
                        }}
                        disabled={!isModified || disabled}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Spinner className="h-6 w-6 text-white" /> : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                        )}
                        현위치 저장하기
                    </button>

                    {/* Undo button */}
                    <button
                        onClick={resetToPreviousPositions}
                        disabled={disabled}
                        className="flex items-center gap-1.5 px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        이전 위치로
                    </button>

                    {/* Reset button */}
                    <button
                        onClick={resetToInitialPositions}
                        disabled={disabled}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-500 text-gray-300 hover:bg-gray-500/10 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        처음 위치로
                    </button>
                </div>
            </div>

            {/* Preview URL bar */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-dark-paper border-b border-gray-700 shrink-0">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <input
                    type="text"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePreviewLoad()}
                    placeholder="미리보기 URL (YouTube, Twitch 등)"
                    className="flex-1 bg-dark border border-gray-600 rounded px-3 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handlePreviewLoad}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors whitespace-nowrap"
                >
                    로드
                </button>
                {loadedPreviewUrl && (
                    <>
                        <button
                            onClick={() => setEditMode(prev => !prev)}
                            className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${
                                editMode
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {editMode ? '영상 조작' : '편집 모드'}
                        </button>
                        <button
                            onClick={() => { setLoadedPreviewUrl(''); setPreviewUrl(''); setEditMode(true); }}
                            className="px-3 py-1 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-sm rounded transition-colors whitespace-nowrap"
                        >
                            끄기
                        </button>
                    </>
                )}
            </div>

            {/* Main content */}
            <div className="relative flex-1 overflow-hidden">
                {/* Editor canvas - always full size */}
                <div className="absolute inset-0">
                    {/* Background: iframe preview or default */}
                    {loadedPreviewUrl ? (
                        <iframe
                            src={loadedPreviewUrl}
                            title="Editor Preview"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            allow="autoplay; encrypted-media"
                            className="absolute inset-0 w-full h-full border-0"
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                backgroundImage: `url('/images/sample-broadcast.jpg')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    )}
                </div>

                {/* Overlay interaction layer - sits on top of iframe */}
                <div
                    className="absolute inset-0"
                    style={{ zIndex: 1, pointerEvents: editMode ? 'auto' : 'none' }}
                    onClick={(e) => {
                        // 캔버스 빈 공간 클릭 시 선택 해제
                        if (e.target === e.currentTarget) setSelectedIds(new Set());
                    }}
                >
                    {(isLoading || isUploading) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <Spinner className="h-6 w-6 text-white" />
                        </div>
                    )}

                    {resources.map((resource) => {
                        const isSelected = selectedIds.has(resource.id);
                        return (
                            <Rnd
                                key={resource.id}
                                size={{ width: resource.width, height: resource.height }}
                                position={{ x: resource.x, y: resource.y }}
                                onDragStart={() => {
                                    dragStartRef.current = { x: resource.x, y: resource.y };
                                }}
                                onDragStop={(e, d) => {
                                    const startPos = dragStartRef.current ?? { x: resource.x, y: resource.y };
                                    const dx = d.x - startPos.x;
                                    const dy = d.y - startPos.y;
                                    dragStartRef.current = null;

                                    if (isSelected && selectedIds.size > 1) {
                                        // 드래그한 요소 포함 전체를 한 번에 이동
                                        moveResourcesByDelta([...selectedIds], dx, dy);
                                    } else {
                                        handleResizeOrDrag(resource.id, { ...resource, x: d.x, y: d.y });
                                    }
                                }}
                                onResizeStop={(e, direction, ref, delta, position) => {
                                    handleResizeOrDrag(resource.id, {
                                        ...resource,
                                        width: parseInt(ref.style.width),
                                        height: parseInt(ref.style.height),
                                        x: position.x,
                                        y: position.y
                                    });
                                }}
                                bounds="parent"
                                onMouseDown={(e) => selectResource(resource.id, e.shiftKey)}
                                style={{ zIndex: isSelected ? 100 : 1 }}
                            >
                                <div
                                    className={`w-full h-full flex items-center justify-center relative overflow-hidden cursor-move rounded-sm transition-colors ${
                                        isSelected
                                            ? 'border-2 border-blue-500'
                                            : 'border border-dashed border-white/30 hover:border-2 hover:border-blue-500'
                                    }`}
                                    style={{ opacity: resource.opacity ?? 1 }}
                                >
                                    {resource.type === LAYER_TYPES.IMAGE && (
                                        <img
                                            src={resource.src}
                                            alt={resource.name}
                                            className="w-full h-full object-contain"
                                        />
                                    )}

                                    {resource.type === LAYER_TYPES.TEXT && (
                                        <div
                                            className="w-full h-full flex items-center justify-center p-1 break-words overflow-hidden select-none"
                                            style={{
                                                fontFamily: resource.fontFamily,
                                                fontSize: `${resource.fontSize}px`,
                                                fontWeight: resource.textStyles?.includes('bold') ? 'bold' : 'normal',
                                                fontStyle: resource.textStyles?.includes('italic') ? 'italic' : 'normal',
                                                color: resource.color,
                                            }}
                                            onDoubleClick={() => handleEditText(resource)}
                                        >
                                            {resource.text}
                                        </div>
                                    )}

                                    {resource.type === LAYER_TYPES.SHAPE && (
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundColor: resource.fill,
                                                border: resource.strokeWidth > 0 ? `${resource.strokeWidth}px solid ${resource.stroke}` : 'none',
                                                borderRadius: resource.shapeType === 'circle' ? '50%' : `${resource.borderRadius || 0}px`,
                                            }}
                                            onDoubleClick={() => handleEditShape(resource)}
                                        />
                                    )}

                                    {isSelected && resource.type === LAYER_TYPES.TEXT && (
                                        <button
                                            className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl p-1 z-10 hover:bg-blue-700"
                                            onClick={() => handleEditText(resource)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    )}

                                    {isSelected && resource.type === LAYER_TYPES.SHAPE && (
                                        <button
                                            className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl p-1 z-10 hover:bg-blue-700"
                                            onClick={() => handleEditShape(resource)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </Rnd>
                        );
                    })}
                </div>

                {/* Left panel (Layer) - overlays canvas */}
                <div
                    className={`absolute top-0 left-0 h-full z-20 flex transition-transform duration-300 ${
                        leftPanelOpen ? 'translate-x-0' : '-translate-x-[250px]'
                    }`}
                >
                    <div className="w-[250px] p-4 border-r border-gray-700 bg-dark-paper/95 backdrop-blur-sm flex flex-col h-full overflow-auto">
                        <h2 className="text-sm font-bold mb-2">레이어 ({resources.length})</h2>

                        {resources.length === 0 ? (
                            <p className="text-sm text-gray-500 my-4">
                                레이어가 없습니다. '추가하기' 버튼을 눌러 새 레이어를 추가해보세요.
                            </p>
                        ) : (
                            <div className="overflow-auto flex-1">
                                {resources.map((resource) => (
                                    <EditorLayerItem
                                        key={resource.id}
                                        resource={resource}
                                        isSelected={selectedIds.has(resource.id)}
                                        onSelect={(e) => selectResource(resource.id, e?.shiftKey)}
                                        onRemove={removeResource}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Left toggle button */}
                    <button
                        onClick={() => setLeftPanelOpen(prev => !prev)}
                        className="self-center -mr-px h-16 w-5 flex items-center justify-center bg-dark-paper/90 border border-l-0 border-gray-700 rounded-r text-gray-400 hover:text-white hover:bg-dark-hover transition-colors"
                    >
                        <svg className={`w-3.5 h-3.5 transition-transform ${leftPanelOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Right panel (Property) - overlays canvas */}
                <div
                    className={`absolute top-0 right-0 h-full z-20 flex transition-transform duration-300 ${
                        rightPanelOpen ? 'translate-x-0' : 'translate-x-[280px]'
                    }`}
                >
                    {/* Right toggle button */}
                    <button
                        onClick={() => setRightPanelOpen(prev => !prev)}
                        className="self-center -ml-px h-16 w-5 flex items-center justify-center bg-dark-paper/90 border border-r-0 border-gray-700 rounded-l text-gray-400 hover:text-white hover:bg-dark-hover transition-colors"
                    >
                        <svg className={`w-3.5 h-3.5 transition-transform ${rightPanelOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <PropertyPanel
                        resource={selectedResource}
                        selectedCount={selectedIds.size}
                        onUpdate={updateResource}
                    />
                </div>
            </div>

            {/* Status bar */}
            <div className="py-2 px-4 bg-dark-paper border-t border-gray-700">
                <p className="text-sm text-gray-500">
                    {isLoading ? '리소스를 불러오는 중...'
                        : isSaving ? '저장 중...'
                        : isUploading ? '업로드 중...'
                        : isModified ? '저장되지 않은 변경사항이 있습니다.'
                        : '모든 변경사항이 저장되었습니다.'}
                </p>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            {/* Text editor dialog */}
            <TextEditorDialog
                open={textDialogOpen}
                onClose={() => setTextDialogOpen(false)}
                initialText={currentTextResource || {}}
                onSave={handleTextSave}
            />

            {/* Shape editor dialog */}
            <ShapeEditorDialog
                open={shapeDialogOpen}
                onClose={() => setShapeDialogOpen(false)}
                initialShape={currentShapeResource || {}}
                onSave={handleShapeSave}
            />

            {/* Template selector dialog */}
            <TemplateSelectorDialog
                open={templateDialogOpen}
                onClose={() => setTemplateDialogOpen(false)}
                onSelect={loadTemplate}
            />

            {/* Error alert */}
            {(error || fileTypeError) && (
                <div className="fixed bottom-4 right-4 z-[9999] max-w-[400px] bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">
                    {fileTypeError || error?.message || String(error)}
                </div>
            )}
        </div>
    );
};

export default SportsOverlayEditor;
