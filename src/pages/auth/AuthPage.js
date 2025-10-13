import React from 'react';
import { Container } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import AuthPageLayout from "../../components/layout/AuthPageLayout";

const AuthPage = () => {
    return (
        <AuthPageLayout>
            <Container
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <LoginForm />
            </Container>
        </AuthPageLayout>
    );
};

export default AuthPage;
