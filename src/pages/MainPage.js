import React from 'react';
import MainPageLayout from "../shared/layouts/MainPageLayout";
import { useAuth } from "../features/auth/contexts/AuthProvider";
import Spinner from '../shared/components/Spinner';

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
            <h1 className="text-6xl sm:text-8xl font-semibold">OPEN CG</h1>
            <h2 className="text-xl mb-8">기록 관리부터 중계까지, 하나로</h2>

            {isLoading ? (
                <div className="flex justify-center my-4">
                    <Spinner className="h-8 w-8 text-white" />
                </div>
            ) : isAuthenticated ? (
                <div>
                    <p className="mb-4">{user?.data.name || '사용자'} 님, 환영합니다!</p>
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100/10 transition-colors text-blue-400"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <button
                    onClick={initiateKakaoLogin}
                    className="rounded overflow-hidden hover:opacity-90 transition-opacity"
                >
                    <img
                        src="/img/kakao_login_large_wide.png"
                        alt="카카오톡으로 로그인"
                        className="block w-full h-full"
                    />
                </button>
            )}
            {snackbarComponent}
        </MainPageLayout>
    );
};

export default MainPage;
