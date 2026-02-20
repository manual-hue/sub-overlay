const CHANNEL_NAME = 'overlay-sync';
const STORAGE_KEY = 'sports-overlay-resources';
const POLL_INTERVAL = 2000;

export function createOverlayChannel() {
    // BroadcastChannel 지원 여부 확인
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(CHANNEL_NAME);

        return {
            postUpdate(resources) {
                channel.postMessage({ type: 'update', resources });
            },
            onUpdate(callback) {
                channel.onmessage = (event) => {
                    if (event.data?.type === 'update') {
                        callback(event.data.resources);
                    }
                };
            },
            close() {
                channel.close();
            },
        };
    }

    // Fallback: storage 이벤트 + 폴링
    let pollTimer = null;
    let storageHandler = null;

    return {
        postUpdate(_resources) {
            // saveCurrentState에서 이미 localStorage에 저장하므로 별도 작업 불필요
        },
        onUpdate(callback) {
            const loadFromStorage = () => {
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        callback(JSON.parse(stored));
                    }
                } catch (e) {
                    console.error('broadcastSync fallback load error:', e);
                }
            };

            // storage 이벤트 (다른 탭)
            storageHandler = (e) => {
                if (e.key === STORAGE_KEY) {
                    loadFromStorage();
                }
            };
            window.addEventListener('storage', storageHandler);

            // 폴링 (같은 탭 fallback)
            pollTimer = setInterval(loadFromStorage, POLL_INTERVAL);

            // 초기 로드
            loadFromStorage();
        },
        close() {
            if (pollTimer) clearInterval(pollTimer);
            if (storageHandler) window.removeEventListener('storage', storageHandler);
        },
    };
}
