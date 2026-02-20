import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";

const PrivateRoute = ({ children, isPublic = false }) => {
    const auth = useAuth();

    // isPublic이 참인 경우 인증 여부와 상관없이 접근 가능
    if (isPublic) {
        return children;
    }

    // 로딩 중 그냥 진행 (KakaoAuthProvider 토큰 처리)
    if (auth.isLoading) {
        return children;
    }

    // 인증되지 않은 경우 로그인 페이지 이동
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 인증된 경우 컴포넌트 렌더링
    return children;
};

export default PrivateRoute;
