// Utility to monitor quiz section changes
export const createSectionMonitor = () => {
  const sections = ['welcome', 'personality', 'subject', 'results'];
  let currentSectionIndex = 0;

  const checkSectionTransition = (newSection) => {
    console.log('\n=== Section Transition ===');
    console.log(`Moving from ${sections[currentSectionIndex]} to ${newSection}`);
    
    // Verify section transition is valid
    const expectedNextSection = sections[currentSectionIndex + 1];
    if (newSection !== expectedNextSection) {
      console.warn(`Warning: Expected transition to ${expectedNextSection}, got ${newSection}`);
    }
    
    currentSectionIndex = sections.indexOf(newSection);
    return true;
  };

  return {
    checkSectionTransition,
    getCurrentSection: () => sections[currentSectionIndex]
  };
}; 