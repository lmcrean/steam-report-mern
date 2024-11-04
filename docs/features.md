# Features

## Quiz

### 1. Interactive Career Assessment
- Personalized STEAM career guidance through a two-part assessment:
  - OCEAN Personality Test
  - Subject Knowledge Evaluation

### 2. OCEAN Personality Assessment
- Comprehensive personality evaluation using the Five Factor Model:
  - **O**penness to Experience
  - **C**onscientiousness
  - **E**xtraversion
  - **A**greeableness
  - **N**euroticism
- 25 scenario-based questions with 9-point rating scale
- Real-time trait scoring and analysis

### 3. STEAM Subject Knowledge Test
- Covers five key academic areas:
  - Science
  - Technology
  - English
  - Art
  - Mathematics
- 10 questions per subject area
- Multiple choice format with instant feedback

### 4. Smart Preference Resolution
- Handles tied scores intelligently:
  - Allows user selection when multiple traits score equally
  - Provides detailed descriptions for informed decision-making
- References from:
```javascript:client/src/components/quiz/preference-selection/TraitPreference.jsx
startLine: 29
endLine: 36
```

### 5. Comprehensive Results Analysis
- Detailed personality profile
- Subject proficiency breakdown
- Personalized career recommendations based on:
  - Combined OCEAN and STEAM scores
  - User preferences
  - Career-trait matching algorithm

### 6. User Experience Features
- Responsive design for all devices
- Dark/Light mode support
- Progress tracking throughout assessment
- Interactive UI elements:
  - Clear navigation
  - Visual feedback
  - Error handling
- Accessibility considerations

### 7. Data Visualization
- Score visualization using charts
- Comparative analysis of traits
- Performance metrics across subjects
- Career compatibility indicators

### 8. Technical Implementation
- Built with React and modern web technologies
- Automated testing suite using Playwright
- Modular component architecture
- Context-based state management
- Comprehensive error handling