// Game Data

const PERSONAS = {
    Power_E: {
        id: 'Power_E',
        name: '핵인싸 (Power E)',
        desc: '리액션, 활기참, 주도적',
        traits: ['E', 'Active']
    },
    Shy_I: {
        id: 'Shy_I',
        name: '섬세한 감성 (Shy I)',
        desc: '배려, 조용함, 서서히 스며듦',
        traits: ['I', 'Quiet']
    },
    Cool_T: {
        id: 'Cool_T',
        name: '효율 팩폭러 (Cool T)',
        desc: '논리적, 시간 준수, 깔끔함',
        traits: ['T', 'Logic']
    }
};

const ENDINGS = {
    PERFECT: {
        minScore: 12, // Max 14
        label: '❤️ Perfect Love',
        class: 'result-perfect'
    },
    FRIEND: {
        minScore: 7,
        label: '🙂 Friend Zone',
        class: 'result-friend'
    },
    STRANGER: {
        minScore: 0,
        label: '🥶 Stranger',
        class: 'result-stranger'
    }
};

// ... (RESULT_MESSAGES remains same)

const SCENARIOS = [
    {
        id: 1,
        situation: "약속 시간 10분 전 도착.\n기다리는 동안 나는?",
        options: [
            {
                text: "A. 상대방의 SNS를 염탐하며 취향을 분석한다.", // Logic/Active
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "PASS" }
            },
            {
                text: "B. 창밖을 보며 차분히 마음을 가라앉힌다.", // Calm/Vibe
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "FAIL" }
            }
        ]
    },
    {
        id: 2,
        situation: "상대방이 5분 늦게 도착하며 미안해한다.",
        options: [
            {
                text: "A. \"괜찮아요! 오시느라 고생하셨죠?\"", // Emotion/Empathy
                target_logic: { Power_E: "PASS", Shy_I: "PASS", Cool_T: "FAIL" }
            },
            {
                text: "B. \"다음부턴 시간 좀 지켜주세요. 배고프네요.\"", // Fact/Direct
                target_logic: { Power_E: "FAIL", Shy_I: "FAIL", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 3,
        situation: "메뉴판을 보는데 결정하기 어려워 보인다.",
        options: [
            {
                text: "A. \"여기서 제일 매운 '지옥 파스타' 도전해볼까요?\"", // Fun/Challenge
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "FAIL" }
            },
            {
                text: "B. \"호불호 없는 베스트 메뉴로 시키죠.\"", // Safe/Efficient
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 4,
        situation: "음식이 나왔다. 먹기 전에!",
        options: [
            {
                text: "A. \"잠시만요! 인증샷 찍어야 돼요!\" (찰칵)", // Trends/Show
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "FAIL" }
            },
            {
                text: "B. \"잘 먹겠습니다!\" 하고 바로 수저를 든다.", // Practical
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 5,
        situation: "대화 중 침묵이 흘렀다... 어떤 주제를 꺼낼까?",
        options: [
            {
                text: "A. \"혹시 취미가 뭐예요? 주말에 뭐 하세요?\"", // Private/Casual
                target_logic: { Power_E: "PASS", Shy_I: "PASS", Cool_T: "FAIL" }
            },
            {
                text: "B. \"요즘 경제 뉴스가 화제던데 어떻게 생각하세요?\"", // Intellectual/Serious
                target_logic: { Power_E: "FAIL", Shy_I: "FAIL", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 6,
        situation: "상대방의 이에 고추가루가 끼었다...",
        options: [
            {
                text: "A. (돌려서 말한다) \"오늘 물이 참 시원하네요~\"", // Indirect/Hint
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "FAIL" }
            },
            {
                text: "B. \"이에 고추가루 끼셨어요. 거울 보세요.\"", // Direct/Fact
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 7,
        situation: "계산 할 때가 되었다. 5만원이 나왔다.",
        options: [
            {
                text: "A. \"제가 살게요! 다음엔 그쪽이 사세요.\"", // Cool/Relationship
                target_logic: { Power_E: "PASS", Shy_I: "PASS", Cool_T: "FAIL" }
            },
            {
                text: "B. \"정확히 2만 5천원씩 보내주시면 됩니다.\"", // Rational/Dutch
                target_logic: { Power_E: "FAIL", Shy_I: "FAIL", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 8,
        situation: "헤어지는 길, 분위기가 나쁘지 않다.",
        options: [
            {
                text: "A. \"집에 가기 아쉬운데 맥주 한 잔 더 할까요?\"", // Emotional/Extend
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "FAIL" }
            },
            {
                text: "B. \"오늘 즐거웠습니다. 조심히 들어가세요.\"", // Clean ending
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 9,
        situation: "버스킹 공연을 발견했다. 잠시 보고 갈까?",
        options: [
            {
                text: "A. \"와 음악 좋다! 우리도 같이 리듬 타요!\"", // Fun/Active
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "FAIL" } // I: Crowded. T: Waste of time/Noisy.
            },
            {
                text: "B. \"사람 너무 많네요. 그냥 지나갑시다.\"", // Quiet/Efficient
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "PASS" }
            }
        ]
    },
    {
        id: 10,
        situation: "길에서 우연히 전 애인과 마주쳤다!",
        options: [
            {
                text: "A. (쿨하게 인사) \"어 안녕? 여기 내 애인이야.\"", // Bold/Relationship
                target_logic: { Power_E: "PASS", Shy_I: "FAIL", Cool_T: "FAIL" } // E: Likes confidence. I: Awkward. T: Unnecessary drama.
            },
            {
                text: "B. (모른 척 지나간다) \"...누구세요?\"", // Avoid/Rational
                target_logic: { Power_E: "FAIL", Shy_I: "PASS", Cool_T: "PASS" } // I: Relief. T: Efficient.
            }
        ]
    }
];
