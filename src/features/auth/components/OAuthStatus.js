import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthProvider";
import Spinner from '../../../shared/components/Spinner';

const OAuthStatus = () => {
    const { user, isAuthenticated, getAccessToken, isLoading, fetchWithAuth } = useAuth();

    const [healthCheckResult, setHealthCheckResult] = useState(null);
    const [checking, setChecking] = useState(false);
    const [open, setOpen] = useState(false);

    const testApiRequest = async () => {
        try {
            setChecking(true);
            const result = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/healthCheck`);
            console.log('헬스체크 응답:', result);
            setHealthCheckResult({
                success: true,
                message: typeof result === 'object' ? JSON.stringify(result) : result
            });
        } catch (error) {
            console.error('헬스체크 요청 오류:', error);
            setHealthCheckResult({ success: false, message: error.message });
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="float-right p-6 m-2 max-w-full">
            <div className="text-right">
                <button
                    onClick={() => setOpen(!open)}
                    className="text-xs px-3 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                    health-check
                </button>
            </div>

            {open && (
                <div className="mt-4">
                    <h2 className="text-xl font-medium mb-4">인증 상태 정보</h2>

                    {isLoading ? (
                        <div className="flex my-4">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2">
                            <p><strong>인증 상태:</strong> {isAuthenticated ? '인증됨 ✅' : '인증되지 않음 ❌'}</p>

                            {user && (
                                <>
                                    <p><strong>사용자 정보:</strong></p>
                                    <pre className="p-3 bg-dark-paper rounded text-sm whitespace-pre-wrap overflow-x-auto">
                                        {JSON.stringify(user, null, 4)}
                                    </pre>
                                </>
                            )}

                            <p className="break-all mt-2">
                                <strong>액세스 토큰:</strong> {getAccessToken() || '없음'}
                            </p>

                            <p className="mt-2">
                                <strong>로컬 스토리지 토큰:</strong> {localStorage.getItem('access_token') ? '있음 ✅' : '없음 ❌'}
                            </p>
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={testApiRequest}
                            disabled={checking}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors"
                        >
                            {checking && <Spinner className="h-5 w-5 text-white" />}
                            {checking ? '테스트 중...' : 'API 헬스체크 테스트'}
                        </button>
                    </div>

                    {healthCheckResult && (
                        <div className={`mt-4 p-3 rounded ${healthCheckResult.success ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                            <p className="font-medium">
                                <strong>헬스체크 결과:</strong> {healthCheckResult.success ? '성공 ✅' : '실패 ❌'}
                            </p>
                            <p className="text-sm break-all">{healthCheckResult.message}</p>
                        </div>
                    )}

                    <p className="mt-4 text-sm text-gray-500">
                        현재 URL: {window.location.href}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OAuthStatus;
