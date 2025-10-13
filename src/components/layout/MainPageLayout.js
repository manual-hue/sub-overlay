import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainNavbar from './MainNavbar';
import Footer from "./Footer";

const Background = styled(Box)({
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/img/exam_image.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
});

const ContentContainer = styled(Box)({
    textAlign: 'center',
    padding: '0 20px',
    width: '100%',
});

const MainPageLayout = ({ children }) => {
    return (
        <Background>
            <MainNavbar />
            <ContentContainer>
                {children}
            </ContentContainer>
        </Background>
    );
};

export default MainPageLayout;