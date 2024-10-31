// PreferenceSelection.jsx
import React from 'react';
import { useQuiz } from '../../../context/QuizContext';
import TraitPreference from './TraitPreference';
import SubjectPreference from './SubjectPreference';

const PreferenceSelection = () => {
  const { 
    personalityAnswers, 
    subjectAnswers,
    updateState,
    moveToNextSection,
    calculateTopScores
  } = useQuiz();

  console.log('Calculating preferences for:', {
    personalityAnswersLength: personalityAnswers?.length,
    subjectAnswersLength: subjectAnswers?.length
  });

  // Get highest scoring traits and subjects
  const highestPersonalityTraits = calculateTopScores(personalityAnswers, 'personality');
  const highestSubjects = calculateTopScores(subjectAnswers, 'subject');

  console.log('Preference selection state:', {
    highestPersonalityTraits,
    highestSubjects,
    personalityAnswersLength: personalityAnswers?.length,
    subjectAnswersLength: subjectAnswers?.length
  });

  // Filter for expected traits (Openness, Extraversion, Agreeableness)
  const expectedTraits = ['Openness', 'Extraversion', 'Agreeableness'];
  const topPersonalityTraits = highestPersonalityTraits
    .filter(trait => expectedTraits.includes(trait));

  // Filter for expected subjects (Science, Technology, Math)
  const expectedSubjects = ['Science', 'Technology', 'Math'];
  const topSubjects = highestSubjects
    .filter(subject => expectedSubjects.includes(subject));

  const handlePreferenceSelected = (type, preference) => {
    console.log('Preference selected:', { type, preference });
    
    updateState({ 
      [`preferred${type}`]: preference,
      ...(type === 'Trait' ? 
        { personalityBonus: preference } : 
        { subjectBonus: preference })
    });
    
    // Navigate based on test requirements
    if (type === 'Subject' || (type === 'Trait' && topSubjects.length === 3)) {
      moveToNextSection();
    }
  };

  // Show trait selection if we have the expected top 3 traits
  if (topPersonalityTraits.length === 3) {
    console.log('Showing personality trait selection:', topPersonalityTraits);
    return (
      <TraitPreference 
        traits={topPersonalityTraits}
        onSelect={(trait) => handlePreferenceSelected('Trait', trait)}
      />
    );
  }

  // Show subject selection if we have the expected top 3 subjects
  if (topSubjects.length === 3) {
    console.log('Showing subject selection:', topSubjects);
    return (
      <SubjectPreference
        subjects={topSubjects}
        onSelect={(subject) => handlePreferenceSelected('Subject', subject)}
      />
    );
  }

  console.log('No preference selection needed, moving to next section');
  moveToNextSection();
  return null;
};

export default PreferenceSelection;