# 9-Hole Round Feature Implementation Plan

**Date:** February 10, 2026  
**Project:** RoundEntry-MiniMax Golf Tracker  
**Status:** Architecture Planning Phase

---

## Executive Summary

This document outlines a comprehensive implementation plan for adding 9-hole round functionality to the existing golf shot tracking application. The current system is architected around 18-hole rounds, and this feature extends the application to support both 9-hole and 18-hole rounds seamlessly while maintaining backward compatibility and data integrity.

---

## 1. User Flow Design for Round Length Selection

### 1.1 Recommended User Flow

The round length selection should occur during the initial "Round Information" phase, immediately after the user begins setting up a new round. The flow should be intuitive and minimize friction for returning users while clearly explaining options to new users.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROUND SETUP FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Round Information Page                                       │
│     ├── Player Name (existing field)                            │
│     ├── Date (existing field)                                   │
│     ├── Round Length Selection ★ NEW                           │
│     │   ├── 9 Holes (Front 9 / Back 9 toggle)                  │
│     │   └── 18 Holes (default)                                   │
│     ├── Course Selection (updates based on round length)         │
│     └── Remaining existing fields                                │
│                                                                 │
│  2. Shot Entry Page                                              │
│     ├── Hole counter: 1-9 or 1-18 based on selection            │
│     ├── Progress indicator shows holes completed                 │
│     └── Completion page adjusts summary accordingly              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Round Length Selection Screen Design

**Placement:** Add a prominent round length selector at the top of the Round Information page, immediately after the team branding element (if present).

**UI Components:**

```jsx
// Recommended UI structure for round length selection
<div className="round-length-selector">
  <label className="form-label">Round Length</label>
  <div className="round-length-options">
    <button 
      className={`round-option ${roundLength === 18 ? 'active' : ''}`}
      onClick={() => setRoundLength(18)}
    >
      <span className="round-icon">⛳</span>
      <span className="round-text">18 Holes</span>
      <span className="round-subtext">Full round</span>
    </button>
    <button 
      className={`round-option ${roundLength === 9 ? 'active' : ''}`}
      onClick={() => setRoundLength(9)}
    >
      <span className="round-icon">🏌️</span>
      <span className="round-text">9 Holes</span>
      <span className="round-subtext">Half round</span>
    </button>
  </div>
  
  {roundLength === 9 && (
    <div className="nine-hole-config">
      <label className="form-label">Which 9 holes?</label>
      <div className="nine-hole-options">
        <label className="nine-hole-option">
          <input 
            type="radio" 
            name="nineHoleSegment" 
            value="front9" 
            checked={nineHoleSegment === 'front9'}
            onChange={() => setNineHoleSegment('front9')}
          />
          <span>Front 9 (Holes 1-9)</span>
          <span className="segment-info">Starting at Hole 1</span>
        </label>
        <label className="nine-hole-option">
          <input 
            type="radio" 
            name="nineHoleSegment" 
            value="back9" 
            checked={nineHoleSegment === 'back9'}
            onChange={() => setNineHoleSegment('back9')}
          />
          <span>Back 9 (Holes 10-18)</span>
          <span className="segment-info">Starting at Hole 10</span>
        </label>
        <label className="nine-hole-option">
          <input 
            type="radio" 
            name="nineHoleSegment" 
            value="custom" 
            checked={nineHoleSegment === 'custom'}
            onChange={() => setNineHoleSegment('custom')}
          />
          <span>Custom Range</span>
          <span className="segment-info">Select specific holes</span>
        </label>
      </div>
    </div>
  )}
</div>
```

### 1.3 UX Design Principles Applied

1. **Clear Default Selection:** Default to 18-hole rounds since this matches current behavior and the majority of use cases. Users who want 9 holes must actively select it.

2. **Visual Distinction:** Use distinct visual treatment (different icons, colors) for 9-hole vs 18-hole options to reduce selection errors.

3. **Progressive Disclosure:** The 9-hole segment selector (Front 9 / Back 9) only appears after the user selects 9 holes, keeping the initial interface clean.

4. **Educational Content:** Include a brief tooltip or help text explaining the difference, especially useful for new users:
   - "9-hole rounds are ideal for practice sessions, quick rounds, or when time is limited"
   - "Front 9 and Back 9 allow you to track either half of an 18-hole course"

5. **Consistent Behavior:** When a 9-hole round is selected, the shot entry flow should work identically to the 18-hole flow, just stopping at 9 holes instead of 18.

---

## 2. Data Structure Modifications

### 2.1 Current Data Model

The current application uses a simple state structure:

```javascript
// Current roundInfo state (lines 1130-1138)
const [roundInfo, setRoundInfo] = useState({
  playerName: '',
  date: new Date().toISOString().split('T')[0],
  course: '',
  tournament: '',
  weatherDifficulty: '',
  courseDifficulty: '',
  benchmark: defaultBenchmark
});

// Current holes state (line 1141)
const [holes, setHoles] = useState(Array.from({ length: 18 }, () => ({ shots: [] })));
```

### 2.2 Modified Data Model

Add round length and 9-hole segment configuration to the roundInfo object:

```javascript
// Enhanced roundInfo state
const [roundInfo, setRoundInfo] = useState({
  playerName: '',
  date: new Date().toISOString().split('T')[0],
  course: '',
  tournament: '',
  weatherDifficulty: '',
  courseDifficulty: '',
  benchmark: defaultBenchmark,
  // NEW FIDS
  roundLength: 18,  // 9 or 18
  nineHoleSegment: null,  // 'front9', 'back9', 'custom', or null for 18-hole
  customHoleRange: null  // { start: 1, end: 9 } for custom ranges
});

// Dynamic holes array based on round length
const totalHoles = roundInfo.roundLength || 18;
const [holes, setHoles] = useState(Array.from({ length: totalHoles }, () => ({ shots: [] })));
```

### 2.3 Holes Array Initialization

When round length changes from 18 to 9 (or vice versa), the holes array should be reinitialized:

```javascript
// Effect to manage holes array when round length changes
useEffect(() => {
  const requiredLength = roundInfo.roundLength || 18;
  
  if (holes.length !== requiredLength) {
    // Preserve existing hole data when expanding 9 → 18
    if (requiredLength > holes.length) {
      const additionalHoles = Array.from(
        { length: requiredLength - holes.length },
        () => ({ shots: [] })
      );
      setHoles([...holes, ...additionalHoles]);
    }
    // Truncate when contracting 18 → 9 (with confirmation)
    else if (requiredLength < holes.length) {
      const hasDataBeyondLimit = holes.slice(requiredLength).some(h => h.shots.length > 0);
      if (hasDataBeyondLimit) {
        const confirmTruncate = window.confirm(
          'Reducing round length will discard data for holes beyond ' +
          `${requiredLength}. Continue?`
        );
        if (!confirmTruncate) {
          setRoundLength(prev => prev === 9 ? 18 : 9);  // Revert
          return;
        }
      }
      setHoles(holes.slice(0, requiredLength));
    }
  }
}, [roundInfo.roundLength]);
```

### 2.4 Course Data Enhancement

For proper 9-hole course handling, enhance course data structure to support 9-hole courses:

```javascript
// Enhanced course data model
const courseDatabase = {
  'Pinehurst Resort': {
    type: '18-hole',  // or '9-hole' or '27-hole' or '36-hole'
    holes: {
      1: { par: 4, yardage: 412, handicap: 5 },
      2: { par: 5, yardage: 523, handicap: 9 },
      // ... holes 1-18
    },
    nineHoleSections: {
      front9: { holes: [1, 2, 3, 4, 5, 6, 7, 8, 9], totalPar: 36, totalYardage: 3245 },
      back9: { holes: [10, 11, 12, 13, 14, 15, 16, 17, 18], totalPar: 35, totalYardage: 3412 }
    }
  },
  'Short Course': {
    type: '9-hole',  // Dedicated 9-hole course
    holes: {
      1: { par: 3, yardage: 150, handicap: 7 },
      // ... holes 1-9
    }
  }
};
```

### 2.5 Round Completion Status

Add round status tracking to handle partial rounds:

```javascript
const [roundStatus, setRoundStatus] = useState('in-progress');  // 'in-progress', 'completed', 'abandoned'

// Track last active timestamp for partial round recovery
const [lastActiveAt, setLastActiveAt] = useState(Date.now());
```

---

## 3. Course Selection Logic for 9-Hole Rounds

### 3.1 Course Type Handling

Different scenarios require different course selection approaches:

```javascript
function getApplicableCourses(roundLength) {
  const allCourses = loadCourseDatabase();
  
  if (roundLength === 9) {
    return {
      '9-hole courses': allCourses.filter(c => c.type === '9-hole'),
      '18-hole courses (Front 9)': allCourses.filter(c => c.type === '18-hole').map(c => ({
        ...c,
        displayName: `${c.name} - Front 9`,
        section: 'front9'
      })),
      '18-hole courses (Back 9)': allCourses.filter(c => c.type === '18-hole').map(c => ({
        ...c,
        displayName: `${c.name} - Back 9`,
        section: 'back9'
      }))
    };
  }
  
  return {
    '18-hole courses': allCourses.filter(c => ['18-hole', '27-hole', '36-hole'].includes(c.type))
  };
}
```

### 3.2 Hole Numbering for 9-Hole Rounds

When a player selects Front 9 (holes 1-9), the UI should display holes 1-9 with the understanding that these correspond to the actual holes on the course. When Back 9 is selected, display holes 10-18.

**Key consideration:** The actual hole numbers displayed to the user should match the course's hole numbering:

```javascript
function getEffectiveHoleInfo(course, nineHoleSegment, displayHoleNumber) {
  if (course.type === '9-hole') {
    return course.holes[displayHoleNumber];
  }
  
  if (nineHoleSegment === 'front9') {
    return course.holes[displayHoleNumber];
  }
  
  if (nineHoleSegment === 'back9') {
    return course.holes[displayHoleNumber + 9];
  }
  
  if (nineHoleSegment === 'custom') {
    // For custom ranges, calculate offset from start hole
    return course.holes[roundInfo.customHoleRange.start + displayHoleNumber - 1];
  }
}
```

### 3.3 Course Selection UI Enhancement

```jsx
function CourseSelector({ roundLength, value, onChange }) {
  const courses = getApplicableCourses(roundLength);
  
  return (
    <div className="form-group">
      <label className="form-label">Course {roundLength === 9 && '(9-hole mode)'}</label>
      <select 
        className="form-select" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select course</option>
        
        {Object.entries(courses).map(([category, courseList]) => (
          <optgroup key={category} label={category}>
            {courseList.map(course => (
              <option key={course.id} value={course.id}>
                {course.displayName || course.name}
                {course.section && ` (${course.section === 'front9' ? 'Holes 1-9' : 'Holes 10-18'})`}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      
      {/* Course details preview */}
      {value && (
        <div className="course-preview">
          <span>Par: {selectedCourse.totalPar}</span>
          <span>Yardage: {selectedCourse.totalYardage} yards</span>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Scoring and Statistics Aggregation

### 4.1 Score Calculation Logic

The score calculation logic remains fundamentally the same but needs to account for variable round lengths:

```javascript
function calculateRoundStatistics(holes, roundLength) {
  const relevantHoles = holes.slice(0, roundLength);
  
  // Total strokes
  const totalScore = relevantHoles.reduce((total, hole) => 
    total + hole.shots.reduce((strokes, shot) => 
      strokes + 1 + (shot.penalty ? 1 : 0), 0
    ), 0
  );
  
  // Total strokes gained
  const totalSG = relevantHoles.reduce((sum, hole) => 
    sum + hole.shots.reduce((shotSum, shot) => shotSum + (shot.sg || 0), 0)
  , 0);
  
  // Hole-by-hole breakdown
  const holeByHole = relevantHoles.map((hole, idx) => {
    const holeScore = hole.shots.reduce((s, shot) => s + 1 + (shot.penalty ? 1 : 0), 0);
    const holeSG = hole.shots.reduce((sgSum, shot) => sgSum + (shot.sg || 0), 0);
    return {
      holeNumber: idx + 1,
      score: holeScore,
      strokesGained: holeSG
    };
  });
  
  return {
    totalHoles: roundLength,
    totalScore,
    totalStrokesGained: totalSG,
    averagePerHole: (totalScore / roundLength).toFixed(2),
    strokesGainedPerHole: (totalSG / roundLength).toFixed(2),
    holeByHole,
    roundComplete: relevantHoles.every(h => h.shots.length > 0)
  };
}
```

### 4.2 Handicap Considerations

For handicap calculations, 9-hole rounds need special handling:

```javascript
function calculateHandicap微分(rounds, courseRating, slopeRating) {
  // Filter valid rounds for handicap calculation
  const validRounds = rounds.filter(r => {
    // 18-hole rounds always count
    if (r.roundLength === 18) return true;
    
    // 9-hole rounds can count if properly adjusted
    // They need to be converted to 18-hole equivalent
    if (r.roundLength === 9 && r.holes.every(h => h.shots.length > 0)) {
      return true;
    }
    
    return false;
  });
  
  // For 9-hole rounds, double the score to get 18-hole equivalent
  // This is a simplification; actual handicap systems have specific rules
  const adjustedScores = validRounds.map(r => {
    if (r.roundLength === 9) {
      return {
        ...r,
        eighteenHoleEquivalent: r.totalScore * 2,
        isNineHole: true
      };
    }
    return { ...r, eighteenHoleEquivalent: r.totalScore, isNineHole: false };
  });
  
  // Calculate differential using standard formula
  // (Score - Course Rating) × 113 / Slope Rating
  return adjustedScores.map(r => ({
    ...r,
    differential: ((r.eighteenHoleEquivalent - r.courseRating) * 113 / r.slopeRating).toFixed(1)
  }));
}
```

### 4.3 Round Completion Criteria

9-hole rounds are considered complete when all selected holes have at least one shot recorded and the ball is holed (endDistance === 0):

```javascript
function isRoundComplete(holes, roundLength) {
  const relevantHoles = holes.slice(0, roundLength);
  
  return relevantHoles.every((hole, idx) => {
    if (hole.shots.length === 0) return false;
    
    // Check if last shot on hole has endDistance = 0 (ball holed)
    const lastShot = hole.shots[hole.shots.length - 1];
    return lastShot.endDistance === 0;
  });
}
```

### 4.4 Statistics Display Updates

Update the completion summary page to reflect 9-hole statistics appropriately:

```jsx
function RoundSummary({ roundInfo, holes }) {
  const stats = calculateRoundStatistics(holes, roundInfo.roundLength);
  
  return (
    <div className="summary-card">
      <div className="summary-title">
        {roundInfo.roundLength === 9 ? '9-Hole Round Summary' : 'Round Summary'}
      </div>
      
      <div className="summary-item">
        <span className="summary-label">Holes Played</span>
        <span className="summary-value">{stats.totalHoles}</span>
      </div>
      
      <div className="summary-item">
        <span className="summary-label">Total Score</span>
        <span className="summary-value">{stats.totalScore}</span>
      </div>
      
      <div className="summary-item">
        <span className="summary-label">Average per Hole</span>
        <span className="summary-value">{stats.averagePerHole}</span>
      </div>
      
      <div className="summary-item">
        <span className="summary-label">Total Strokes Gained</span>
        <span className="summary-value" style={{color: stats.totalStrokesGained >= 0 ? '#2d5016' : '#c77d3a'}}>
          {formatSG(stats.totalStrokesGained)}
        </span>
      </div>
      
      {/* 9-hole specific context */}
      {roundInfo.roundLength === 9 && roundInfo.nineHoleSegment && (
        <div className="summary-item">
          <span className="summary-label">Course Section</span>
          <span className="summary-value">
            {roundInfo.nineHoleSegment === 'front9' ? 'Front 9 (Holes 1-9)' : 'Back 9 (Holes 10-18)'}
          </span>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Partial Round Storage and Session Management

### 5.1 Local Storage Strategy

Implement robust local storage for partial round recovery:

```javascript
const PARTIAL_ROUND_KEY = 'golfTracker_partialRound';

// Save partial round to localStorage
function savePartialRound(roundInfo, holes, currentHole, currentShot) {
  const partialRound = {
    roundInfo,
    holes,
    currentHole,
    currentShot,
    lastUpdated: Date.now(),
    status: 'in-progress'
  };
  
  try {
    localStorage.setItem(PARTIAL_ROUND_KEY, JSON.stringify(partialRound));
    return true;
  } catch (e) {
    console.error('Failed to save partial round:', e);
    return false;
  }
}

// Load partial round from localStorage
function loadPartialRound() {
  try {
    const saved = localStorage.getItem(PARTIAL_ROUND_KEY);
    if (!saved) return null;
    
    const partialRound = JSON.parse(saved);
    
    // Check if partial round is stale (older than 7 days)
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - partialRound.lastUpdated > sevenDays) {
      clearPartialRound();
      return null;
    }
    
    return partialRound;
  } catch (e) {
    console.error('Failed to load partial round:', e);
    return null;
  }
}

// Clear partial round after completion or manual discard
function clearPartialRound() {
  localStorage.removeItem(PARTIAL_ROUND_KEY);
}
```

### 5.2 Auto-Save Integration

Integrate auto-save into the shot entry workflow:

```javascript
function GolfTracker() {
  // ... existing state ...
  
  // Auto-save effect
  useEffect(() => {
    // Only save if in shot-entry phase and not complete
    if (step === 'shot-entry' && step !== 'complete' && step !== 'submitted') {
      const saveTimer = setTimeout(() => {
        savePartialRound(roundInfo, holes, currentHole, currentShot);
      }, 5000);  // Save 5 seconds after last change
      
      return () => clearTimeout(saveTimer);
    }
  }, [roundInfo, holes, currentHole, currentShot, step]);
  
  // Load partial round on mount
  useEffect(() => {
    if (step === 'round-info') {
      const partial = loadPartialRound();
      if (partial && partial.status === 'in-progress') {
        const shouldResume = window.confirm(
          'You have a partially completed round from ' +
          new Date(partial.lastUpdated).toLocaleString() + 
          '. Would you like to resume it?'
        );
        
        if (shouldResume) {
          setRoundInfo(partial.roundInfo);
          setHoles(partial.holes);
          setCurrentHole(partial.currentHole);
          setCurrentShot(partial.currentShot);
          setStep('shot-entry');
        } else {
          clearPartialRound();
        }
      }
    }
  }, [step]);
}
```

### 5.3 Session Management for Multi-Session Rounds

For players who want to complete a 9-hole round across multiple sessions:

```javascript
// Enhanced state for multi-session support
const [roundSession, setRoundSession] = useState({
  sessionCount: 1,
  lastSessionDate: null,
  startedAt: Date.now(),
  completedAt: null
});

// Track session boundaries
function startNewSession() {
  setRoundSession(prev => ({
    ...prev,
    sessionCount: prev.sessionCount + 1,
    lastSessionDate: Date.now()
  }));
}

// Update on shot entry
function addShot() {
  // ... existing addShot logic ...
  
  // Track session activity
  setRoundSession(prev => ({
    ...prev,
    lastSessionDate: Date.now()
  }));
  
  // Auto-save
  savePartialRound(roundInfo, newHoles, nextHole, nextShot);
}
```

### 5.4 Data Export Considerations

Ensure Google Sheets and Excel exports include 9-hole round metadata:

```javascript
function prepareDataForExport() {
  const roundId = `R${Date.now()}`;
  const data = [];
  let runningScore = 0;
  
  // Limit to configured round length
  const relevantHoles = holes.slice(0, roundInfo.roundLength);
  
  relevantHoles.forEach((hole, holeIdx) => {
    hole.shots.forEach((shot) => {
      runningScore += 1 + (shot.penalty ? 1 : 0);
      data.push({
        'Player': roundInfo.playerName,
        'Round ID': roundId,
        'Date': roundInfo.date,
        'Course': roundInfo.course,
        // NEW: Round length metadata
        'Round Length': roundInfo.roundLength,
        'Hole Segment': roundInfo.nineHoleSegment || 'full',
        // ... rest of existing fields
        'Shot': shot.shotNumber,
        'Hole': holeIdx + 1,
        'Score': runningScore,
        // ... shot details
      });
    });
  });
  
  // Add summary row
  data.push({
    'Player': roundInfo.playerName,
    'Round ID': roundId,
    'Date': roundInfo.date,
    'Course': roundInfo.course,
    'Round Length': roundInfo.roundLength,
    'Hole Segment': roundInfo.nineHoleSegment || 'full',
    'Tournament': roundInfo.tournament,
    'Benchmark': roundInfo.benchmark,
    'Weather Difficulty': roundInfo.weatherDifficulty,
    'Course Difficulty': roundInfo.courseDifficulty,
    // Summary fields
    'Total Score': data.length > 0 ? runningScore : '',
    'Strokes Gained': holes.reduce((sum, h) => 
      sum + h.shots.reduce((s, shot) => s + (shot.sg || 0), 0), 0
    ).toFixed(2),
    'Session Count': roundSession.sessionCount
  });
  
  return data;
}
```

---

## 6. UI/UX Recommendations for Round Setup Page

### 6.1 Visual Design Guidelines

#### Round Length Selector Design

The round length selector should be visually prominent but not overwhelming:

```css
.round-length-selector {
  margin-bottom: 1.5rem;
}

.round-length-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.round-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  border: 2px solid #e8e6e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 200ms ease;
}

.round-option:hover {
  border-color: #3d6b22;
}

.round-option.active {
  border-color: #2d5016;
  background: #f0f7ed;
}

.round-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.round-text {
  font-weight: 600;
  font-size: 1rem;
  color: #2c3333;
}

.round-subtext {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
```

#### 9-Hole Segment Selection

```css
.nine-hole-config {
  margin-top: 1rem;
  padding: 1rem;
  background: #fafaf8;
  border-radius: 8px;
  border: 1px solid #e8e6e0;
}

.nine-hole-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.nine-hole-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e8e6e0;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 200ms ease;
}

.nine-hole-option:hover {
  border-color: #3d6b22;
}

.nine-hole-option input[type="radio"] {
  accent-color: #2d5016;
  width: 1.25rem;
  height: 1.25rem;
}

.nine-hole-option span:first-of-type {
  font-weight: 500;
}

.segment-info {
  margin-left: auto;
  font-size: 0.8rem;
  color: #6b7280;
}
```

### 6.2 Progress Indicator Enhancement

For 9-hole rounds, update the progress indicator to reflect the shorter length:

```jsx
function HoleProgressIndicator({ currentHole, totalHoles, holes }) {
  const progress = (currentHole / totalHoles) * 100;
  const completedHoles = holes.slice(0, currentHole - 1).filter(h => h.shots.length > 0).length;
  
  return (
    <div className="progress-indicator">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      
      <div className="progress-labels">
        <span>Hole {currentHole} of {totalHoles}</span>
        <span className="progress-detail">
          {completedHoles} / {totalHoles} holes complete
          {totalHoles === 9 && (
            <span className="nine-hole-badge">9-Hole Round</span>
          )}
        </span>
      </div>
    </div>
  );
}
```

### 6.3 Completion Page Customization

```css
.round-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f7ed;
  border: 1px solid #c4ddb8;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #2d5016;
  margin-bottom: 1rem;
}

.nine-hole .round-type-badge {
  background: #fef3e6;
  border-color: #e8d4b8;
  color: #c77d3a;
}
```

### 6.4 Mobile Optimization

Given the mobile-first nature of the current application, ensure touch targets are appropriately sized:

```css
/* Touch target sizing - minimum 44x44px for mobile */
.round-option {
  min-height: 120px;
  justify-content: center;
}

.nine-hole-option {
  min-height: 60px;
}

/* Ensure radio/checkbox inputs are tap-friendly */
.nine-hole-option input[type="radio"] {
  width: 24px;
  height: 24px;
  min-width: 24px;
}
```

### 6.5 Educational Content for New Users

Add contextual help that appears on first use or can be toggled:

```jsx
function RoundLengthHelp() {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="round-length-help">
      <button 
        className="help-toggle"
        onClick={() => setShowHelp(!showHelp)}
        aria-expanded={showHelp}
      >
        {showHelp ? 'Hide help' : 'What\'s the difference?'}
      </button>
      
      {showHelp && (
        <div className="help-content">
          <h4>Choosing Your Round Length</h4>
          <ul>
            <li>
              <strong>18 Holes:</strong> A full round, typically taking 3-5 hours. 
              Standard for tournaments and most golf games.
            </li>
            <li>
              <strong>9 Holes:</strong> Half a round, ideal for practice sessions, 
              quick games, or when time is limited. Many courses offer 9-hole rates.
            </li>
          </ul>
          <p>
            <strong>Front 9 vs Back 9:</strong> If you're playing at an 18-hole course 
            but only want 9 holes, you can choose to start at Hole 1 (Front 9) or 
            Hole 10 (Back 9).
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Implementation Priority and Phasing

### Phase 1: Core Infrastructure (High Priority)

1. **Update roundInfo state** to include roundLength and nineHoleSegment fields
2. **Modify holes array initialization** to be dynamic based on roundLength
3. **Update round length selector UI** in Round Information page
4. **Modify completion logic** to respect roundLength setting

### Phase 2: Course and Scoring (Medium Priority)

1. **Enhance course database** to support 9-hole and 18-hole data
2. **Update course selector** to filter/display appropriate options
3. **Modify statistics calculation** for variable round lengths
4. **Update export format** to include round length metadata

### Phase 3: User Experience (Medium Priority)

1. **Add progress indicator** specific to 9-hole rounds
2. **Implement educational content** and help tooltips
3. **Enhance completion page** with 9-hole specific messaging
4. **Add visual polish** to round length selector

### Phase 4: Advanced Features (Lower Priority)

1. **Implement partial round recovery** with localStorage
2. **Add session tracking** for multi-session rounds
3. **Enable 9-hole rounds to be combined** into 18-hole equivalents
4. **Add handicap calculation support** for 9-hole rounds

---

## 8. Backward Compatibility Considerations

### 8.1 Existing Data Migration

The existing round data format (18-hole only) should continue to work:

```javascript
// Migration helper for existing data
function normalizeRoundData(roundData) {
  if (roundData.roundLength === undefined) {
    // Assume existing data is 18-hole
    return {
      ...roundData,
      roundLength: 18,
      nineHoleSegment: null,
      customHoleRange: null
    };
  }
  
  return roundData;
}
```

### 8.2 URL Parameter Support

Maintain existing URL parameter behavior while adding new options:

```javascript
// Check for round length in URL
function getRoundLengthFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const length = urlParams.get('holes');
  
  if (length === '9') return 9;
  if (length === '18') return 18;
  
  // Default to user's preference or 18
  return parseInt(localStorage.getItem('preferredRoundLength')) || 18;
}
```

### 8.3 Default Preferences

Remember user's round length preference:

```javascript
useEffect(() => {
  // Save preferred round length
  localStorage.setItem('preferredRoundLength', roundInfo.roundLength);
}, [roundInfo.roundLength]);
```

---

## 9. Testing Recommendations

### 9.1 Functional Testing

1. **Round Creation Tests**
   - Create 18-hole round (existing behavior)
   - Create 9-hole round with Front 9 selection
   - Create 9-hole round with Back 9 selection
   - Switch between round lengths during setup

2. **Shot Entry Tests**
   - Complete full 9-hole round
   - Complete partial 9-hole round
   - Navigate holes in 9-hole mode
   - Test hole completion at hole 9

3. **Data Export Tests**
   - Export 9-hole round to Excel
   - Export 9-hole round to Google Sheets
   - Verify metadata in exported files

### 9.2 Edge Case Testing

1. Start 18-hole round, switch to 9-hole (with data loss warning)
2. Start 9-hole round, switch to 18-hole (preserve partial data)
3. Resume partial round after browser close
4. Resume partial round after multiple days

---

## 10. Code Structure Recommendations

### 10.1 Suggested File Organization

For better maintainability, consider extracting components:

```
src/
├── components/
│   ├── RoundLengthSelector.jsx
│   ├── NineHoleConfig.jsx
│   ├── CourseSelector.jsx
│   ├── HoleProgressIndicator.jsx
│   └── RoundSummary.jsx
├── hooks/
│   ├── usePartialRound.js
│   ├── useRoundPersistence.js
│   └── useRoundStatistics.js
├── utils/
│   ├── courseData.js
│   ├── statistics.js
│   └── roundValidation.js
└── App.jsx (or keep in index.html for simplicity)
```

### 10.2 Component Interface Recommendations

```jsx
// RoundLengthSelector component interface
function RoundLengthSelector({
  value,           // 9 or 18
  onChange,        // (length) => void
  showHelp,        // boolean
  className        // string
}) { ... }

// NineHoleConfig component interface
function NineHoleConfig({
  value,           // 'front9', 'back9', 'custom'
  onChange,        // (segment) => void
  courseId,        // selected course ID
  className        // string
}) { ... }
```

---

## 11. Summary of Key Changes Required

### 11.1 State Changes

| Component | Current State | Required Change |
|-----------|---------------|-----------------|
| `roundInfo` | No roundLength field | Add `roundLength: 18`, `nineHoleSegment: null`, `customHoleRange: null` |
| `holes` | Fixed 18-element array | Dynamic array based on `roundInfo.roundLength` |
| New state | N/A | `roundSession` for multi-session tracking |
| New state | N/A | `roundStatus` for completion tracking |

### 11.2 Component Changes

| Component | Required Change |
|-----------|-----------------|
| Round Info Page | Add round length selector, conditional 9-hole segment selector |
| Shot Entry | Dynamic hole count (1-9 or 1-18), updated completion logic |
| Completion Page | Conditional messaging based on round length |
| Data Export | Include round length metadata in exports |

### 11.3 New Features

| Feature | Description |
|---------|-------------|
| Partial Round Recovery | Auto-save to localStorage, resume on return |
| Course Data Enhancement | Support for 9-hole and 18-hole course data |
| Statistics Normalization | Handle variable round lengths in calculations |
| Educational Content | Contextual help for round length selection |

---

## 12. Next Steps

1. **Review and Approval:** Share this plan for stakeholder review
2. **Phase 1 Implementation:** Begin with core infrastructure changes
3. **User Testing:** Conduct testing with actual users before full release
4. **Documentation:** Update user documentation to reflect new features
5. **Monitoring:** Track usage metrics to optimize UX after launch

---

*Document prepared for RoundEntry-MiniMax 9-Hole Round Feature*  
*Version 1.0*
