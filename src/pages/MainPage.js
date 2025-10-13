import React from 'react';
import { Typography, ButtonBase, Box, CircularProgress } from '@mui/material';
import MainPageLayout from "../components/layout/MainPageLayout";
import {useAuth} from "../contexts/AuthProvider";

const MainPage = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        logout,
        initiateKakaoLogin,
        snackbarComponent
    } = useAuth();

    return (
        <MainPageLayout>
            <Typography variant="h1" sx={{ fontWeight: 600 }}>
                OPEN CG
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
                기록 관리부터 중계까지, 하나로
            </Typography>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            ) : isAuthenticated ? (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {user?.data.name || '사용자'} 님, 환영합니다!
                    </Typography>
                    <ButtonBase
                        component="button"
                        onClick={logout}
                        sx={{
                            width: 'auto',
                            height: 'auto',
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #e1e1e1',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        <Typography variant="button" color="primary">
                            로그아웃
                        </Typography>
                    </ButtonBase>
                </Box>
            ) : (
                <ButtonBase
                    component="button"
                    onClick={initiateKakaoLogin}
                    sx={{
                        width: 'auto',
                        height: 'auto',
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:hover': {
                            opacity: 0.9
                        }
                    }}
                >
                    <img
                        src="/img/kakao_login_large_wide.png"
                        alt="카카오톡으로 로그인"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </ButtonBase>
            )}
            {snackbarComponent}
        </MainPageLayout>
    );
};

export default MainPage;