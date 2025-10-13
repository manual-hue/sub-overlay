import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    InputBase,
    Badge,
    Tabs,
    Tab,
    Drawer,
    List,
    ListItem,
    useMediaQuery,
    Button,
    Container
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PublicIcon from '@mui/icons-material/Public';
import {useAuth} from "../../contexts/AuthProvider";
import DvrIcon from '@mui/icons-material/Dvr';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    minHeight: '48px',
    '& .MuiTabs-indicator': {
        backgroundColor: '#ffffff',
        height: '3px',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    padding: '0 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: '#ffffff',
        fontWeight: theme.typography.fontWeightMedium,
    },
}));

// 로고 컴포넌트 (반응형으로 크기 조절)
const Logo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    color: 'inherit',
    [theme.breakpoints.down('sm')]: {
        '& .MuiTypography-h6': {
            fontSize: '1.25rem',
        },
        '& .MuiTypography-body1': {
            fontSize: '0.875rem',
        },
    },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

const MainNavbar = () => {
    const { user, isAuthenticated, logout, initiateKakaoLogin } = useAuth();
    const [authState, setAuthState] = useState(isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    // 반응형 미디어 쿼리
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    // 현재 경로에 따른 탭 값 설정
    const [tabValue, setTabValue] = useState(0);

    // 프로필 메뉴 상태
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // 모바일 드로어 상태
    const [drawerOpen, setDrawerOpen] = useState(false);

    // 모바일 검색 상태
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        setAuthState(isAuthenticated);

        // 현재 경로에 따라 탭 값 설정
        const path = location.pathname;

        if (path === '/' || path === '') {
            setTabValue(0);
        } else if (path.startsWith('/matches/main')) {
            setTabValue(1);
        } else if (path.startsWith('/record')) {
            setTabValue(2);
        } else if (path.startsWith('/news')) {
            setTabValue(3);
        } else if (path.startsWith('/relay')) {
            setTabValue(4);
        } else {
            setTabValue(false);
        }
    }, [isAuthenticated, user, location.pathname]);

    // 드로어 토글
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // 탭 변경 핸들러
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

        // 탭에 따른 경로 이동
        switch (newValue) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/matches/main');
                break;
            case 2:
                navigate('/record');
                break;
            case 3:
                navigate('/news');
                break;
            case 4:
                navigate('/relay');
                break;
            default:
                break;
        }
    };

    // 프로필 메뉴 열기
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // 프로필 메뉴 닫기
    const handleClose = () => {
        setAnchorEl(null);
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        await logout();
        handleClose();
        setAuthState(false);
        navigate('/');
    };

    // 모바일 메뉴 이동 핸들러
    const handleDrawerItemClick = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    // 모바일 검색창 토글
    const toggleMobileSearch = () => {
        setMobileSearchOpen(!mobileSearchOpen);
    };

    // 사이드 드로어 컨텐츠
    const drawerContent = (
        <>
            <DrawerHeader>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setDrawerOpen(false)}>
                    <Typography variant="h6" fontWeight="bold">
                        OPEN CG
                    </Typography>
                </Link>
                <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon />
                </IconButton>
            </DrawerHeader>
            {isAuthenticated ? (
                <List>
                    <ListItem>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', py: 2 }}>
                            <Avatar
                                src={user?.data?.profile_image}
                                alt={user?.data?.name}
                                sx={{ width: 64, height: 64, mb: 1 }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {user?.data?.name || user?.name || '사용자'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {user?.data?.email || user?.email || ''}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button variant="outlined" size="small" color="info" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            </Box>
                        </Box>
                    </ListItem>
                </List>
            ) : (
                <List>
                    <ListItem button onClick={initiateKakaoLogin}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="로그인" />
                    </ListItem>
                </List>
            )}
            <Divider />
            <List>
                <ListItem button onClick={() => handleDrawerItemClick('/')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="홈" />
                </ListItem>
                <ListItem button onClick={() => handleDrawerItemClick('/matches/main')}>
                    <ListItemIcon>
                        <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary="대회" />
                </ListItem>
                <ListItem button onClick={() => handleDrawerItemClick('/record')}>
                    <ListItemIcon>
                        <DvrIcon />
                    </ListItemIcon>
                    <ListItemText primary="기록" />
                </ListItem>
                <ListItem button onClick={() => handleDrawerItemClick('/news')}>
                    <ListItemIcon>
                        <NewspaperIcon />
                    </ListItemIcon>
                    <ListItemText primary="소식" />
                </ListItem>
                <ListItem button onClick={() => handleDrawerItemClick('/relay')}>
                    <ListItemIcon>
                        <PublicIcon />
                    </ListItemIcon>
                    <ListItemText primary="중계" />
                </ListItem>
            </List>
        </>
    );

    return (
        <>
            <AppBar position="fixed" sx={{
                backgroundColor: '#111',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                color: 'white',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}>
                <Container maxWidth="xl" disableGutters>
                    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
                        {/* 모바일 메뉴 아이콘 */}
                        {isMobile && (
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={() => setDrawerOpen(!drawerOpen)}
                                sx={{ mr: 1 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* 로고 */}
                        <Logo component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                            <Typography variant="h6" fontWeight="bold">
                                OPEN CG
                            </Typography>
                        </Logo>

                        {/* 데스크탑 메뉴: 네비게이션 탭 */}
                        {!isMobile && (
                            <StyledTabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="main navigation tabs"
                                sx={{ mx: 2, flexGrow: 1, justifyContent: 'center' }}
                            >
                                <StyledTab label="홈" />
                                <StyledTab label="대회" />
                                <StyledTab label="기록" />
                                <StyledTab label="소식" />
                                <StyledTab label="중계" />
                            </StyledTabs>
                        )}

                        {/* 오른쪽 섹션: 검색, 알림, 프로필 */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* 모바일에서는 검색 아이콘만 표시 */}
                            {isSmall ? (
                                <IconButton color="inherit" onClick={toggleMobileSearch}>
                                    <SearchIcon />
                                </IconButton>
                            ) : (
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="검색"
                                        inputProps={{ 'aria-label': '검색' }}
                                    />
                                </Search>
                            )}

                            {/* 알림 아이콘 */}
                            {!isSmall && (
                                <IconButton
                                    size="large"
                                    aria-label="알림"
                                    color="inherit"
                                >
                                    <Badge badgeContent={0} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            )}

                            {/* 사용자 프로필 (모바일에서는 숨김) */}
                            {!isMobile && (
                                <>
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 1 }}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        PaperProps={{
                                            sx: { width: 250, mt: 1.5, borderRadius: 2 }
                                        }}
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                                    <Avatar
                                                        src={user?.data?.profile_image}
                                                        sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}>
                                                        {user?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {user?.data.name || '사용자'} 님
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user?.data.email || ''}
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={handleLogout}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        로그아웃
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="subtitle1" mb={2}>로그인하세요.</Typography>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={initiateKakaoLogin}
                                                >
                                                    로그인
                                                </Button>
                                            </Box>
                                        )}
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </Toolbar>

                    {/* 모바일 검색 확장 UI */}
                    {isSmall && mobileSearchOpen && (
                        <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)' }}>
                            <Search sx={{ width: '100%', m: 0 }}>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="검색"
                                    inputProps={{ 'aria-label': '검색' }}
                                    sx={{ width: '100%' }}
                                />
                            </Search>
                        </Box>
                    )}
                </Container>
            </AppBar>

            {/* 모바일 사이드 드로어 */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* 툴바 공간 확보 */}
            <Toolbar />
            {isSmall && mobileSearchOpen && <Box sx={{ height: 48 }} />}
        </>
    );
};

export default MainNavbar;