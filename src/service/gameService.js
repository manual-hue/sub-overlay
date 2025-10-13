import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const gameService = {
    // 게임 목록 가져오기
    getGameList: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/game/list`, {
                params: params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)}`
                }
            });

            return response.data.body || [];
        } catch (error) {
            console.error('게임 목록 조회 실패:', error);
            throw error;
        }
    },

    // 팀 목록 가져오기
    getTeamList: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/list`, {
                params: params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)}`
                }
            });

            return response.data.body || [];
        } catch (error) {
            console.error('팀 목록 조회 실패:', error);
            throw error;
        }
    },

    // 게임 단건 조회
    getGameDetail: async (gameId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/game/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)}`
                }
            });

            return response.data.body || {};
        } catch (error) {
            console.error(`게임 상세 정보 조회 실패 (ID: ${gameId}):`, error);
            throw error;
        }
    },

    // 새 게임 생성
    createGame: async (gameData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/game/create`, gameData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)}`
                }
            });

            return response.data.body || {};
        } catch (error) {
            console.error('게임 생성 실패:', error);
            throw error;
        }
    }
};

export default gameService;