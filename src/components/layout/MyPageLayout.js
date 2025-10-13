import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainNavbar from './MainNavbar';
import Footer from "./Footer";

const Background = styled(Box)(({ theme }) => ({
    width: '100%',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 100px',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
        padding: '50px 0', // 작은 화면에서는 좌우 패딩 제거
    }
}));

const ContentContainer = styled(Box)({
    justifyItems: "center",
    margin: '0 auto',
    //textAlign: 'center',
    padding: '0 20px',
    width: '100%',
});

const MyPageLayout = ({ children }) => {
    return (
        <>
            <MainNavbar />
            <Background>
                <ContentContainer>
                    {children}
                </ContentContainer>
            </Background>
            <Footer />
        </>
    );
};

export default MyPageLayout;