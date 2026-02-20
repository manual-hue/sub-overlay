import React from 'react';
import MyPageLayout from "../../../shared/layouts/MyPageLayout";
import OAuthStatus from "../../auth/components/OAuthStatus";
import Championship from "../components/Championship";
import { useAuth } from "../../auth/contexts/AuthProvider";

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
