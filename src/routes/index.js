import { Routes, Route, Navigate } from 'react-router-dom';
import OAuthRedirectPage from "../features/auth/pages/OAuthRedirectPage";
import MainPage from "../pages/MainPage";
import PrivateRoute from "../features/auth/components/PrivateRoute";
import AuthPageLayout from "../shared/layouts/AuthPageLayout";
import MatchesRoutes from "./MatchesRoutes";
import TransparentOverlay from "../features/overlay/components/TransparentOverlay";
import OverlayPreview from "../features/overlay/components/OverlayPreview";
import { useAuth } from "../features/auth/contexts/AuthProvider";

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

            {/* 투명 배경 오버레이 (OBS 브라우저 소스용, 인증 불필요) */}
            <Route path="/overlay/:id" element={<TransparentOverlay />} />

            {/* 오버레이 미리보기 (웹페이지 위에 오버레이 테스트, 인증 불필요) */}
            <Route path="/preview/:id" element={<OverlayPreview />} />

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
