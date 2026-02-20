import React, { useEffect, useState } from 'react';
import { createGame } from "../../../api/gameApi";
import { getTeamList } from "../../../api/teamApi";
import Spinner from '../../../shared/components/Spinner';

const categories = [
    { value: '야구', label: '야구' },
    { value: '축구', label: '축구' },
    { value: '농구', label: '농구' },
    { value: '배구', label: '배구' },
    { value: '기타', label: '기타' }
];

const CreateGameModal = ({ open, onClose, onSuccess }) => {
    const today = new Date().toISOString().split('T')[0];

    const [formValues, setFormValues] = useState({
        game_title: '', game_category: '', game_date: today,
        game_start_time: '', game_end_time: '', game_location: '',
        game_round: 1, team_seq_a: '', team_seq_b: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [teams, setTeams] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const [teamsError, setTeamsError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!open) return;
            setTeamsLoading(true);
            setTeamsError(null);
            try {
                const response = await getTeamList();
                let teamsList = [];
                if (response && Array.isArray(response)) teamsList = response;
                else if (response && response.data && Array.isArray(response.data)) teamsList = response.data;
                else console.warn('팀 데이터 형식 오류:', response);
                console.table(teamsList);
                setTeams(teamsList);
            } catch (error) {
                console.error('팀 목록 가져오기 오류:', error);
                setTeamsError(error);
            } finally {
                setTeamsLoading(false);
            }
        };
        fetchTeams();
    }, [open]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const parsedValue = (name === 'team_seq_a' || name === 'team_seq_b')
            ? (value === '' ? '' : Number(value)) : value;
        setFormValues({ ...formValues, [name]: parsedValue });
        setErrors({ ...errors, [name]: undefined });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.game_title) newErrors.game_title = '게임 제목을 입력해주세요.';
        if (!formValues.game_category) newErrors.game_category = '카테고리를 선택해주세요.';
        if (!formValues.game_date) newErrors.game_date = '날짜를 선택해주세요.';
        if (!formValues.game_start_time) newErrors.game_start_time = '시작 시간을 선택해주세요.';
        if (!formValues.game_end_time) newErrors.game_end_time = '종료 시간을 선택해주세요.';
        if (!formValues.game_location) newErrors.game_location = '장소를 입력해주세요.';
        if (!formValues.game_round || formValues.game_round < 1) newErrors.game_round = '라운드는 1 이상이어야 합니다';
        if (!formValues.team_seq_a) newErrors.team_seq_a = '팀 A를 선택해주세요.';
        if (!formValues.team_seq_b) newErrors.team_seq_b = '팀 B를 선택해주세요.';
        if (formValues.team_seq_a && formValues.team_seq_b && formValues.team_seq_a === formValues.team_seq_b)
            newErrors.team_seq_b = '팀 A와 팀 B는 서로 다른 팀이어야 합니다.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormValues({
            game_title: '', game_category: '', game_date: '',
            game_start_time: '', game_end_time: '', game_location: '',
            game_round: 1, team_seq_a: '', team_seq_b: ''
        });
        setErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const gameDate = formValues.game_date;
            const submissionData = {
                ...formValues,
                game_date: gameDate ? `${gameDate}T00:00:00` : '',
                game_start_time: formValues.game_start_time ? `${gameDate}T${formValues.game_start_time}:00` : '',
                game_end_time: formValues.game_end_time ? `${gameDate}T${formValues.game_end_time}:00` : ''
            };
            await createGame(submissionData);
            setSnackbar({ open: true, message: '게임이 성공적으로 생성되었습니다', severity: 'success' });
            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('게임 생성 오류:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || '게임 생성 중 오류가 발생했습니다',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const InputField = ({ name, label, type = 'text', ...props }) => (
        <div>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
                name={name}
                type={type}
                value={formValues[name]}
                onChange={handleInputChange}
                className={`w-full bg-dark border rounded px-3 py-2 text-white outline-none focus:border-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-600'}`}
                {...props}
            />
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    const SelectField = ({ name, label, children, disabled: dis }) => (
        <div>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <select
                name={name}
                value={formValues[name]}
                onChange={handleInputChange}
                disabled={dis}
                className={`w-full bg-dark border rounded px-3 py-2 text-white outline-none focus:border-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-600'}`}
            >
                <option value="">선택해주세요</option>
                {children}
            </select>
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-[1300]" onClick={onClose} />

            {/* Dialog */}
            <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
                <div className="bg-dark-paper rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    {/* Title */}
                    <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                        <span className="font-bold text-lg">새 게임 만들기</span>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 space-y-4">
                            <InputField name="game_title" label="게임 제목" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectField name="game_category" label="카테고리">
                                    {categories.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </SelectField>
                                <InputField name="game_date" label="게임 날짜" type="date" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField name="game_start_time" label="시작 시간" type="time" />
                                <InputField name="game_end_time" label="종료 시간" type="time" />
                            </div>

                            <InputField name="game_location" label="장소" />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField name="game_round" label="라운드" type="number" min={1} />
                                <SelectField name="team_seq_a" label="팀 A" disabled={teamsLoading}>
                                    {teamsLoading ? (
                                        <option disabled>팀 목록을 불러오는 중...</option>
                                    ) : teamsError ? (
                                        <option disabled>팀 목록을 불러오지 못했습니다</option>
                                    ) : teams.length === 0 ? (
                                        <option disabled>사용 가능한 팀이 없습니다</option>
                                    ) : (
                                        teams.map(team => (
                                            <option key={team.seq} value={team.seq}>{team.team_name}</option>
                                        ))
                                    )}
                                </SelectField>
                                <SelectField name="team_seq_b" label="팀 B" disabled={teamsLoading}>
                                    {teamsLoading ? (
                                        <option disabled>팀 목록을 불러오는 중...</option>
                                    ) : teamsError ? (
                                        <option disabled>팀 목록을 불러오지 못했습니다</option>
                                    ) : teams.length === 0 ? (
                                        <option disabled>사용 가능한 팀이 없습니다</option>
                                    ) : (
                                        teams.map(team => (
                                            <option key={team.seq} value={team.seq}>{team.team_name}</option>
                                        ))
                                    )}
                                </SelectField>
                            </div>
                        </div>

                        <div className="px-6 py-4 flex justify-end gap-2 border-t border-gray-700">
                            <button type="button" onClick={onClose} disabled={loading}
                                className="px-4 py-2 text-gray-300 hover:bg-dark-hover rounded transition-colors">
                                취소
                            </button>
                            <button type="submit" disabled={loading || teamsLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50">
                                {loading && <Spinner className="h-5 w-5 text-white" />}
                                {loading ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Snackbar */}
            {snackbar.open && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
                    <div className={`${snackbar.severity === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[280px]`}>
                        <span className="flex-1">{snackbar.message}</span>
                        <button onClick={() => setSnackbar({ ...snackbar, open: false })} className="text-white/80 hover:text-white ml-2 text-lg leading-none">&times;</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateGameModal;
