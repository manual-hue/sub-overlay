import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    Select,
    MenuItem,
    Grid, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import gameService from "../../../service/gameService";
import CreateGameModal from "./CreateGameModal";
import { useAuth } from "../../../contexts/AuthProvider";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const GameSection = styled(Box)(({ theme }) => ({
    marginBottom: '24px',
}));

const TeamBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#1a1a1a',
    padding: '16px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
}));

const TeamInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
}));

const TeamNumber = styled(Typography)(({ theme }) => ({
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '0 12px',
}));

const TeamLogo = styled(Box)(({ theme }) => ({
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const VSLabel = styled(Typography)(({ theme }) => ({
    color: '#777',
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 16px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    color: 'white',
    border: '1px solid #fff',
    borderRadius: '4px',
    padding: '8px 16px',
    margin: '0 4px',
    '&:hover': {
        backgroundColor: '#333',
    },
    flex: 1,
    minWidth: '110px',
    [theme.breakpoints.down('sm')]: {
        marginTop: '8px',
        width: 'calc(50% - 8px)', // 버튼 사이 간격 고려
    },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: '16px',
    },
}));

const MainContainer = styled(Box)(({ theme }) => ({
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '24px',
}));


const Championship = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [divisionValue, setDivisionValue] = useState('여성부');
    const [roundValue, setRoundValue] = useState('전체');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    // 게임 데이터 로드
    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await gameService.getGameList();
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

    const handleNavigate = (gameId) => {
        navigate(`/matches/${gameId}`);
    };

    const handleDivisionChange = (event) => {
        setDivisionValue(event.target.value);
    };

    const handleRoundChange = (event) => {
        setRoundValue(event.target.value);
    };

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const handleGameCreated = () => {
        fetchGames();
    };

    // 시간 포맷팅 함수
    const formatGameTime = (game) => {
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


    // 게임 항목들을 장소별로 그룹화
    const groupGamesByLocation = (games) => {
        const grouped = {};

        games.forEach(game => {
            const location = game.game_location || '장소 미정';
            if (!grouped[location]) {
                grouped[location] = [];
            }
            grouped[location].push(game);
        });

        return grouped;
    };

    const filteredGames = roundValue === "전체"
        ? games
        : games.filter(game => String(game.game_round) === roundValue);

    const groupedGames = groupGamesByLocation(filteredGames);
    return (
        <MainContainer>
            {/* 헤더 영역 */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',  // 가로 배치 강제
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                width: '100%'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h1" sx={{
                        fontWeight: 'bold',
                        fontSize: '24px'
                    }}>

                    </Typography>
                </Box>

                {isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateModal}
                        sx={{
                            borderRadius: '4px',
                            bgcolor: '#90caf9',
                            color: 'black',
                            flex: { xs: 1, md: 0.2 },
                        }}
                    >
                        새 게임 만들기
                    </Button>
                )}
            </Box>

            {/* 필터 영역 */}
            <Box sx={{ width: '100%', mb: 8 }}>
                <Grid container spacing={2}>
                    {/* 필터 영역 - 왼쪽 */}
                    <Grid item xs={12} sm={6} md={8}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={divisionValue}
                                        onChange={handleDivisionChange}
                                        sx={{
                                            bgcolor: '#333',
                                            color: 'white',
                                            '& .MuiSelect-icon': {
                                                color: 'white',
                                            }
                                        }}
                                    >
                                        <MenuItem value="여성부">여성부</MenuItem>
                                        <MenuItem value="남성부">남성부</MenuItem>
                                        <MenuItem value="혼성부">혼성부</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={roundValue}
                                        onChange={handleRoundChange}
                                        placeholder="선택해주세요."
                                        sx={{
                                            bgcolor: '#333',
                                            color: 'white',
                                            '& .MuiSelect-icon': {
                                                color: 'white',
                                            }
                                        }}
                                    >
                                        <MenuItem value="전체">전체 라운드</MenuItem>
                                        <MenuItem value="1">1라운드</MenuItem>
                                        <MenuItem value="2">2라운드</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 버튼 영역 - 오른쪽 */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Grid container spacing={1} justifyContent="flex-end">
                            <Grid item xs={6} sm={6}>
                                <Button fullWidth variant="contained" sx={{
                                    fontWeight: '600',
                                    bgcolor: 'white',
                                    color: 'black',
                                    '&:hover': {
                                        bgcolor: '#e0e0e0',
                                    },
                                }}>
                                    경기 기록
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Button fullWidth variant="contained" sx={{
                                    fontWeight: '600',
                                    bgcolor: 'white',
                                    color: 'black',
                                    '&:hover': {
                                        bgcolor: '#e0e0e0',
                                    },
                                }}>
                                    중계 시청
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {/* 로딩 상태 표시 */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress color="primary" />
                </Box>
            )}

            {/* 에러 메시지 */}
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}

            {/* 경기 목록 - 장소별 그룹화 */}
            {!loading && !error && (
                <>
                    {Object.keys(groupedGames).length === 0 ? (
                        <Alert severity="info" sx={{ my: 2 }}>
                            표시할 경기가 없습니다.
                        </Alert>
                    ) : (
                        Object.entries(groupedGames).map(([location, locationGames]) => (
                            <GameSection key={location}>
                                {locationGames.map((game, index) => (
                                    <React.Fragment key={game.seq || index}>
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <Typography sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    color: 'white',
                                                }}>
                                                    {formatGameTime(game)}
                                                </Typography>

                                                {/*<Typography sx={{
                                                    fontSize: '16px',
                                                    color: 'white',
                                                }}>
                                                    {game.game_title || '경기명 미정'}
                                                </Typography>*/}

                                                <Chip
                                                    label={`${game.game_round || '1'} ROUND`}
                                                    sx={{
                                                        backgroundColor: '#e91e63',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '11px',
                                                        height: '22px',
                                                        ml: 1.5
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOnIcon sx={{ fontSize: 16, color: '#aaa', mr: 0.5 }} />
                                                <Typography sx={{
                                                    fontSize: '14px',
                                                    color: '#aaa',
                                                }}>
                                                    {location}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={2}>
                                            {/* 팀 정보 영역 - 8:4 비율 (md, lg) / 12 (xs) */}
                                            <Grid item xs={12} md={8}>
                                                <TeamBox>
                                                    <TeamInfo>
                                                        <TeamNumber>{game.team_name || 'A팀'}</TeamNumber>
                                                        <TeamLogo>
                                                            <Box
                                                                component="img"
                                                                src={game.teamALogo || "/img/basketball.jpg"}
                                                                alt="팀 A"
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        </TeamLogo>
                                                        <VSLabel>VS</VSLabel>
                                                        <TeamLogo>
                                                            <Box
                                                                component="img"
                                                                src={game.teamBLogo || "/img/basketball.jpg"}
                                                                alt="팀 B"
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        </TeamLogo>
                                                        <TeamNumber>{game.team_name || 'B팀'}</TeamNumber>
                                                    </TeamInfo>
                                                </TeamBox>
                                            </Grid>

                                            {/* 버튼 영역 - 8:4 비율 (md, lg) / 12 (xs) */}
                                            <Grid item xs={12} md={4} sx={{
                                                display: 'flex',
                                                alignItems: { xs: 'flex-start', md: 'center' }
                                            }}>
                                                <ButtonGroup sx={{ width: '100%' }}>
                                                    <ActionButton>
                                                        기록보기
                                                    </ActionButton>
                                                    <ActionButton
                                                        onClick={() => handleNavigate(game.seq)}
                                                    >
                                                        자막 설정
                                                    </ActionButton>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>

                                        {index < locationGames.length - 1 && (
                                            <Divider sx={{ bgcolor: '#333', my: 3 }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </GameSection>
                        ))
                    )}
                </>
            )}

            {/* 새 게임 생성 모달 */}
            <CreateGameModal
                open={openCreateModal}
                onClose={handleCloseCreateModal}
                onSuccess={handleGameCreated}
            />
        </MainContainer>
    );
};

export default Championship;