import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SportsOverlayEditor from "../features/editor/components/SportsOverlayEditor";
import ChampionshipPage from "../features/matches/pages/ChampionshipPage";

const MatchesRoutes = () => {
    return (
        <Routes>
            <Route path="/main" element={<ChampionshipPage />} />
            <Route path="/:id" element={<SportsOverlayEditor />} />
        </Routes>
    );
};

export default MatchesRoutes;
