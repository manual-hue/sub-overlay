const matches = [
    {
        idx: '1',
        time: '14:00~',
        teamA: { name: 'TEAM CHUNCEON', logo: '/img/logo1.png' },
        teamB: { name: 'TEAM SEOUL', logo: '/img/logo2.png' },
        resources: [
            { uid: 1, filename: '팀 로고', src: '/img/logo1.png', x: 20, y: 20, width: 100, height: 100 },
            { uid: 2, filename: '스코어보드', src: '/img/logo2.png', x: 200, y: 20, width: 300, height: 80 },
            { uid: 3, filename: '선수 정보', src: '/img/basketball.jpg', x: 20, y: 150, width: 200, height: 150 },
        ]
    },
    {
        idx: '2',
        time: '16:00~',
        teamA: { name: 'TEAM CHUNCEON', logo: '/img/logo1.png' },
        teamB: { name: 'TEAM SEOUL', logo: '/img/logo2.png' },
    },
    {
        idx: '4',
        time: '18:00~',
        teamA: { name: 'TEAM CHUNCEON', logo: '/img/logo1.png' },
        teamB: { name: 'TEAM SEOUL', logo: '/img/logo2.png' },
    },
]


const matchesDataList = {
    matches,
};

export default matchesDataList;