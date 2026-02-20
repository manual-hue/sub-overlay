import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";
import Spinner from '../../../shared/components/Spinner';

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
        if (redirectionCompleted.current) return;

        const handleAuthentication = async () => {
            try {
                console.log('OAuthRedirectPage - 사용자 정보 갱신 시작');
                await refetchUser();
                console.log('OAuthRedirectPage - 사용자 정보 갱신 완료', { isAuthenticated, user });

                setTimeout(() => {
                    if (user) {
                        console.log('OAuthRedirectPage - 인증 확인됨, 마이페이지로 이동');
                        setStatus({ loading: true, message: '로그인 성공! 마이페이지로 이동합니다...', error: false });
                        redirectionCompleted.current = true;
                        navigate('/matches/main', { replace: true });
                    } else {
                        console.log('OAuthRedirectPage - 인증 실패, 홈으로 이동');
                        setStatus({ loading: false, message: '로그인에 실패했습니다', error: true });
                        redirectionCompleted.current = true;
                        navigate('/', { replace: true });
                    }
                }, 500);
            } catch (error) {
                console.error('OAuthRedirectPage - 처리 오류:', error);
                setStatus({ loading: false, message: '로그인 처리 중 오류가 발생했습니다', error: true });
                redirectionCompleted.current = true;
                navigate('/', { replace: true });
            }
        };

        handleAuthentication();
        return () => { console.log('OAuthRedirectPage - 컴포넌트 언마운트'); };
    }, [navigate, refetchUser, user, isAuthenticated]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
            {status.loading ? (
                <>
                    <Spinner className="h-16 w-16 text-blue-500" />
                    <p className="text-lg mt-4">{status.message}</p>
                </>
            ) : (
                <p className={`text-lg ${status.error ? 'text-red-500' : 'text-blue-500'}`}>
                    {status.message}
                </p>
            )}
        </div>
    );
};

export default OAuthRedirectPage;
