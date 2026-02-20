import React from 'react';
import MainNavbar from './MainNavbar';

const MainPageLayout = ({ children }) => {
    return (
        <div
            className="min-h-screen w-full relative flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/img/exam_image.jpg')`
            }}
        >
            <MainNavbar />
            <div className="text-center px-5 w-full">
                {children}
            </div>
        </div>
    );
};

export default MainPageLayout;
