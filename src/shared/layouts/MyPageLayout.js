import React from 'react';
import MainNavbar from './MainNavbar';
import Footer from "./Footer";

const MyPageLayout = ({ children }) => {
    return (
        <>
            <MainNavbar />
            <div className="w-full flex flex-col items-center justify-center text-white py-[50px] px-[100px] sm:px-0">
                <div className="mx-auto px-5 w-full" style={{ justifyItems: 'center' }}>
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPageLayout;
