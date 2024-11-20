// CareerRecommendation.jsx
import React, { useContext, useState } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { getCareerFeedback } from '../../data/feedbackDatabase';
import { useNavigate } from 'react-router-dom';

const CareerRecommendation = ({ maxSubjectScore, maxPersonalityScore }) => {
  const { state, submitToNetworkBoard } = useContext(QuizContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitToNetworkBoard = async () => {
    setIsSubmitting(true);
    
    const results = {
      username: state.username,
      bestSubject: maxSubjectScore,
      bestPersonalityTrait: maxPersonalityScore,
      subjectScore: state.subjectScores[maxSubjectScore],
      personalityScore: state.personalityScores[maxPersonalityScore],
      preferredEnvironment: careerFeedback.environment,
      dateOfSubmission: new Date().toISOString()
    };

    const success = await submitToNetworkBoard(results);
    
    if (success) {
      navigate('/network-board');
    }
    
    setIsSubmitting(false);
  };

  // Construct key in correct order - Subject and Trait
  const topScores = `${maxSubjectScore} and ${maxPersonalityScore}`;

  // get career recommendations from feedback database, use the maxSubjectScore and maxPersonalityScore as a search key.
  const careerFeedback = getCareerFeedback(maxSubjectScore, maxPersonalityScore);

  console.log('Max Subject Score:', maxSubjectScore);
  console.log('Max Personality Score:', maxPersonalityScore);
  console.log('Top Scores:', topScores); // Debug log
  console.log('Career Feedback:', careerFeedback); // Debug log

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Career Recommendations</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Your Top Scores</h3>
          <p>{topScores}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Environment</h3>
          <p>Choose a workplace that is {careerFeedback.environment}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Feedback</h3>
          <p className="whitespace-pre-line">
            {careerFeedback.feedback}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Recommended Career Paths</h3>
          <ul className="list-disc pl-5">
            {careerFeedback.recommendedCareers?.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmitToNetworkBoard}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit to Network Board'}
        </button>
      </div>
    </div>
  );
};

export default CareerRecommendation;