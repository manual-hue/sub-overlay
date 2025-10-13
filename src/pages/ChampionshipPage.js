import React from 'react';
import MyPageLayout from "../components/layout/MyPageLayout";
import OAuthStatus from "../components/auth/OAuthStatus";
import Championship from "../components/features/matches/Championship";
import {useAuth} from "../contexts/AuthProvider";

const ChampionshipPage = () => {
    const { user } = useAuth();
    console.log(user)

    return (
        <MyPageLayout>
            {user && user.data.name === '김소연' && <OAuthStatus />}
            <Championship />
        </MyPageLayout>
    );
};

export default ChampionshipPage;