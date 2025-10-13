import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainNavbar from './MainNavbar';

const Background = styled(Box)({
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
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

const AuthPageLayout = ({ children }) => {
    return (
        <Background>
            <MainNavbar />
            <ContentContainer>
                {children}
            </ContentContainer>
        </Background>
    );
};

export default AuthPageLayout;