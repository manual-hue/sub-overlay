import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { LAYER_TYPES } from '../../editor/hooks/useResourceManager';
import { createOverlayChannel } from '../../../shared/utils/broadcastSync';
import { toEmbedUrl } from '../../../shared/utils/embedUrl';

const STORAGE_KEY = 'sports-overlay-resources';

const OverlayPreview = () => {
    const { id } = useParams();
    const [resources, setResources] = useState([]);
    const [urlInput, setUrlInput] = useState('');
    const [loadedUrl, setLoadedUrl] = useState('');
    const [iframeError, setIframeError] = useState(false);
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
            console.error('리소스 로드 실패:', e);
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

    const handleLoad = useCallback(() => {
        const trimmed = urlInput.trim();
        if (!trimmed) return;

        // 프로토콜이 없으면 https:// 추가
        const raw = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const embedUrl = toEmbedUrl(raw);
        setIframeError(false);
        setLoadedUrl(embedUrl);
    }, [urlInput]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLoad();
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-dark overflow-hidden">
            {/* URL 입력 바 */}
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-paper border-b border-gray-700 shrink-0 z-50">
                <span className="text-gray-400 text-sm whitespace-nowrap">URL</span>
                <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://www.youtube.com/watch?v=... 또는 https://twitch.tv/..."
                    className="flex-1 bg-dark border border-gray-600 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleLoad}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors whitespace-nowrap"
                >
                    로드
                </button>
            </div>

            {/* iframe + 오버레이 컨테이너 */}
            <div className="relative flex-1">
                {/* iframe */}
                {loadedUrl ? (
                    <iframe
                        src={loadedUrl}
                        title="Preview"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        allow="autoplay; encrypted-media"
                        className="w-full h-full border-0"
                        onError={() => setIframeError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                        <svg
                            className="w-16 h-16 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                            />
                        </svg>
                        <p className="text-lg">URL을 입력하고 로드 버튼을 누르세요</p>
                        <div className="text-sm text-gray-600 max-w-md text-center space-y-1">
                            <p>오버레이가 웹페이지 위에 어떻게 보이는지 미리 확인할 수 있습니다.</p>
                            <p className="text-green-600">
                                YouTube, Twitch URL은 자동으로 임베드 형식으로 변환됩니다.
                            </p>
                        </div>
                    </div>
                )}

                {/* iframe 로드 에러 안내 */}
                {iframeError && loadedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark/80">
                        <div className="bg-dark-paper border border-gray-700 rounded-lg p-6 max-w-md text-center space-y-3">
                            <p className="text-red-400 font-medium">페이지를 로드할 수 없습니다</p>
                            <p className="text-gray-400 text-sm">
                                해당 사이트가 iframe 삽입을 차단하고 있을 수 있습니다.
                                (X-Frame-Options / CSP 정책)
                            </p>
                            <p className="text-gray-500 text-xs">
                                임베딩을 허용하는 다른 URL을 시도해 보세요.
                            </p>
                        </div>
                    </div>
                )}

                {/* 오버레이 레이어 */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 40,
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
            </div>
        </div>
    );
};

export default OverlayPreview;
