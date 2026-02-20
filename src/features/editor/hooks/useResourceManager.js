import { useState, useEffect, useCallback, useRef } from 'react';
import { createOverlayChannel } from '../../../shared/utils/broadcastSync';

export const LAYER_TYPES = {
    IMAGE: 'image',
    TEXT: 'text',
    SHAPE: 'shape',
};

// 로컬 스토리지 키
const STORAGE_KEY = 'sports-overlay-resources';

// 초기 샘플 데이터 (실제 서버 없이 테스트용)
const SAMPLE_RESOURCES = [
    {
        id: 'resource-1',
        type: LAYER_TYPES.IMAGE,
        name: '샘플 이미지 1',
        src: 'https://www.transparentpng.com/thumb/dog/transparent-picture-dog-4.png',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        opacity: 1,
    }
];

const useResourceManager = () => {
    const [resources, setResources] = useState([]);
    const [initialPositions, setInitialPositions] = useState({});
    const [previousPositions, setPreviousPositions] = useState({});
    const [isModified, setIsModified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const channelRef = useRef(null);

    // BroadcastChannel 초기화
    useEffect(() => {
        channelRef.current = createOverlayChannel();
        return () => {
            channelRef.current?.close();
        };
    }, []);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const storedResources = localStorage.getItem(STORAGE_KEY);
                let fetchedResources = storedResources ? JSON.parse(storedResources) : SAMPLE_RESOURCES;

                // 기존 리소스에 opacity가 없으면 기본값 추가
                fetchedResources = fetchedResources.map(r => ({
                    ...r,
                    opacity: r.opacity ?? 1,
                }));

                setResources(fetchedResources);

                const initPositions = {};
                fetchedResources.forEach(resource => {
                    initPositions[resource.id] = {
                        x: resource.x,
                        y: resource.y,
                        width: resource.width,
                        height: resource.height
                    };
                });

                setInitialPositions(initPositions);
                setPreviousPositions(initPositions);
                setError(null);
            } catch (err) {
                console.error('Error in useResourceManager:', err);
                setError('리소스를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    // 리소스 리사이징 및 드랍 핸들러
    const handleResizeOrDrag = useCallback((id, data) => {
        setIsModified(true);
        setResources(prevResources =>
            prevResources.map(resource =>
                resource.id === id
                    ? { ...resource, x: data.x, y: data.y, width: data.width, height: data.height }
                    : resource
            )
        );
    }, []);

    // 리소스 정보 DB 저장
    const saveCurrentState = useCallback(async () => {
        try {
            const newPreviousPositions = {};
            resources.forEach(resource => {
                newPreviousPositions[resource.id] = {
                    x: resource.x,
                    y: resource.y,
                    width: resource.width,
                    height: resource.height
                };
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));

            // BroadcastChannel로 즉시 동기화
            channelRef.current?.postUpdate(resources);

            setPreviousPositions(newPreviousPositions);
            setIsModified(false);
            setError(null);

            return true;
        } catch (err) {
            console.error('Error saving positions:', err);
            setError('위치 저장 중 오류가 발생했습니다.');
            return false;
        }
    }, [resources]);

    // 이전 포지션으로 리셋
    const resetToPreviousPositions = useCallback(() => {
        setResources(prevResources =>
            prevResources.map(resource => ({
                ...resource,
                x: previousPositions[resource.id]?.x || resource.x,
                y: previousPositions[resource.id]?.y || resource.y,
                width: previousPositions[resource.id]?.width || resource.width,
                height: previousPositions[resource.id]?.height || resource.height
            }))
        );
        setIsModified(true);
    }, [previousPositions]);

    // 작업 초기화
    const resetToInitialPositions = useCallback(() => {
        setResources(prevResources =>
            prevResources.map(resource => ({
                ...resource,
                x: initialPositions[resource.id]?.x || resource.x,
                y: initialPositions[resource.id]?.y || resource.y,
                width: initialPositions[resource.id]?.width || resource.width,
                height: initialPositions[resource.id]?.height || resource.height
            }))
        );
        setIsModified(true);
    }, [initialPositions]);

    // 이미지 파일을 처리하는 함수
    const uploadImage = useCallback(async (file) => {
        if (!file.type.match(/image\/(png|gif)/)) {
            throw new Error('PNG 또는 GIF 파일만 업로드 가능합니다.');
        }

        const imageCount = resources.filter(r => r.type === LAYER_TYPES.IMAGE).length;
        if (imageCount >= 15) {
            throw new Error('이미지는 최대 15개까지만 추가할 수 있습니다.');
        }

        const fileUrl = URL.createObjectURL(file);

        return {
            filename: file.name,
            path: fileUrl
        };
    }, [resources]);

    // 새 리소스 추가
    const addResource = useCallback((newResource) => {
        if (newResource.type === LAYER_TYPES.IMAGE) {
            const imageCount = resources.filter(r => r.type === LAYER_TYPES.IMAGE).length;
            if (imageCount >= 15) {
                throw new Error('이미지는 최대 15개까지만 추가할 수 있습니다.');
            }
        }

        setResources(prevResources => {
            const resourceWithDefaults = {
                opacity: 1,
                ...newResource,
            };
            const newResources = [...prevResources, resourceWithDefaults];
            setIsModified(true);
            return newResources;
        });
    }, [resources]);

    // 리소스 삭제
    const removeResource = useCallback((id) => {
        setResources(prevResources => {
            const newResources = prevResources.filter(resource => resource.id !== id);
            setIsModified(true);
            return newResources;
        });

        if (selectedResourceId === id) {
            setSelectedResourceId(null);
        }
    }, [selectedResourceId]);

    // 텍스트 리소스 추가
    const addTextResource = useCallback((text, fontFamily = 'Pretendard', fontSize = 24, color = '#000000', textStyles = []) => {
        const newResource = {
            id: `resource-${Date.now()}`,
            type: LAYER_TYPES.TEXT,
            name: `텍스트: ${text.substring(0, 10)}${text.length > 10 ? '...' : ''}`,
            text,
            fontFamily,
            fontSize,
            color,
            textStyles,
            x: 100,
            y: 100,
            width: text.length * fontSize * 0.6,
            height: fontSize * 1.5,
            opacity: 1,
        };

        addResource(newResource);
    }, [addResource]);

    // 텍스트 리소스 업데이트
    const updateTextResource = useCallback((id, updates) => {
        setResources(prevResources => {
            const newResources = prevResources.map(resource =>
                resource.id === id
                    ? {
                        ...resource,
                        ...updates,
                        name: updates.text
                            ? `텍스트: ${updates.text.substring(0, 10)}${updates.text.length > 10 ? '...' : ''}`
                            : resource.name,
                        textStyles: updates.textStyles !== undefined ? updates.textStyles : resource.textStyles
                    }
                    : resource
            );

            setIsModified(true);
            return newResources;
        });
    }, []);

    // 도형 리소스 추가
    const addShapeResource = useCallback(({ shapeType = 'rect', fill = '#3b82f6', stroke = 'transparent', strokeWidth = 0, borderRadius = 0, opacity = 1 } = {}) => {
        const newResource = {
            id: `resource-${Date.now()}`,
            type: LAYER_TYPES.SHAPE,
            name: `도형: ${shapeType === 'rect' ? '사각형' : '원'}`,
            shapeType,
            fill,
            stroke,
            strokeWidth,
            borderRadius,
            x: 100,
            y: 100,
            width: 200,
            height: shapeType === 'circle' ? 200 : 120,
            opacity,
        };

        addResource(newResource);
        return newResource.id;
    }, [addResource]);

    // 범용 리소스 업데이트 (PropertyPanel에서 사용)
    const updateResource = useCallback((id, updates) => {
        setResources(prevResources => {
            const newResources = prevResources.map(resource => {
                if (resource.id !== id) return resource;

                const updated = { ...resource, ...updates };

                // 텍스트 이름 자동 업데이트
                if (resource.type === LAYER_TYPES.TEXT && updates.text !== undefined) {
                    updated.name = `텍스트: ${updates.text.substring(0, 10)}${updates.text.length > 10 ? '...' : ''}`;
                }
                // 도형 이름 자동 업데이트
                if (resource.type === LAYER_TYPES.SHAPE && updates.shapeType !== undefined) {
                    updated.name = `도형: ${updates.shapeType === 'rect' ? '사각형' : '원'}`;
                }

                return updated;
            });

            setIsModified(true);
            return newResources;
        });
    }, []);

    // 템플릿 로드
    const loadTemplate = useCallback((templateResources) => {
        const resourcesWithIds = templateResources.map(r => ({
            ...r,
            id: `resource-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            opacity: r.opacity ?? 1,
        }));

        setResources(resourcesWithIds);
        setSelectedResourceId(null);
        setIsModified(true);
    }, []);

    // 이미지 리소스 개수 제한 체크
    const checkResourceLimit = useCallback(() => {
        const imageCount = resources.filter(r => r.type === LAYER_TYPES.IMAGE).length;
        return imageCount >= 15;
    }, [resources]);

    return {
        resources,
        selectedResourceId,
        setSelectedResourceId,
        isModified,
        isLoading,
        isSaving: false,
        isUploading: false,
        error,
        handleResizeOrDrag,
        saveCurrentState,
        resetToPreviousPositions,
        resetToInitialPositions,
        uploadImage,
        addTextResource,
        updateTextResource,
        addShapeResource,
        updateResource,
        loadTemplate,
        removeResource,
        addResource,
        checkResourceLimit
    };
};

export default useResourceManager;
