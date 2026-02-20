export const TEMPLATES = [
    {
        id: 'scoreboard',
        name: '스코어보드',
        description: '팀 이름, 점수, 배경이 포함된 기본 스코어보드',
        resources: [
            {
                type: 'shape', name: '배경',
                x: 300, y: 20, width: 680, height: 80,
                shapeType: 'rect', fill: 'rgba(0,0,0,0.75)', stroke: 'transparent', strokeWidth: 0, borderRadius: 8,
                opacity: 0.9,
            },
            {
                type: 'shape', name: '구분선',
                x: 630, y: 30, width: 4, height: 60,
                shapeType: 'rect', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 2,
                opacity: 0.6,
            },
            {
                type: 'text', name: '홈 팀',
                x: 320, y: 35, width: 200, height: 50,
                text: 'HOME', fontFamily: 'Pretendard', fontSize: 28, color: '#ffffff', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '원정 팀',
                x: 660, y: 35, width: 200, height: 50,
                text: 'AWAY', fontFamily: 'Pretendard', fontSize: 28, color: '#ffffff', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '홈 점수',
                x: 570, y: 30, width: 50, height: 50,
                text: '0', fontFamily: 'Pretendard', fontSize: 36, color: '#facc15', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '원정 점수',
                x: 645, y: 30, width: 50, height: 50,
                text: '0', fontFamily: 'Pretendard', fontSize: 36, color: '#facc15', textStyles: ['bold'],
                opacity: 1,
            },
        ],
    },
    {
        id: 'lineup',
        name: '라인업',
        description: '팀 라인업 표시용 세로 목록',
        resources: [
            {
                type: 'shape', name: '배경',
                x: 40, y: 100, width: 260, height: 400,
                shapeType: 'rect', fill: 'rgba(0,0,0,0.7)', stroke: '#3b82f6', strokeWidth: 2, borderRadius: 12,
                opacity: 0.9,
            },
            {
                type: 'text', name: '타이틀',
                x: 60, y: 115, width: 220, height: 40,
                text: 'STARTING LINEUP', fontFamily: 'Pretendard', fontSize: 22, color: '#3b82f6', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '선수 1',
                x: 60, y: 170, width: 220, height: 36,
                text: '1. Player Name', fontFamily: 'Pretendard', fontSize: 18, color: '#ffffff', textStyles: [],
                opacity: 1,
            },
            {
                type: 'text', name: '선수 2',
                x: 60, y: 215, width: 220, height: 36,
                text: '2. Player Name', fontFamily: 'Pretendard', fontSize: 18, color: '#ffffff', textStyles: [],
                opacity: 1,
            },
            {
                type: 'text', name: '선수 3',
                x: 60, y: 260, width: 220, height: 36,
                text: '3. Player Name', fontFamily: 'Pretendard', fontSize: 18, color: '#ffffff', textStyles: [],
                opacity: 1,
            },
            {
                type: 'text', name: '선수 4',
                x: 60, y: 305, width: 220, height: 36,
                text: '4. Player Name', fontFamily: 'Pretendard', fontSize: 18, color: '#ffffff', textStyles: [],
                opacity: 1,
            },
            {
                type: 'text', name: '선수 5',
                x: 60, y: 350, width: 220, height: 36,
                text: '5. Player Name', fontFamily: 'Pretendard', fontSize: 18, color: '#ffffff', textStyles: [],
                opacity: 1,
            },
        ],
    },
    {
        id: 'lower-third',
        name: '하단 자막',
        description: '이름과 직책을 표시하는 하단 자막 바',
        resources: [
            {
                type: 'shape', name: '배경',
                x: 60, y: 560, width: 400, height: 90,
                shapeType: 'rect', fill: 'rgba(0,0,0,0.8)', stroke: 'transparent', strokeWidth: 0, borderRadius: 4,
                opacity: 0.95,
            },
            {
                type: 'shape', name: '액센트 바',
                x: 60, y: 560, width: 5, height: 90,
                shapeType: 'rect', fill: '#3b82f6', stroke: 'transparent', strokeWidth: 0, borderRadius: 0,
                opacity: 1,
            },
            {
                type: 'text', name: '이름',
                x: 80, y: 570, width: 360, height: 40,
                text: '홍길동', fontFamily: 'Pretendard', fontSize: 28, color: '#ffffff', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '직책',
                x: 80, y: 610, width: 360, height: 30,
                text: '해설위원', fontFamily: 'Pretendard', fontSize: 18, color: '#9ca3af', textStyles: [],
                opacity: 1,
            },
        ],
    },
    {
        id: 'product-card',
        name: '상품 카드',
        description: '상품 정보 표시용 카드 레이아웃',
        resources: [
            {
                type: 'shape', name: '카드 배경',
                x: 800, y: 300, width: 300, height: 200,
                shapeType: 'rect', fill: 'rgba(30,30,30,0.9)', stroke: '#6b7280', strokeWidth: 1, borderRadius: 12,
                opacity: 0.95,
            },
            {
                type: 'text', name: '상품명',
                x: 820, y: 320, width: 260, height: 36,
                text: '상품 이름', fontFamily: 'Pretendard', fontSize: 24, color: '#ffffff', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '가격',
                x: 820, y: 365, width: 260, height: 32,
                text: '₩29,900', fontFamily: 'Pretendard', fontSize: 22, color: '#facc15', textStyles: ['bold'],
                opacity: 1,
            },
            {
                type: 'text', name: '설명',
                x: 820, y: 410, width: 260, height: 60,
                text: '상품에 대한 간단한 설명을 입력하세요.', fontFamily: 'Pretendard', fontSize: 14, color: '#9ca3af', textStyles: [],
                opacity: 0.9,
            },
        ],
    },
];
