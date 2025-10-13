import React, { useState } from 'react';
import {Box, Typography, Paper, Button, CircularProgress, Chip, Grid, Collapse} from '@mui/material';
import {useAuth} from "../../contexts/AuthProvider";

// OAuth 인증 상태를 표시하고 디버깅
const OAuthStatus = () => {
    const {
        user,
        isAuthenticated,
        getAccessToken,
        isLoading,
        fetchWithAuth
    } = useAuth();

    const [healthCheckResult, setHealthCheckResult] = useState(null);
    const [checking, setChecking] = useState(false);
    const [open, setOpen] = useState(false);

    // 테스트 API 요청 함수 - authApi 대신 fetchWithAuth 사용
    const testApiRequest = async () => {
        try {
            setChecking(true);
            // authApi 대신 fetchWithAuth 사용
            const result = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/healthCheck`);
            console.log('헬스체크 응답:', result);
            setHealthCheckResult({
                success: true,
                message: typeof result === 'object' ? JSON.stringify(result) : result
            });
        } catch (error) {
            console.error('헬스체크 요청 오류:', error);
            setHealthCheckResult({
                success: false,
                message: error.message
            });
        } finally {
            setChecking(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ boxShadow:'none',background: 'transparent', float:'right', p: 6, m: 2, mx: 'auto', maxWidth:'-webkit-fill-available'}}>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Chip
                    size="small"
                    onClick={() => setOpen(!open)}
                    color="error"
                    variant="outlined"
                    label="health-check"
                    sx={{
                        '&:hover': {
                            bgcolor: 'rgb(196,0,75) !important',
                            color: 'white'
                        }
                    }}/>
            </Grid>
            <Grid item xs={12}>
                <Collapse in={open}>
                    <Typography variant="h5" gutterBottom>
                        인증 상태 정보
                    </Typography>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                <strong>인증 상태:</strong> {isAuthenticated ? '인증됨 ✅' : '인증되지 않음 ❌'}
                            </Typography>

                            {user && (
                                <>
                                    <Typography variant="subtitle1">
                                        <strong>사용자 정보:</strong>
                                    </Typography>
                                    <Typography variant="body2" component="pre" sx={{
                                        p: 1.5,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        whiteSpace: 'pre-wrap',
                                        overflowX: 'auto'
                                    }}>
                                        {JSON.stringify(user, null, 4)}
                                    </Typography>
                                </>
                            )}

                            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all', mt: 2 }}>
                                <strong>액세스 토큰:</strong> {getAccessToken() || '없음'}
                            </Typography>

                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                <strong>로컬 스토리지 토큰:</strong> {localStorage.getItem('access_token') ? '있음 ✅' : '없음 ❌'}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={testApiRequest}
                            disabled={checking}
                            startIcon={checking && <CircularProgress size={20} color="inherit" />}
                        >
                            {checking ? '테스트 중...' : 'API 헬스체크 테스트'}
                        </Button>
                    </Box>

                    {healthCheckResult && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: healthCheckResult.success ? 'success.lighter' : 'error.lighter',
                            borderRadius: 1
                        }}>
                            <Typography variant="subtitle2">
                                <strong>헬스체크 결과:</strong> {healthCheckResult.success ? '성공 ✅' : '실패 ❌'}
                            </Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {healthCheckResult.message}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            현재 URL: {window.location.href}
                        </Typography>
                    </Box>
                </Collapse>
            </Grid>
        </Paper>
    );
};

export default OAuthStatus;