import React from 'react';
import { useAuth } from "../contexts/AuthProvider";

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

const KakaoLoginButton = ({ size = 'medium', fullWidth = true, ...props }) => {
    const { initiateKakaoLogin, isAuthenticated, logout } = useAuth();

    if (isAuthenticated) {
        return (
            <div {...props}>
                <button
                    onClick={logout}
                    className={`${fullWidth ? 'w-full' : ''} px-4 py-3 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 transition-colors`}
                >
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <div {...props}>
            <button
                onClick={initiateKakaoLogin}
                className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] hover:bg-[#E6CF00] text-black font-bold rounded transition-colors`}
            >
                <KakaoIcon />
                카카오 계정으로 로그인
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
                카카오 계정으로 간편하게 로그인하세요
            </p>
        </div>
    );
};

export default KakaoLoginButton;
