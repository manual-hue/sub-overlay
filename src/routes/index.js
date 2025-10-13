import { Routes, Route, Navigate } from 'react-router-dom';
import OAuthRedirectPage from "../pages/auth/OAuthRedirectPage";
import MainPage from "../pages/MainPage";
import PrivateRoute from "../components/auth/PrivateRoute";
import AuthPageLayout from "../components/layout/AuthPageLayout";
import MatchesRoutes from "./MatchesRoutes";
import {useAuth} from "../contexts/AuthProvider";

const RootRoutes = () => {
    const { isAuthenticated } = useAuth();

    // 이미 인증된 사용자는 리다이렉트
    const RedirectIfAuthenticated = ({ children }) => {
        return isAuthenticated ? <Navigate to="/matches/main" replace /> : children;
    };

    return (
        <Routes>
            {/* 메인 페이지 */}
            <Route exact path="/" element={<MainPage />} />

            {/* 로그인 */}
            <Route path="/login" element={
                <RedirectIfAuthenticated>
                    <AuthPageLayout>
                        <MainPage />
                    </AuthPageLayout>
                </RedirectIfAuthenticated>
            } />

            {/* OAuth 리디렉션 처리 - 최상위 경로에 배치해야 함! */}
            <Route path="/oauth/redirect" element={<OAuthRedirectPage />} />

            {/* 경기 관련  */}
            <Route path="/matches/*" element={
                <PrivateRoute isPublic={false}>
                    <MatchesRoutes />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default RootRoutes;