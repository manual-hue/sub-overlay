import apiClient from './apiClient';

export const getTeamList = async (params = {}) => {
    try {
        const response = await apiClient.get('/team/list', { params });
        return response.data || [];
    } catch (error) {
        console.error('팀 목록 조회 실패:', error);
        throw error;
    }
};
