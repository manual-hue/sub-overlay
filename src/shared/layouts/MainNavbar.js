import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../features/auth/contexts/AuthProvider";

const NAV_TABS = [
    { label: '홈', path: '/' },
    { label: '대회', path: '/matches/main' },
    { label: '기록', path: '/record' },
    { label: '소식', path: '/news' },
    { label: '중계', path: '/relay' },
];

const MainNavbar = () => {
    const { user, isAuthenticated, logout, initiateKakaoLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [tabValue, setTabValue] = useState(0);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/' || path === '') setTabValue(0);
        else if (path.startsWith('/matches/main')) setTabValue(1);
        else if (path.startsWith('/record')) setTabValue(2);
        else if (path.startsWith('/news')) setTabValue(3);
        else if (path.startsWith('/relay')) setTabValue(4);
        else setTabValue(-1);
    }, [location.pathname]);

    const handleTabClick = (index) => {
        setTabValue(index);
        navigate(NAV_TABS[index].path);
    };

    const handleLogout = async () => {
        await logout();
        setProfileMenuOpen(false);
        navigate('/');
    };

    const handleDrawerItemClick = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <>
            {/* AppBar */}
            <nav className="fixed top-0 left-0 right-0 bg-[#111] shadow-sm text-white z-50">
                <div className="max-w-[1536px] mx-auto">
                    <div className="flex items-center justify-between px-2 sm:px-4 h-16">
                        {/* Mobile menu icon */}
                        <button
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded mr-1"
                            onClick={() => setDrawerOpen(!drawerOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="no-underline text-white font-bold text-xl flex-shrink-0">
                            OPEN CG
                        </Link>

                        {/* Desktop nav tabs */}
                        <div className="hidden md:flex items-center mx-4 flex-1 justify-center gap-1">
                            {NAV_TABS.map((tab, i) => (
                                <button
                                    key={tab.path}
                                    onClick={() => handleTabClick(i)}
                                    className={`px-4 py-2 text-sm font-normal transition-colors border-b-[3px] ${
                                        tabValue === i
                                            ? 'text-white border-white font-medium'
                                            : 'text-white/70 border-transparent hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Right section */}
                        <div className="flex items-center gap-1">
                            {/* Search (small screens: icon only) */}
                            <button
                                className="sm:hidden p-2 text-white hover:bg-white/10 rounded"
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Search (desktop) */}
                            <div className="hidden sm:block relative ml-3">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="검색"
                                    className="bg-white/15 hover:bg-white/25 text-white placeholder-white/60 pl-10 pr-3 py-2 rounded text-sm outline-none w-32 md:w-48 focus:w-56 transition-all"
                                />
                            </div>

                            {/* Notification icon (hide on small) */}
                            <button className="hidden sm:block p-2 text-white hover:bg-white/10 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Profile button (desktop) */}
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="p-2 text-white hover:bg-white/10 rounded"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>

                                {/* Profile dropdown */}
                                {profileMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-64 bg-dark-paper rounded-lg shadow-xl z-50 py-2">
                                            {isAuthenticated ? (
                                                <div className="p-4 text-center">
                                                    {user?.data?.profile_image ? (
                                                        <img src={user.data.profile_image} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-gray-600 flex items-center justify-center text-xl">
                                                            {user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <p className="font-bold">{user?.data?.name || '사용자'} 님</p>
                                                    <p className="text-sm text-gray-400">{user?.data?.email || ''}</p>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="mt-3 px-4 py-1.5 border border-red-500 text-red-500 rounded text-sm hover:bg-red-500/10"
                                                    >
                                                        로그아웃
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center">
                                                    <p className="mb-3">로그인하세요.</p>
                                                    <button
                                                        onClick={initiateKakaoLogin}
                                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                                                    >
                                                        로그인
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    {mobileSearchOpen && (
                        <div className="sm:hidden p-2 bg-white/10">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="검색"
                                    className="w-full bg-white/15 text-white placeholder-white/60 pl-10 pr-3 py-2 rounded text-sm outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile drawer */}
            {drawerOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDrawerOpen(false)} />
                    <div className="fixed top-0 left-0 w-[300px] h-full bg-dark-paper z-[51] overflow-y-auto">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between p-4 h-16">
                            <Link to="/" className="text-white font-bold text-xl no-underline" onClick={() => setDrawerOpen(false)}>
                                OPEN CG
                            </Link>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 text-white hover:bg-white/10 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User section */}
                        {isAuthenticated ? (
                            <div className="flex flex-col items-center py-4 px-4">
                                {user?.data?.profile_image ? (
                                    <img src={user.data.profile_image} alt={user?.data?.name} className="w-16 h-16 rounded-full mb-2 object-cover" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full mb-2 bg-gray-600 flex items-center justify-center text-xl">U</div>
                                )}
                                <p className="font-bold">{user?.data?.name || user?.name || '사용자'}</p>
                                <p className="text-sm text-gray-400 mb-2">{user?.data?.email || user?.email || ''}</p>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-1.5 border border-blue-400 text-blue-400 rounded text-sm hover:bg-blue-400/10"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={initiateKakaoLogin}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-white/5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>로그인</span>
                            </button>
                        )}

                        <hr className="border-gray-700 my-2" />

                        {/* Nav items */}
                        <nav className="py-2">
                            {[
                                { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: '홈', path: '/' },
                                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: '대회', path: '/matches/main' },
                                { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: '기록', path: '/record' },
                                { icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', label: '소식', path: '/news' },
                                { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: '중계', path: '/relay' },
                            ].map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleDrawerItemClick(item.path)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-white/5"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </>
            )}

            {/* Toolbar spacer */}
            <div className="h-16" />
            {mobileSearchOpen && <div className="sm:hidden h-12" />}
        </>
    );
};

export default MainNavbar;
