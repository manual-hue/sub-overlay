import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Snackbar from '../../../shared/components/Snackbar';

// ============================================================
// [DEV MODE] 서버 없이 테스트할 때 true로 설정하세요.
// 카카오 로그인 서버가 준비되면 false로 되돌리면 됩니다.
// ============================================================
const IS_DEV_MODE = true;

// [DEV MODE] 개발용 가짜 사용자 데이터
const DEV_MOCK_USER = {
    data: {
        name: '개발자',
        email: 'dev@opencg.local',
        profile_image: null,
    }
};
// ============================================================

const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_KEY;
const USER_KEY = process.env.REACT_APP_USER_KEY;
const API_BASE_URL = process.env.REACT_APP_API_URL;

let debugFetchCount = 0;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const tokenProcessed = useRef(false);
    const [cachedUser, setCachedUser] = useState(IS_DEV_MODE ? DEV_MOCK_USER : null);
    const isInitialRender = useRef(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
        duration: 3000
    });

    useEffect(() => {
        if (!isInitialRender.current) return;
        isInitialRender.current = false;

        // [DEV MODE] 개발 모드에서는 localStorage/API 호출 건너뜀
        if (IS_DEV_MODE) {
            console.log('[AuthProvider] ⚠️ DEV MODE 활성화 - 인증 우회 중');
            return;
        }

        // --- 원본 인증 로직 (IS_DEV_MODE=false 일 때 실행) ---
        try {
            const userData = localStorage.getItem(USER_KEY);
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setCachedUser(parsedUser);
                    console.log('[AuthProvider] 로컬 스토리지에서 사용자 데이터 로드 성공');
                } catch (parseError) {
                    console.error('[AuthProvider] JSON 파싱 오류:', parseError);
                    localStorage.removeItem(USER_KEY);
                }
            }
        } catch (e) {
            console.error('[AuthProvider] 로컬 스토리지에서 사용자 데이터 로드 실패:', e);
            localStorage.removeItem(USER_KEY);
        }

        refreshAccessToken();
        // --- 원본 인증 로직 끝 ---
    }, []);

    const saveUserToStorage = useCallback((userData) => {
        if (userData) {
            try {
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                setCachedUser(userData);
                console.log('[AuthProvider] 사용자 데이터 로컬 스토리지에 저장 성공');
            } catch (e) {
                console.error('[AuthProvider] 사용자 데이터 저장 실패:', e);
            }
        }
    }, []);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const showSnackbar = useCallback((message, options = {}) => {
        setSnackbar({
            open: true,
            message,
            severity: options.variant || 'info',
            duration: options.autoHideDuration || 3000
        });
    }, []);

    const refreshAccessToken = useCallback(async () => {
        // [DEV MODE] 개발 모드에서는 항상 성공 반환
        if (IS_DEV_MODE) return true;

        // --- 원본 토큰 갱신 로직 ---
        const fetchId = ++debugFetchCount;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!token) {
            console.error(`[AuthProvider-${fetchId}] 액세스 토큰이 없어 갱신할 수 없습니다.`);
            return false;
        }

        try {
            console.log(`[AuthProvider-${fetchId}] 헬스체크를 통한 토큰 갱신 시도 중...`);
            const response = await fetch(`${API_BASE_URL}/refresh`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                console.log(`[AuthProvider-${fetchId}] 헬스체크 성공, 토큰이 유효합니다.`);
                return true;
            } else if (response.status === 401) {
                console.error(`[AuthProvider-${fetchId}] 토큰이 만료되었습니다.`);
                return false;
            } else {
                console.error(`[AuthProvider-${fetchId}] 헬스체크 실패: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error(`[AuthProvider-${fetchId}] 헬스체크 중 오류:`, error);
            return false;
        }
        // --- 원본 토큰 갱신 로직 끝 ---
    }, []);

    useEffect(() => {
        // [DEV MODE] 개발 모드에서는 URL 토큰 처리 건너뜀
        if (IS_DEV_MODE) return;

        // --- 원본 URL 토큰 처리 로직 ---
        if (tokenProcessed.current) return;

        const searchParams = new URLSearchParams(location.search);
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken) {
            console.log('[AuthProvider] URL 액세스 토큰을 찾았습니다:', accessToken.substring(0, 10) + '...');
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

            if (refreshToken) {
                console.log('[AuthProvider] URL 리프레시 토큰을 찾았습니다');
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }

            const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            console.log('[AuthProvider] 저장된 액세스 토큰 확인:', storedToken ? (storedToken.substring(0, 10) + '...') : '없음');

            queryClient.invalidateQueries(['user']);

            if (!location.pathname.includes('/oauth/redirect')) {
                navigate(location.pathname, { replace: true });
                showSnackbar('로그인되었습니다.', { variant: 'success', autoHideDuration: 2000 });
            }

            tokenProcessed.current = true;
        }
        // --- 원본 URL 토큰 처리 로직 끝 ---
    }, [location.search, location.pathname, navigate, queryClient, showSnackbar]);

    const logout = useCallback(() => {
        // [DEV MODE] 개발 모드에서는 간단히 홈으로 이동만
        if (IS_DEV_MODE) {
            showSnackbar('(DEV) 로그아웃 시뮬레이션', { variant: 'info', autoHideDuration: 2000 });
            navigate('/', { replace: true });
            return;
        }

        // --- 원본 로그아웃 로직 ---
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setCachedUser(null);
        queryClient.setQueryData(['user'], null);
        showSnackbar('로그아웃되었습니다.', { variant: 'info', autoHideDuration: 2000 });
        navigate('/', { replace: true });
        // --- 원본 로그아웃 로직 끝 ---
    }, [navigate, queryClient, showSnackbar]);

    const fetchUserProfile = useCallback(async () => {
        // [DEV MODE] 개발 모드에서는 가짜 유저 반환
        if (IS_DEV_MODE) return DEV_MOCK_USER;

        // --- 원본 프로필 조회 로직 ---
        const fetchId = ++debugFetchCount;
        let token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!token) {
            console.log(`[AuthProvider-${fetchId}] 액세스 토큰이 없습니다`);
            return null;
        }

        try {
            console.log(`[AuthProvider-${fetchId}] 사용자 프로필 요청 중...`);
            let response = await fetch(`${API_BASE_URL}/user/mypage`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                console.log(`[AuthProvider-${fetchId}] 토큰이 만료되었습니다. 헬스체크 시도 중...`);
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    console.log(`[AuthProvider-${fetchId}] 토큰이 유효함을 확인했습니다. 다시 요청 중...`);
                    response = await fetch(`${API_BASE_URL}/user/mypage`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {
                    console.error(`[AuthProvider-${fetchId}] 토큰이 유효하지 않습니다.`);
                    return null;
                }
            }

            if (!response.ok) {
                console.error(`[AuthProvider-${fetchId}] 프로필 요청 실패: ${response.status}`);
                throw new Error(`프로필 요청 실패: ${response.status}`);
            }

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error(`[AuthProvider-${fetchId}] API 응답 JSON 파싱 오류:`, parseError);
                return null;
            }

            console.log(`[AuthProvider-${fetchId}] 사용자 프로필 응답 성공`);

            if (data && data.body) {
                console.log(`[AuthProvider-${fetchId}] data.body를 사용자 데이터로 사용`);
                saveUserToStorage(data.body);
                return data.body;
            } else {
                console.log(`[AuthProvider-${fetchId}] data.body가 없어 전체 데이터 사용`);
                saveUserToStorage(data);
                return data;
            }
        } catch (error) {
            console.error(`[AuthProvider-${fetchId}] 사용자 프로필 가져오기 실패:`, error);
            return null;
        }
        // --- 원본 프로필 조회 로직 끝 ---
    }, [saveUserToStorage, refreshAccessToken]);

    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserProfile,
        initialData: IS_DEV_MODE ? DEV_MOCK_USER : cachedUser,
        staleTime: 30 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
        // [DEV MODE] 개발 모드에서는 항상 활성화, 아니면 토큰 있을 때만
        enabled: IS_DEV_MODE || !!localStorage.getItem(ACCESS_TOKEN_KEY),
    });

    const initiateKakaoLogin = useCallback(() => {
        // [DEV MODE] 개발 모드에서는 바로 대회 페이지로 이동
        if (IS_DEV_MODE) {
            console.log('[AuthProvider] ⚠️ DEV MODE - 카카오 로그인 우회, 바로 이동');
            showSnackbar('(DEV) 로그인 시뮬레이션 성공', { variant: 'success', autoHideDuration: 2000 });
            navigate('/matches/main', { replace: true });
            return;
        }

        // --- 원본 카카오 로그인 로직 ---
        const redirectUri = `${window.location.origin}/oauth/redirect`;
        const KAKAO_AUTH_URL = `${process.env.REACT_APP_KAKAO_LOGIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`;
        console.log('[AuthProvider] 카카오 로그인 시작:', KAKAO_AUTH_URL);
        window.location.href = KAKAO_AUTH_URL;
        // --- 원본 카카오 로그인 로직 끝 ---
    }, [navigate, showSnackbar]);

    const getAccessToken = useCallback(() => {
        // [DEV MODE] 개발 모드에서는 가짜 토큰 반환
        if (IS_DEV_MODE) return 'dev-mock-token';
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }, []);

    const fetchWithAuth = useCallback(async (url, options = {}) => {
        // [DEV MODE] 개발 모드에서는 빈 응답 반환
        if (IS_DEV_MODE) {
            console.log(`[AuthProvider-DEV] 인증 요청 시뮬레이션: ${url}`);
            return { data: null, ok: true };
        }

        // --- 원본 인증 API 호출 로직 ---
        const fetchId = `fetch-${Math.random().toString(36).substr(2, 5)}`;
        let token = getAccessToken();
        if (!token) {
            throw new Error('인증 토큰이 없습니다');
        }

        const headers = {
            ...options.headers || {},
            'Authorization': `Bearer ${token}`
        };

        try {
            console.log(`[AuthProvider-${fetchId}] 인증 요청 시작: ${url}`);
            let response = await fetch(url, { ...options, headers });

            if (response.status === 401) {
                console.log(`[AuthProvider-${fetchId}] 인증 만료, 헬스체크 시도 중...`);
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    console.log(`[AuthProvider-${fetchId}] 토큰이 유효함을 확인했습니다. 다시 요청 중...`);
                    response = await fetch(url, { ...options, headers });
                } else {
                    console.error(`[AuthProvider-${fetchId}] 토큰이 유효하지 않습니다.`);
                    throw new Error('인증이 만료되었습니다');
                }
            }

            if (!response.ok) {
                console.error(`[AuthProvider-${fetchId}] API 요청 실패: ${response.status}`);
                throw new Error(`요청 실패: ${response.status}`);
            }

            const responseText = await response.text();
            if (!responseText.trim()) {
                console.log(`[AuthProvider-${fetchId}] 빈 응답 반환`);
                return { data: null, ok: response.ok };
            }

            try {
                const data = JSON.parse(responseText);
                console.log(`[AuthProvider-${fetchId}] 요청 성공`);
                if (data && data.body !== undefined) {
                    return data.body;
                }
                return data;
            } catch (e) {
                console.log(`[AuthProvider-${fetchId}] JSON 파싱 실패, 텍스트 응답 반환`);
                return { data: responseText, ok: response.ok };
            }
        } catch (error) {
            console.error(`[AuthProvider-${fetchId}] 인증 요청 실패:`, error);
            throw error;
        }
        // --- 원본 인증 API 호출 로직 끝 ---
    }, [getAccessToken, refreshAccessToken]);

    const snackbarComponent = useMemo(() => (
        <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            duration={snackbar.duration}
            onClose={handleCloseSnackbar}
        />
    ), [snackbar, handleCloseSnackbar]);

    const authValue = useMemo(() => ({
        user: IS_DEV_MODE ? DEV_MOCK_USER : (userData || cachedUser),
        isLoading: IS_DEV_MODE ? false : isLoading,
        initiateKakaoLogin,
        // [DEV MODE] 개발 모드에서는 항상 인증됨
        isAuthenticated: IS_DEV_MODE ? true : (Boolean(userData || cachedUser) && Boolean(localStorage.getItem(ACCESS_TOKEN_KEY))),
        logout,
        getAccessToken,
        fetchWithAuth,
        snackbarComponent,
        refetchUser: refetch,
        refreshToken: refreshAccessToken,
        showSnackbar
    }), [
        userData, cachedUser, isLoading, initiateKakaoLogin, logout,
        getAccessToken, fetchWithAuth, refetch, refreshAccessToken,
        showSnackbar, snackbarComponent
    ]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
            {snackbarComponent}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내에서만 사용할 수 있습니다.');
    }
    return context;
};
