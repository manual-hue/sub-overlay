import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Snackbar } from '@mui/material';

const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_KEY;
const USER_KEY = process.env.REACT_APP_USER_KEY;
const API_BASE_URL = process.env.REACT_APP_API_URL;

// 디버그용 요청 카운터
let debugFetchCount = 0;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const tokenProcessed = useRef(false);
    const [cachedUser, setCachedUser] = useState(null);
    const isInitialRender = useRef(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
        duration: 3000
    });

    // 초기화 시 로컬 스토리지에서 사용자 데이터 로드
    useEffect(() => {
        if (!isInitialRender.current) return;
        isInitialRender.current = false;

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

        refreshAccessToken()
    }, []);

    // 사용자 데이터를 로컬 스토리지에 저장하는 함수
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

    // 스낵바 닫기 핸들러
    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // 스낵바 표시 함수 - useCallback으로 메모이제이션
    const showSnackbar = useCallback((message, options = {}) => {
        setSnackbar({
            open: true,
            message,
            severity: options.variant || 'info',
            duration: options.autoHideDuration || 3000
        });
    }, []);

    // 액세스 토큰 갱신 - healthCheck 엔드포인트만 사용
    const refreshAccessToken = useCallback(async () => {
        console.log('왓나')
        const fetchId = ++debugFetchCount;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!token) {
            console.error(`[AuthProvider-${fetchId}] 액세스 토큰이 없어 갱신할 수 없습니다.`);
            return false;
        }

        try {
            console.log(`[AuthProvider-${fetchId}] 헬스체크를 통한 토큰 갱신 시도 중...`);

            // healthCheck 엔드포인트 호출
            const response = await fetch(`${API_BASE_URL}/refresh`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
    }, []);

    // URL에서 토큰 추출 - 한 번만 처리하도록 보장
    useEffect(() => {
        if (tokenProcessed.current) return;

        const searchParams = new URLSearchParams(location.search);
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken) {
            console.log('[AuthProvider] URL 액세스 토큰을 찾았습니다:', accessToken.substring(0, 10) + '...');

            // 기존 토큰 제거 후 새 토큰 저장 (충돌 방지)
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

            if (refreshToken) {
                console.log('[AuthProvider] URL 리프레시 토큰을 찾았습니다');
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }

            // 토큰 저장 후 확인
            const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            console.log('[AuthProvider] 저장된 액세스 토큰 확인:', storedToken ? (storedToken.substring(0, 10) + '...') : '없음');

            // 토큰이 변경되면 사용자 정보 쿼리 무효화
            queryClient.invalidateQueries(['user']);

            // URL에서 토큰 파라미터 제거 (리다이렉트 페이지가 아닐 때만)
            if (!location.pathname.includes('/oauth/redirect')) {
                navigate(location.pathname, { replace: true });

                // 스낵바 표시
                showSnackbar('로그인되었습니다.', {
                    variant: 'success',
                    autoHideDuration: 2000
                });
            }

            // 토큰 처리 완료 표시
            tokenProcessed.current = true;
        }
    }, [location.search, location.pathname, navigate, queryClient, showSnackbar]);

    // 로그아웃 함수
    const logout = useCallback(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setCachedUser(null);
        queryClient.setQueryData(['user'], null);
        showSnackbar('로그아웃되었습니다.', {
            variant: 'info',
            autoHideDuration: 2000
        });
        navigate('/', { replace: true });
    }, [navigate, queryClient, showSnackbar]);

    // 토큰으로 사용자 프로필 가져오기
    const fetchUserProfile = useCallback(async () => {
        const fetchId = ++debugFetchCount;
        let token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!token) {
            console.log(`[AuthProvider-${fetchId}] 액세스 토큰이 없습니다`);
            return null;
        }

        try {
            // API 요청 시도
            console.log(`[AuthProvider-${fetchId}] 사용자 프로필 요청 중...`);
            let response = await fetch(`${API_BASE_URL}/user/mypage`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // 401 오류 시 토큰 갱신 시도
            if (response.status === 401) {
                console.log(`[AuthProvider-${fetchId}] 토큰이 만료되었습니다. 헬스체크 시도 중...`);
                const refreshed = await refreshAccessToken();

                if (refreshed) {
                    // 토큰이 여전히 유효하면 다시 시도
                    console.log(`[AuthProvider-${fetchId}] 토큰이 유효함을 확인했습니다. 다시 요청 중...`);
                    response = await fetch(`${API_BASE_URL}/user/mypage`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } else {
                    // 토큰 갱신 실패 시 null 반환
                    console.error(`[AuthProvider-${fetchId}] 토큰이 유효하지 않습니다.`);
                    return null;
                }
            }

            if (!response.ok) {
                console.error(`[AuthProvider-${fetchId}] 프로필 요청 실패: ${response.status}`);
                throw new Error(`프로필 요청 실패: ${response.status}`);
            }

            // 응답 데이터 파싱
            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error(`[AuthProvider-${fetchId}] API 응답 JSON 파싱 오류:`, parseError);
                return null;
            }

            console.log(`[AuthProvider-${fetchId}] 사용자 프로필 응답 성공`);

            // data.body 또는 전체 데이터 저장
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
    }, [saveUserToStorage, refreshAccessToken]);

    // 사용자 인증 상태 조회
    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserProfile,
        initialData: cachedUser, // 캐시된 사용자 데이터로 초기화
        staleTime: 30 * 60 * 1000, // 30분
        cacheTime: 60 * 60 * 1000, // 1시간
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!localStorage.getItem(ACCESS_TOKEN_KEY), // 토큰이 있을 때만 활성화
    });

    // 카카오 로그인 시작
    const initiateKakaoLogin = useCallback(() => {
        const redirectUri = `${window.location.origin}/oauth/redirect`;
        const KAKAO_AUTH_URL = `${process.env.REACT_APP_KAKAO_LOGIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`;

        console.log('[AuthProvider] 카카오 로그인 시작:', KAKAO_AUTH_URL);
        window.location.href = KAKAO_AUTH_URL;
    }, []);

    // 인증 헤더를 위한 액세스 토큰 가져오기
    const getAccessToken = useCallback(() => {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }, []);

    // 인증된 API 요청 함수
    const fetchWithAuth = useCallback(async (url, options = {}) => {
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
            let response = await fetch(url, {
                ...options,
                headers
            });

            // 401 오류 처리
            if (response.status === 401) {
                console.log(`[AuthProvider-${fetchId}] 인증 만료, 헬스체크 시도 중...`);

                // 헬스체크로 토큰 유효성 확인
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // 토큰이 여전히 유효하면 다시 시도
                    console.log(`[AuthProvider-${fetchId}] 토큰이 유효함을 확인했습니다. 다시 요청 중...`);
                    response = await fetch(url, {
                        ...options,
                        headers
                    });
                } else {
                    // 토큰 갱신 실패 시 에러 발생
                    console.error(`[AuthProvider-${fetchId}] 토큰이 유효하지 않습니다.`);
                    throw new Error('인증이 만료되었습니다');
                }
            }

            // 여전히 응답 실패인 경우
            if (!response.ok) {
                console.error(`[AuthProvider-${fetchId}] API 요청 실패: ${response.status}`);
                throw new Error(`요청 실패: ${response.status}`);
            }

            // 응답 데이터 파싱
            const responseText = await response.text();

            // 빈 응답 처리
            if (!responseText.trim()) {
                console.log(`[AuthProvider-${fetchId}] 빈 응답 반환`);
                return { data: null, ok: response.ok };
            }

            try {
                const data = JSON.parse(responseText);
                console.log(`[AuthProvider-${fetchId}] 요청 성공`);

                // body 속성이 있으면 반환
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
    }, [getAccessToken, refreshAccessToken]);

    // 스낵바 컴포넌트 - useMemo를 사용하여 메모이제이션
    const snackbarComponent = useMemo(() => (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.duration}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    ), [snackbar, handleCloseSnackbar]);

    // Context 값 메모이제이션
    const authValue = useMemo(() => ({
        user: userData || cachedUser,
        isLoading,
        initiateKakaoLogin,
        isAuthenticated: Boolean(userData || cachedUser) && Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
        logout,
        getAccessToken,
        fetchWithAuth,
        snackbarComponent,
        refetchUser: refetch,
        refreshToken: refreshAccessToken,
        showSnackbar
    }), [
        userData,
        cachedUser,
        isLoading,
        initiateKakaoLogin,
        logout,
        getAccessToken,
        fetchWithAuth,
        refetch,
        refreshAccessToken,
        showSnackbar,
        snackbarComponent
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