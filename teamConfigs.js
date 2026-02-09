// ============================================================
// TEAM CONFIGURATIONS
// Multi-team support with separate URLs for men's and women's teams
// ============================================================

// Women's SG benchmarks (College Golfer benchmark with all data)
const WOMENS_BENCHMARKS = {
    'College Golfer (Women)': `0,0,0,0,0,0,0
1,,1.16,1.40,2.38,1.93,1.06
2,,1.41,1.51,2.39,2.08,1.08
3,,1.65,1.62,2.40,2.23,1.09
4,,1.79,1.73,2.41,2.38,1.18
5,,1.91,1.85,2.42,2.54,1.27
6,,1.98,1.95,2.43,2.68,1.36
7,,2.05,2.05,2.45,2.82,1.45
8,,2.11,2.15,2.46,2.95,1.54
9,,2.16,2.23,2.47,3.06,1.63
10,,2.19,2.29,2.48,3.14,1.67
11,,2.22,2.32,2.49,3.18,1.70
12,,2.24,2.36,2.51,3.22,1.74
13,,2.27,2.39,2.52,3.27,1.77
14,,2.29,2.42,2.53,3.31,1.80
15,,2.32,2.46,2.54,3.35,1.83
16,,2.35,2.49,2.55,3.39,1.85
17,,2.38,2.52,2.56,3.43,1.86
18,,2.40,2.56,2.57,3.48,1.88
19,,2.43,2.59,2.58,3.52,1.90
20,,2.46,2.62,2.59,3.56,1.92
21,,2.47,2.63,2.60,3.57,1.93
22,,2.48,2.64,2.62,3.58,1.94
23,,2.49,2.65,2.63,3.59,1.95
24,,2.50,2.67,2.65,3.61,1.96
25,,2.51,2.68,2.66,3.62,1.97
26,,2.52,2.69,2.68,3.63,1.98
27,,2.53,2.70,2.69,3.64,1.99
28,,2.54,2.71,2.71,3.66,2.01
29,,2.55,2.73,2.72,3.67,2.02
30,,2.56,2.74,2.74,3.68,2.03
31,,2.57,2.75,2.76,3.69,2.03
32,,2.58,2.76,2.77,3.70,2.04
33,,2.59,2.77,2.79,3.71,2.05
34,,2.60,2.78,2.80,3.72,2.06
35,,2.61,2.79,2.82,3.73,2.06
36,,2.62,2.80,2.84,3.74,2.07
37,,2.63,2.81,2.86,3.75,2.08
38,,2.64,2.82,2.87,3.76,2.09
39,,2.65,2.83,2.89,3.77,2.09
40,,2.66,2.84,2.90,3.78,2.10
41,,2.67,2.84,2.92,3.79,2.11
42,,2.67,2.85,2.93,3.79,2.11
43,,2.68,2.85,2.95,3.80,2.12
44,,2.69,2.86,2.97,3.81,2.13
45,,2.70,2.87,2.98,3.81,2.14
46,,2.70,2.87,3.00,3.81,2.14
47,,2.71,2.88,3.02,3.82,2.15
48,,2.71,2.88,3.03,3.82,2.16
49,,2.72,2.88,3.05,3.83,2.17
50,,2.72,2.89,3.07,3.83,2.17
51,2.74,2.73,2.90,3.08,3.84,2.18
52,2.74,2.73,2.90,3.10,3.84,2.19
53,2.75,2.74,2.91,3.11,3.85,2.19
54,2.75,2.74,2.92,3.13,3.85,2.20
55,2.76,2.75,2.93,3.15,3.86,2.21
56,2.76,2.75,2.94,3.16,3.86,2.22
57,2.77,2.76,2.95,3.18,3.87,2.22
58,2.77,2.76,2.96,3.20,3.88,2.23
59,2.78,2.77,2.97,3.21,3.89,2.24
60,2.78,2.77,2.98,3.23,3.89,2.24
61,2.78,2.77,2.98,3.23,3.89,2.25
62,2.79,2.78,2.99,3.24,3.89,2.26
63,2.79,2.78,2.99,3.24,3.89,2.27
64,2.79,2.78,2.99,3.25,3.89,2.27
65,2.79,2.78,3.00,3.25,3.89,2.28
66,2.80,2.79,3.01,3.26,3.89,2.29
67,2.80,2.79,3.01,3.26,3.89,2.30
68,2.80,2.79,3.01,3.27,3.89,2.30
69,2.80,2.79,3.02,3.27,3.89,2.31
70,2.81,2.80,3.03,3.28,3.89,2.32
71,2.81,2.80,3.03,3.28,3.89,2.32
72,2.81,2.80,3.03,3.28,3.89,2.33
73,2.81,2.80,3.03,3.29,3.89,2.34
74,2.82,2.82,3.04,3.29,3.89,2.35
75,2.82,2.82,3.04,3.30,3.88,2.35
76,2.82,2.82,3.04,3.30,3.88,2.36
77,2.82,2.82,3.04,3.31,3.88,2.37
78,2.83,2.83,3.05,3.31,3.88,2.38
79,2.83,2.83,3.05,3.32,3.88,2.38
80,2.83,2.83,3.05,3.32,3.88,2.39
81,2.83,2.83,3.05,3.32,3.89,2.40
82,2.84,2.84,3.06,3.32,3.89,2.40
83,2.84,2.84,3.06,3.32,3.89,2.41
84,2.84,2.84,3.06,3.32,3.89,2.42
85,2.84,2.84,3.07,3.32,3.89,2.43
86,2.85,2.85,3.07,3.32,3.89,2.43
87,2.85,2.85,3.07,3.32,3.89,2.44
88,2.85,2.85,3.07,3.32,3.89,2.45
89,2.85,2.85,3.08,3.32,3.89,2.46
90,2.86,2.86,3.08,3.32,3.89,2.46
91,2.86,2.86,3.08,3.31,3.89,2.47
92,2.86,2.86,3.09,3.31,3.89,2.48
93,2.86,2.86,3.09,3.31,3.89,2.48
94,2.87,2.87,3.09,3.31,3.89,2.49
95,2.87,2.87,3.11,3.31,3.89,2.50
96,2.87,2.87,3.11,3.31,3.89,2.51
97,2.87,2.87,3.11,3.31,3.89,2.51
98,2.88,2.88,3.11,3.31,3.89,2.52
99,2.88,2.88,3.12,3.31,3.89,2.54
100,3.01,2.88,3.12,3.31,3.89,2.55
101,3.01,2.89,3.12,3.31,3.89,2.55
102,3.02,2.90,3.13,3.31,3.89,2.56
103,3.02,2.90,3.13,3.31,3.90,2.57
104,3.02,2.90,3.13,3.31,3.90,2.57
105,3.03,2.90,3.14,3.31,3.90,2.58
106,3.03,2.91,3.14,3.30,3.89,2.59
107,3.03,2.91,3.14,3.30,3.89,2.60
108,3.04,2.91,3.14,3.30,3.89,2.60
109,3.04,2.91,3.15,3.30,3.89,2.61
110,3.05,2.92,3.15,3.30,3.89,2.62
111,3.05,2.92,3.15,3.30,3.89,2.63
112,3.05,2.92,3.16,3.30,3.89,2.63
113,3.06,2.92,3.16,3.30,3.89,2.64
114,3.06,2.93,3.16,3.30,3.89,2.65
115,3.06,2.93,3.17,3.30,3.89,2.65
116,3.07,2.93,3.17,3.29,3.88,2.66
117,3.07,2.93,3.17,3.29,3.88,2.67
118,3.07,2.94,3.18,3.29,3.88,2.68
119,3.08,2.94,3.19,3.30,3.88,2.68
120,3.08,2.94,3.19,3.30,3.88,2.69
130,3.07,2.98,3.23,3.32,3.90,
140,3.06,3.01,3.27,3.32,3.91,
150,3.07,3.05,3.31,3.36,3.93,
160,3.08,3.09,3.35,3.39,3.93,
170,3.11,3.14,3.40,3.46,3.95,
180,3.14,3.20,3.44,3.52,3.95,
190,3.19,3.26,3.51,3.61,3.99,
200,3.22,3.32,3.57,3.69,4.01,
220,3.27,3.46,3.69,3.85,4.07,
240,3.36,3.60,3.80,4.00,4.13,
260,3.57,3.73,3.91,4.09,4.19,
280,3.77,3.85,4.01,4.17,4.27,
300,3.84,3.95,4.08,4.21,4.37,
320,3.93,4.01,4.14,4.30,4.49,
340,4.01,4.05,4.21,4.45,4.63,
360,4.07,4.13,4.31,4.61,4.76,
380,4.12,4.21,4.41,4.76,4.86,
400,4.15,4.30,4.51,4.90,4.96,
420,4.18,4.34,4.55,4.95,5.00,
440,4.25,4.39,4.61,5.00,5.06,
460,4.35,4.49,4.70,5.10,5.15,
480,4.46,4.61,4.82,5.21,5.27,
500,4.60,4.74,4.95,5.35,5.41,
520,4.74,4.88,5.09,5.49,5.55,
540,4.86,5.01,5.22,5.62,5.67,
560,4.95,5.09,5.30,5.70,5.76,
580,5.01,5.14,5.36,5.74,5.81,
600,5.04,5.18,5.39,5.77,5.85`
};

// ============================================================
// TEAM CONFIGURATIONS
// Each team has a unique ID, display name, Google Sheet URL, and default benchmark
// ============================================================
const TEAM_CONFIGS = {
    // Men's Teams
    'florida-mens': {
        id: 'florida-mens',
        displayName: 'Florida Men\'s Golf',
        gender: 'men',
        googleSheetUrl: 'YOUR_FLORIDA_MENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer',
        availableBenchmarks: ['PGA Tour', 'College Golfer', 'Scratch Golfer']
    },
    'georgia-mens': {
        id: 'georgia-mens',
        displayName: 'Georgia Men\'s Golf',
        gender: 'men',
        googleSheetUrl: 'YOUR_GEORGIA_MENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer',
        availableBenchmarks: ['PGA Tour', 'College Golfer', 'Scratch Golfer']
    },
    'texas-mens': {
        id: 'texas-mens',
        displayName: 'Texas Men\'s Golf',
        gender: 'men',
        googleSheetUrl: 'YOUR_TEXAS_MENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer',
        availableBenchmarks: ['PGA Tour', 'College Golfer', 'Scratch Golfer']
    },
    
    // Women's Teams
    'florida-womens': {
        id: 'florida-womens',
        displayName: 'Florida Women\'s Golf',
        gender: 'women',
        googleSheetUrl: 'YOUR_FLORIDA_WOMENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer (Women)',
        availableBenchmarks: ['College Golfer (Women)']
    },
    'georgia-womens': {
        id: 'georgia-womens',
        displayName: 'Georgia Women\'s Golf',
        gender: 'women',
        googleSheetUrl: 'YOUR_GEORGIA_WOMENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer (Women)',
        availableBenchmarks: ['College Golfer (Women)']
    },
    'texas-womens': {
        id: 'texas-womens',
        displayName: 'Texas Women\'s Golf',
        gender: 'women',
        googleSheetUrl: 'YOUR_TEXAS_WOMENS_SHEET_URL_HERE',
        defaultBenchmark: 'College Golfer (Women)',
        availableBenchmarks: ['College Golfer (Women)']
    }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Get current team from URL parameters
function getTeamFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('team');
}

// Get team configuration by ID
function getTeamConfig(teamId) {
    if (!teamId) return null;
    return TEAM_CONFIGS[teamId] || null;
}

// Get the appropriate App Script URL for the team
function getAppScriptURL(teamId) {
    const config = getTeamConfig(teamId);
    if (config && config.googleSheetUrl && config.googleSheetUrl !== 'YOUR_' + teamId.toUpperCase() + '_SHEET_URL_HERE') {
        return config.googleSheetUrl;
    }
    // Fallback to default
    return 'YOUR_APPS_SCRIPT_URL_HERE';
}

// Get the benchmark data based on team configuration
function getBenchmarkData(teamId, benchmarkName) {
    // Check if it's a women's benchmark
    const config = getTeamConfig(teamId);
    if (config && config.gender === 'women') {
        if (WOMENS_BENCHMARKS[benchmarkName]) {
            return WOMENS_BENCHMARKS[benchmarkName];
        }
    }
    // Fallback to men's benchmarks (original)
    return null;
}

// Check if a benchmark is a women's benchmark
function isWomenBenchmark(benchmarkName) {
    return WOMENS_BENCHMARKS.hasOwnProperty(benchmarkName);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.TEAM_CONFIGS = TEAM_CONFIGS;
    window.WOMENS_BENCHMARKS = WOMENS_BENCHMARKS;
    window.getTeamFromURL = getTeamFromURL;
    window.getTeamConfig = getTeamConfig;
    window.getAppScriptURL = getAppScriptURL;
    window.getBenchmarkData = getBenchmarkData;
    window.isWomenBenchmark = isWomenBenchmark;
}
