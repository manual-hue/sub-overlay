import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import gameService from "../../../service/gameService";

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
        game_title: '',
        game_category: '',
        game_date: today,
        game_start_time: '',
        game_end_time: '',
        game_location: '',
        game_round: 1,
        team_seq_a: '',
        team_seq_b: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // 팀 목록 상태 관리
    const [teams, setTeams] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const [teamsError, setTeamsError] = useState(null);

    // 팀 목록 가져오기
    useEffect(() => {
        const fetchTeams = async () => {
            if (!open) return;

            setTeamsLoading(true);
            setTeamsError(null);

            try {
                const response = await gameService.getTeamList();

                let teamsList = [];

                if (response && Array.isArray(response)) {
                    teamsList = response;
                } else if (response && response.data && Array.isArray(response.data)) {
                    teamsList = response.data;
                } else {
                    console.warn('팀 데이터 형식 오류:', response);
                }

                console.table(teamsList)
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

        // 팀 선택 시 숫자형으로 변환
        const parsedValue =
            (name === 'team_seq_a' || name === 'team_seq_b')
                ? (value === '' ? '' : Number(value))
                : value;

        setFormValues({
            ...formValues,
            [name]: parsedValue
        });

        setErrors({
            ...errors,
            [name]: undefined
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formValues.game_title) {
            newErrors.game_title = '게임 제목을 입력해주세요.';
        }

        if (!formValues.game_category) {
            newErrors.game_category = '카테고리를 선택해주세요.';
        }

        if (!formValues.game_date) {
            newErrors.game_date = '날짜를 선택해주세요.';
        }

        if (!formValues.game_start_time) {
            newErrors.game_start_time = '시작 시간을 선택해주세요.';
        }

        if (!formValues.game_end_time) {
            newErrors.game_end_time = '종료 시간을 선택해주세요.';
        }

        if (!formValues.game_location) {
            newErrors.game_location = '장소를 입력해주세요.';
        }

        if (!formValues.game_round || formValues.game_round < 1) {
            newErrors.game_round = '라운드는 1 이상이어야 합니다';
        }

        if (!formValues.team_seq_a) {
            newErrors.team_seq_a = '팀 A를 선택해주세요.';
        }

        if (!formValues.team_seq_b) {
            newErrors.team_seq_b = '팀 B를 선택해주세요.';
        }

        if (formValues.team_seq_a && formValues.team_seq_b && formValues.team_seq_a === formValues.team_seq_b) {
            newErrors.team_seq_b = '팀 A와 팀 B는 서로 다른 팀이어야 합니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormValues({
            game_title: '',
            game_category: '',
            game_date: '',
            game_start_time: '',
            game_end_time: '',
            game_location: '',
            game_round: 1,
            team_seq_a: '',
            team_seq_b: ''
        });
        setErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // 전송할 데이터 형식 맞추기
            const gameDate = formValues.game_date;
            const gameStartTime = formValues.game_start_time;
            const gameEndTime = formValues.game_end_time;

            // LocalDateTime 형식으로 변환
            const submissionData = {
                ...formValues,
                game_date: gameDate ? `${gameDate}T00:00:00` : '',
                game_start_time: gameStartTime ? `${gameDate}T${gameStartTime}:00` : '',
                game_end_time: gameEndTime ? `${gameDate}T${gameEndTime}:00` : ''
            };
            await gameService.createGame(submissionData);

            setSnackbar({
                open: true,
                message: '게임이 성공적으로 생성되었습니다',
                severity: 'success'
            });

            resetForm();

            if (onSuccess) {
                onSuccess();
            }

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

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    pb: 2
                }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>새 게임 만들기</Box>
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ py: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="game_title"
                                    label="게임 제목"
                                    value={formValues.game_title}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!errors.game_title}
                                    helperText={errors.game_title}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.game_category}>
                                    <InputLabel id="category-label">카테고리</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="game_category"
                                        value={formValues.game_category}
                                        onChange={handleInputChange}
                                        label="카테고리"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.value} value={category.value}>
                                                {category.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.game_category && <FormHelperText>{errors.game_category}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="game_date"
                                    label="게임 날짜"
                                    type="date"
                                    value={formValues.game_date}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!errors.game_date}
                                    helperText={errors.game_date}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="game_start_time"
                                    label="시작 시간"
                                    type="time"
                                    value={formValues.game_start_time}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!errors.game_start_time}
                                    helperText={errors.game_start_time}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="game_end_time"
                                    label="종료 시간"
                                    type="time"
                                    value={formValues.game_end_time}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!errors.game_end_time}
                                    helperText={errors.game_end_time}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="game_location"
                                    label="장소"
                                    value={formValues.game_location}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!errors.game_location}
                                    helperText={errors.game_location}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="game_round"
                                    label="라운드"
                                    type="number"
                                    value={formValues.game_round}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{ inputProps: { min: 1 } }}
                                    error={!!errors.game_round}
                                    helperText={errors.game_round}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.team_seq_a} disabled={teamsLoading}>
                                    <InputLabel id="team-a-label">팀 A</InputLabel>
                                    <Select
                                        labelId="team-a-label"
                                        name="team_seq_a"
                                        value={formValues.team_seq_a}
                                        onChange={handleInputChange}
                                        label="팀 A"
                                    >
                                        {teamsLoading ? (
                                            <MenuItem disabled>팀 목록을 불러오는 중...</MenuItem>
                                        ) : teamsError ? (
                                            <MenuItem disabled>팀 목록을 불러오지 못했습니다</MenuItem>
                                        ) : teams.length === 0 ? (
                                            <MenuItem disabled>사용 가능한 팀이 없습니다</MenuItem>
                                        ) : (
                                            teams.map((team) => (
                                                <MenuItem
                                                    key={team.seq}
                                                    value={team.seq}
                                                >
                                                    {team.team_name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.team_seq_a && <FormHelperText>{errors.team_seq_a}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.team_seq_b} disabled={teamsLoading}>
                                    <InputLabel id="team-b-label">팀 B</InputLabel>
                                    <Select
                                        labelId="team-b-label"
                                        name="team_seq_b"
                                        value={formValues.team_seq_b}
                                        onChange={handleInputChange}
                                        label="팀 B"
                                    >
                                        {teamsLoading ? (
                                            <MenuItem disabled>팀 목록을 불러오는 중...</MenuItem>
                                        ) : teamsError ? (
                                            <MenuItem disabled>팀 목록을 불러오지 못했습니다</MenuItem>
                                        ) : teams.length === 0 ? (
                                            <MenuItem disabled>사용 가능한 팀이 없습니다</MenuItem>
                                        ) : (
                                            teams.map((team) => (
                                                <MenuItem
                                                    key={team.seq}
                                                    value={team.seq}
                                                >
                                                    {team.team_name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.team_seq_b && <FormHelperText>{errors.team_seq_b}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Button onClick={onClose} color="inherit" disabled={loading}>
                            취소
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={loading || teamsLoading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? '저장 중...' : '저장'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateGameModal;