import { useState, useEffect, useCallback } from 'react';
//import gameService from "../service/gameService";

export const LAYER_TYPES = {
    IMAGE: 'image',
    TEXT: 'text'
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


    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                // DB에서 리소스 Fetch, LOCAL 환경 테스트시 아래 로컬 스토리지 사용
                //const fetchedResources = await gameService.fetchResources();
                const storedResources = localStorage.getItem(STORAGE_KEY);
                let fetchedResources = storedResources ? JSON.parse(storedResources) : SAMPLE_RESOURCES;

                setResources(fetchedResources);

                // 포지션 초기화
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

        // 리소스 위치 및 사이즈 업데이트
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
            // 저장 전에 이전 포지션 업데이트
            const newPreviousPositions = {};
            resources.forEach(resource => {
                newPreviousPositions[resource.id] = {
                    x: resource.x,
                    y: resource.y,
                    width: resource.width,
                    height: resource.height
                };
            });

            // 저장
            //await gameService.saveResourcePositions(resources);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));

            // state 업데이트
            setPreviousPositions(newPreviousPositions);
            setIsModified(false);
            setError(null);

            return true; // 저장 성공
        } catch (err) {
            console.error('Error saving positions:', err);
            setError('위치 저장 중 오류가 발생했습니다.');
            return false; // 저장 실패
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

    // 이미지 파일을 처리하는 함수 (서버 요청 대신 로컬 처리)
    const uploadImage = useCallback(async (file) => {
        // 이미지 타입 체크 - png, gif만 허용
        if (!file.type.match(/image\/(png|gif)/)) {
            throw new Error('PNG 또는 GIF 파일만 업로드 가능합니다.');
        }

        // 이미지 개수 체크
        const imageCount = resources.filter(r => r.type === LAYER_TYPES.IMAGE).length;
        if (imageCount >= 15) {
            throw new Error('이미지는 최대 15개까지만 추가할 수 있습니다.');
        }

        // 파일 URL 생성 (실제 서버 업로드 대신 로컬 URL 사용)
        const fileUrl = URL.createObjectURL(file);

        // 새 리소스 객체 반환 (실제로는 서버에서 받을 정보)
        return {
            filename: file.name,
            path: fileUrl
        };
    }, [resources]);

    // 새 리소스 추가
    const addResource = useCallback((newResource) => {
        // 이미지 개수 체크
        if (newResource.type === LAYER_TYPES.IMAGE) {
            const imageCount = resources.filter(r => r.type === LAYER_TYPES.IMAGE).length;
            if (imageCount >= 15) {
                throw new Error('이미지는 최대 15개까지만 추가할 수 있습니다.');
            }
        }

        setResources(prevResources => {
            const newResources = [...prevResources, newResource];
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
            width: text.length * fontSize * 0.6, // 대략적인 너비 추정
            height: fontSize * 1.5,
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
                        // 텍스트 변경 시 이름도 업데이트
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
        isSaving: false, // 로컬에서는 항상 false
        isUploading: false, // 로컬에서는 항상 false
        error,
        handleResizeOrDrag,
        saveCurrentState,
        resetToPreviousPositions,
        resetToInitialPositions,
        uploadImage,
        addTextResource,
        updateTextResource,
        removeResource,
        addResource,
        checkResourceLimit
    };

    /*return {
        resources,
        isModified,
        isLoading,
        error,
        handleResizeOrDrag,
        saveCurrentState,
        resetToPreviousPositions,
        resetToInitialPositions
    };*/
};

export default useResourceManager;