import apiClient from './apiClient';
import matchesDataList from '../features/matches/data/matchesDataList';

export const getGameList = async (params = {}) => {
    try {
        const response = await apiClient.get('/game/list', { params });
        return response.data || [];
    } catch (error) {
        console.error('게임 목록 조회 실패, 목 데이터로 대체:', error);
        return matchesDataList;
    }
};

export const getGameDetail = async (gameId) => {
    try {
        const response = await apiClient.get(`/game/${gameId}`);
        return response.data || {};
    } catch (error) {
        console.error(`게임 상세 정보 조회 실패 (ID: ${gameId}), 목 데이터로 대체:`, error);
        const match = matchesDataList.matches?.find((m) => m.idx === String(gameId));
        return match || {};
    }
};

export const createGame = async (gameData) => {
    const response = await apiClient.post('/game/create', gameData);
    return response.data || {};
};
