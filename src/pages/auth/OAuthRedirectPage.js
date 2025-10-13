import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from "../../contexts/AuthProvider";

// 중복 리다이렉션 문제 해결용 리다이렉트 페이지
const OAuthRedirectPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, refetchUser } = useAuth();
    const redirectionCompleted = useRef(false);
    const [status, setStatus] = useState({
        loading: true,
        message: '로그인 처리 중...',
        error: false
    });

    useEffect(() => {
        // 이미 리다이렉션이 완료되었으면 더 이상 처리하지 않음!
        if (redirectionCompleted.current) {
            return;
        }

        const handleAuthentication = async () => {
            try {
                console.log('OAuthRedirectPage - 사용자 정보 갱신 시작');
                await refetchUser();
                console.log('OAuthRedirectPage - 사용자 정보 갱신 완료', { isAuthenticated, user });

                // 작은 지연을 두어 모든 상태 업데이트가 안정화되도록 함
                setTimeout(() => {
                    // 다시 한번 최신 인증 상태 확인
                    if (user) {
                        console.log('OAuthRedirectPage - 인증 확인됨, 마이페이지로 이동');
                        setStatus({
                            loading: true,
                            message: '로그인 성공! 마이페이지로 이동합니다...',
                            error: false
                        });

                        // 경기 메인화면으로 이동하고 리다이렉션 완료
                        redirectionCompleted.current = true;
                        navigate('/matches/main', { replace: true });
                    } else {
                        console.log('OAuthRedirectPage - 인증 실패, 홈으로 이동');
                        setStatus({
                            loading: false,
                            message: '로그인에 실패했습니다',
                            error: true
                        });

                        // 홈으로 이동하고 리다이렉션 완료
                        redirectionCompleted.current = true;
                        navigate('/', { replace: true });
                    }
                }, 500);
            } catch (error) {
                console.error('OAuthRedirectPage - 처리 오류:', error);

                // 에러 상태로 설정하고 홈으로 이동
                setStatus({
                    loading: false,
                    message: '로그인 처리 중 오류가 발생했습니다',
                    error: true
                });

                redirectionCompleted.current = true;
                navigate('/', { replace: true });
            }
        };

        handleAuthentication();

        // 컴포넌트 언마운트 시 cleanup
        return () => {
            console.log('OAuthRedirectPage - 컴포넌트 언마운트');
        };
    }, [navigate, refetchUser, user, isAuthenticated]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}
        >
            {status.loading ? (
                <>
                    <CircularProgress size={60} color="primary" />
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        {status.message}
                    </Typography>
                </>
            ) : (
                <Typography
                    color={status.error ? "error" : "primary"}
                    variant="h6"
                >
                    {status.message}
                </Typography>
            )}
        </Box>
    );
};

export default OAuthRedirectPage;