import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getGameList } from "../../../api/gameApi";
import CreateGameModal from "./CreateGameModal";
import { useAuth } from "../../auth/contexts/AuthProvider";
import Spinner from '../../../shared/components/Spinner';

const Championship = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [divisionValue, setDivisionValue] = useState('여성부');
    const [roundValue, setRoundValue] = useState('전체');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGameList();
            if (data.data) {
                data.data.forEach((game, index) => {
                    console.group(`게임 ${index + 1}: ${game.game_title}`);
                    console.log('생성일:', new Date(game.created_at).toLocaleString());
                    console.log('게임 날짜:', game.game_date);
                    console.log('시작/종료 시간:', `${game.game_start_time} ~ ${game.game_end_time}`);
                    console.log('장소:', game.game_location);
                    console.log('팀 정보:', `팀A(${game.team_seq_a}) vs 팀B(${game.team_seq_b})`);
                    console.groupEnd();
                });
                setGames(data.data);
            } else if (data.matches) {
                // Fallback mock data
                setGames(data.matches);
            } else {
                setGames([]);
            }
        } catch (err) {
            console.error('게임 데이터 로드 실패:', err);
            setError('게임 목록을 불러오는 데 실패했습니다. 문제가 지속될 시 다시 로그인 해주세요.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/', { replace: true });
            return;
        }
        fetchGames();
    }, [divisionValue, roundValue, isAuthenticated, navigate]);

    const handleNavigate = (gameId) => navigate(`/matches/${gameId}`);

    const formatGameTime = (game) => {
        if (game.time) return game.time; // mock data format
        const startTime = game.game_start_time
            ? (typeof game.game_start_time === 'string' && game.game_start_time.includes('T')
                ? game.game_start_time.split('T')[1].substring(0, 5)
                : game.game_start_time)
            : '시작시간 미정';
        const endTime = game.game_end_time
            ? (typeof game.game_end_time === 'string' && game.game_end_time.includes('T')
                ? game.game_end_time.split('T')[1].substring(0, 5)
                : game.game_end_time)
            : '종료시간 미정';
        return `${startTime} ~ ${endTime}`;
    };

    const groupGamesByLocation = (games) => {
        const grouped = {};
        games.forEach(game => {
            const location = game.game_location || '장소 미정';
            if (!grouped[location]) grouped[location] = [];
            grouped[location].push(game);
        });
        return grouped;
    };

    const filteredGames = roundValue === "전체"
        ? games
        : games.filter(game => String(game.game_round) === roundValue);

    const groupedGames = groupGamesByLocation(filteredGames);

    return (
        <div className="max-w-[1100px] mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold"></h1>
                </div>
                {isAuthenticated && (
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#90caf9] text-black rounded hover:bg-[#64b5f6] transition-colors flex-1 md:flex-[0.2]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        새 게임 만들기
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="w-full mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    {/* Filter selects */}
                    <div className="md:col-span-8 grid grid-cols-2 gap-2">
                        <select
                            value={divisionValue}
                            onChange={(e) => setDivisionValue(e.target.value)}
                            className="bg-[#333] text-white rounded px-3 py-2 outline-none"
                        >
                            <option value="여성부">여성부</option>
                            <option value="남성부">남성부</option>
                            <option value="혼성부">혼성부</option>
                        </select>
                        <select
                            value={roundValue}
                            onChange={(e) => setRoundValue(e.target.value)}
                            className="bg-[#333] text-white rounded px-3 py-2 outline-none"
                        >
                            <option value="전체">전체 라운드</option>
                            <option value="1">1라운드</option>
                            <option value="2">2라운드</option>
                        </select>
                    </div>
                    {/* Buttons */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-2">
                        <button className="bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition-colors">
                            경기 기록
                        </button>
                        <button className="bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition-colors">
                            중계 시청
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center my-8">
                    <Spinner />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="my-4 p-3 bg-red-900/30 text-red-300 rounded">{error}</div>
            )}

            {/* Game list */}
            {!loading && !error && (
                <>
                    {Object.keys(groupedGames).length === 0 ? (
                        <div className="my-4 p-3 bg-blue-900/30 text-blue-300 rounded">
                            표시할 경기가 없습니다.
                        </div>
                    ) : (
                        Object.entries(groupedGames).map(([location, locationGames]) => (
                            <div key={location} className="mb-6">
                                {locationGames.map((game, index) => (
                                    <React.Fragment key={game.seq || game.idx || index}>
                                        <div className="mb-4">
                                            <div className="flex items-center mb-1">
                                                <span className="font-bold text-base text-white">
                                                    {formatGameTime(game)}
                                                </span>
                                                <span className="ml-3 bg-pink-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-sm">
                                                    {game.game_round || '1'} ROUND
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-400">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {location}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-8">
                                                <div className="bg-[#1a1a1a] p-4 rounded flex items-center justify-between mb-2">
                                                    <span className="text-white font-bold text-lg px-3">{game.team_name || game.teamA?.name || 'A팀'}</span>
                                                    <img
                                                        src={game.teamALogo || game.teamA?.logo || "/img/basketball.jpg"}
                                                        alt="팀 A"
                                                        className="w-8 h-8 object-cover"
                                                    />
                                                    <span className="text-gray-500 font-bold text-base mx-4">VS</span>
                                                    <img
                                                        src={game.teamBLogo || game.teamB?.logo || "/img/basketball.jpg"}
                                                        alt="팀 B"
                                                        className="w-8 h-8 object-cover"
                                                    />
                                                    <span className="text-white font-bold text-lg px-3">{game.team_name || game.teamB?.name || 'B팀'}</span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-4 flex items-center">
                                                <div className="flex w-full gap-2 flex-wrap sm:flex-nowrap mt-4 sm:mt-0">
                                                    <button className="flex-1 min-w-[110px] py-2 border border-white text-white rounded hover:bg-[#333] transition-colors">
                                                        기록보기
                                                    </button>
                                                    <button
                                                        onClick={() => handleNavigate(game.seq || game.idx)}
                                                        className="flex-1 min-w-[110px] py-2 border border-white text-white rounded hover:bg-[#333] transition-colors"
                                                    >
                                                        자막 설정
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {index < locationGames.length - 1 && (
                                            <hr className="border-[#333] my-6" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))
                    )}
                </>
            )}

            <CreateGameModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={() => fetchGames()}
            />
        </div>
    );
};

export default Championship;
