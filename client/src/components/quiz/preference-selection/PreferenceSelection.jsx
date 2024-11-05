// PreferenceSelection.jsx
import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../../../context/QuizContext';
import { useNextSection } from '../../../hooks/useNextSection';
import TraitPreference from './TraitPreference';
import SubjectPreference from './SubjectPreference';

const PreferenceSelection = () => {
  const { state, updateState } = useContext(QuizContext);
  const { moveToNextSection } = useNextSection();
  const [showingPreference, setShowingPreference] = useState('trait');

  const { personalityTies, subjectTies } = state;

  console.log('PreferenceSelection - Current State:', {
    showingPreference,
    personalityTies,
    subjectTies
  });

  const handlePreferenceSelected = (type, preference) => {
    console.log('PreferenceSelection - Selection Made:', { type, preference });
    
    updateState({ 
      [`preferred${type}`]: preference,
      ...(type === 'Trait' ? 
        { personalityBonus: preference } : 
        { subjectBonus: preference })
    });

    if (type === 'Trait') {
      setShowingPreference('subject');
    } else {
      moveToNextSection();
    }
  };

  // Show trait selection first
  if (showingPreference === 'trait') {
    console.log('PreferenceSelection - Showing trait selection');
    return (
      <TraitPreference 
        traits={personalityTies}
        onSelect={(trait) => handlePreferenceSelected('Trait', trait)}
      />
    );
  }

  // Show subject selection after trait selection
  if (showingPreference === 'subject') {
    console.log('PreferenceSelection - Showing subject selection');
    return (
      <SubjectPreference
        subjects={subjectTies}
        onSelect={(subject) => handlePreferenceSelected('Subject', subject)}
      />
    );
  }

  console.log('PreferenceSelection - No preferences to show, moving to next section');
  moveToNextSection();
  return null;
};

export default PreferenceSelection;