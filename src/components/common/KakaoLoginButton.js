import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {useAuth} from "../../hooks/useAuth";


const KakaoButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FEE500',
    color: '#000000',
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#E6CF00',
    },
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

// 카카오 아이콘 컴포넌트
const KakaoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 4C7.03 4 3 7.13 3 11C3 13.25 4.21 15.27 6.14 16.61L5.21 20.11C5.16 20.29 5.22 20.49 5.36 20.61C5.5 20.73 5.7 20.76 5.87 20.68L9.86 18.35C10.57 18.45 11.28 18.5 12 18.5C16.97 18.5 21 15.37 21 11.5C21 7.63 16.97 4 12 4Z"
            fill="#000000"
        />
    </svg>
);

const KakaoLoginButton = ({ size = 'medium', fullWidth = true, variant = 'contained', ...props }) => {
    const { loginWithKakao, isAuthenticated, logout } = useAuth();

    if (isAuthenticated) {
        return (
            <Box {...props}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={logout}
                    size={size}
                    fullWidth={fullWidth}
                >
                    로그아웃
                </Button>
            </Box>
        );
    }

    return (
        <Box {...props}>
            <KakaoButton
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                onClick={loginWithKakao}
                startIcon={<KakaoIcon />}
            >
                카카오 계정으로 로그인
            </KakaoButton>
            <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1, display: 'block' }}>
                카카오 계정으로 간편하게 로그인하세요
            </Typography>
        </Box>
    );
};

export default KakaoLoginButton;