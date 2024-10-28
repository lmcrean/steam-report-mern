export const subjects = {
    Science: {
      description: "Tests your understanding of scientific principles and natural phenomena.",
      icon: "🔬"
    },
    Technology: {
      description: "Evaluates your knowledge of computers, software, and digital systems.",
      icon: "💻"
    },
    English: {
      description: "Assesses your comprehension of literature and language.",
      icon: "📚"
    },
    Art: {
      description: "Tests your knowledge of visual arts, design, and creativity.",
      icon: "🎨"
    },
    Math: {
      description: "Evaluates your mathematical and logical reasoning skills.",
      icon: "🔢"
    }
  };
  
  // Questions will be loaded from the JSON files for each subject
  export const getSubjectQuestions = async (subject) => {
    try {
      const response = await fetch(`/src/data/trivia_${subject.toLowerCase()}.json`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(`Error loading ${subject} questions:`, error);
      return [];
    }
  };