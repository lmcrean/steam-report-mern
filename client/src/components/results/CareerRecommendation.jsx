// CareerRecommendation.jsx
import React, { useContext, useState } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { getCareerFeedback } from '../../data/getCareerFeedback';
import { useNavigate } from 'react-router-dom';

const CareerRecommendation = ({ maxSubjectScore, maxPersonalityScore, layout = 'default' }) => {
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
      preferredEnvironment: state.preferredEnvironment,
      dateOfSubmission: new Date().toISOString()
    };

    const success = await submitToNetworkBoard(results);
    
    if (success) {
      navigate('/network-board');
    }
    
    setIsSubmitting(false);
  };

  // get career recommendations from feedback database
  const careerFeedback = getCareerFeedback(maxSubjectScore, maxPersonalityScore);

  const ImagesSection = () => (
    <div className={`flex ${layout === 'top-images' ? 'flex-col md:flex-row' : 'flex-col'} justify-center gap-4 md:gap-8 my-4 md:my-8`}>
      <div className="text-center">
        <img 
          src={careerFeedback.imagePaths.steam} 
          alt={`${maxSubjectScore} trait`}
          className="w-full md:w-64 h-48 md:h-64 object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="text-center">
        <img 
          src={careerFeedback.imagePaths.ocean} 
          alt={`${maxPersonalityScore} trait`}
          className="w-full md:w-64 h-48 md:h-64 object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );

  const ContentSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Environment</h3>
        <p>Choose a workplace that is {state.preferredEnvironment}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Feedback</h3>
        <p className="whitespace-pre-line text-center lg:text-left">
          {careerFeedback.feedback}
        </p>
      </div>
    </div>
  );

  const CareerPathsSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Recommended Career Paths</h3>
      <div className="flex flex-col items-start w-full">
        <ul className="list-none space-y-2 w-full">
          {careerFeedback.recommendedCareers?.map((career, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
              <span className="text-left">{career}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (layout === 'top-images') {
    return <ImagesSection />;
  }

  if (layout === 'split-content') {
    return (
      <>
        {/* Content Column */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-6">Career Recommendations</h2>
          <ContentSection />
        </div>
        {/* Career Paths Column */}
        <div className="w-full lg:w-1/2">
          <CareerPathsSection />
        </div>
      </>
    );
  }

  // Default mobile layout
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <h2 className="text-2xl font-bold">Career Recommendations</h2>
      <div className="space-y-4">
        <ImagesSection />
        <ContentSection />
        <CareerPathsSection />
      </div>
    </div>
  );
};

export default CareerRecommendation;