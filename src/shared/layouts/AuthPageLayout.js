import React from 'react';
import MainNavbar from './MainNavbar';

const AuthPageLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full relative flex flex-col items-center justify-center text-white bg-cover bg-center">
            <MainNavbar />
            <div className="text-center px-5 w-full">
                {children}
            </div>
        </div>
    );
};

export default AuthPageLayout;
