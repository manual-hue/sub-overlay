/**
 * YouTube/Twitch URL을 임베드 URL로 변환
 * 일반 URL이면 그대로 반환
 */
export const toEmbedUrl = (url) => {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');

        // YouTube: watch, shorts, live, youtu.be
        if (host === 'youtube.com') {
            const videoId =
                parsed.searchParams.get('v') ||
                parsed.pathname.match(/^\/(?:shorts|live|embed)\/([^/?]+)/)?.[1];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            }
        }
        if (host === 'youtu.be') {
            const videoId = parsed.pathname.slice(1).split('/')[0];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            }
        }

        // Twitch: channel, video, clip
        if (host === 'twitch.tv') {
            const parent = window.location.hostname;
            const parts = parsed.pathname.split('/').filter(Boolean);

            if (parts[0] === 'videos' && parts[1]) {
                return `https://player.twitch.tv/?video=${parts[1]}&parent=${parent}&autoplay=true&muted=true`;
            }
            if (parts[1] === 'clip' && parts[2]) {
                return `https://clips.twitch.tv/embed?clip=${parts[2]}&parent=${parent}&autoplay=true&muted=true`;
            }
            if (parts[0] && !parts[1]) {
                return `https://player.twitch.tv/?channel=${parts[0]}&parent=${parent}&autoplay=true&muted=true`;
            }
        }
        if (host === 'clips.twitch.tv') {
            const parent = window.location.hostname;
            const slug = parsed.pathname.slice(1).split('/')[0];
            if (slug) {
                return `https://clips.twitch.tv/embed?clip=${slug}&parent=${parent}&autoplay=true&muted=true`;
            }
        }
    } catch {
        // URL 파싱 실패 시 원본 반환
    }
    return url;
};
