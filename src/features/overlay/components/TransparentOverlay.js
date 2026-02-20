import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { LAYER_TYPES } from '../../editor/hooks/useResourceManager';
import { createOverlayChannel } from '../../../shared/utils/broadcastSync';

const STORAGE_KEY = 'sports-overlay-resources';

const TransparentOverlay = () => {
    const { id } = useParams();
    const [resources, setResources] = useState([]);
    const channelRef = useRef(null);

    // BroadcastChannel로 실시간 동기화
    useEffect(() => {
        // 초기 로드
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setResources(JSON.parse(stored));
            }
        } catch (e) {
            console.error('초기 리소스 로드 실패:', e);
        }

        // BroadcastChannel 구독 (fallback 포함)
        channelRef.current = createOverlayChannel();
        channelRef.current.onUpdate((updatedResources) => {
            setResources(updatedResources);
        });

        return () => {
            channelRef.current?.close();
        };
    }, [id]);

    // 투명 배경 스타일 적용
    useEffect(() => {
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
        const root = document.getElementById('root');
        if (root) root.style.background = 'transparent';

        return () => {
            document.documentElement.style.background = '';
            document.body.style.background = '';
            if (root) root.style.background = '';
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'transparent',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            {resources.map((resource) => (
                <div
                    key={resource.id}
                    style={{
                        position: 'absolute',
                        left: resource.x,
                        top: resource.y,
                        width: resource.width,
                        height: resource.height,
                        opacity: resource.opacity ?? 1,
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    }}
                >
                    {resource.type === LAYER_TYPES.IMAGE && (
                        <img
                            src={resource.src}
                            alt={resource.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    )}

                    {resource.type === LAYER_TYPES.TEXT && (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: resource.fontFamily,
                                fontSize: `${resource.fontSize}px`,
                                fontWeight: resource.textStyles?.includes('bold') ? 'bold' : 'normal',
                                fontStyle: resource.textStyles?.includes('italic') ? 'italic' : 'normal',
                                color: resource.color,
                                wordBreak: 'break-word',
                                overflow: 'hidden',
                                userSelect: 'none',
                            }}
                        >
                            {resource.text}
                        </div>
                    )}

                    {resource.type === LAYER_TYPES.SHAPE && (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: resource.fill,
                                border: resource.strokeWidth > 0 ? `${resource.strokeWidth}px solid ${resource.stroke}` : 'none',
                                borderRadius: resource.shapeType === 'circle' ? '50%' : `${resource.borderRadius || 0}px`,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TransparentOverlay;
