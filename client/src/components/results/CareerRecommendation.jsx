// CareerRecommendation.jsx
import React, { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { getCareerFeedback } from '../../data/getCareerFeedback';

const CareerRecommendation = ({ 
  maxSubjectScore, 
  maxPersonalityScore, 
  subjectScore,
  personalityScore,
  layout = 'default' 
}) => {
  const { state } = useContext(QuizContext);
  
  // get career recommendations from feedback database
  const careerFeedback = getCareerFeedback(maxSubjectScore, maxPersonalityScore);

  const ImagesSection = () => (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
        {/* Subject Score Image */}
        <div className="text-center space-y-4">
          <div className="relative">
            <img 
              src={careerFeedback.imagePaths.steam} 
              alt={`${maxSubjectScore} trait`}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Top Subject Score</h3>
            <p className="text-xl text-blue-600">{maxSubjectScore}</p>
            <p className="text-lg">{subjectScore}%</p>
          </div>
        </div>

        {/* Personality Score Image */}
        <div className="text-center space-y-4">
          <div className="relative">
            <img 
              src={careerFeedback.imagePaths.ocean} 
              alt={`${maxPersonalityScore} trait`}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Top Personality Trait</h3>
            <p className="text-xl text-blue-600">{maxPersonalityScore}</p>
            <p className="text-lg">{personalityScore}%</p>
          </div>
        </div>
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

  // Return only images for top-images layout
  if (layout === 'top-images') {
    return <ImagesSection />;
  }

  // Return only content for content-only layout
  if (layout === 'content-only') {
    return <ContentSection />;
  }

  // Return only career paths for career-paths-only layout
  if (layout === 'career-paths-only') {
    return <CareerPathsSection />;
  }

  // Default mobile layout
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="space-y-4">
        <ImagesSection />
        <ContentSection />
        <CareerPathsSection />
      </div>
    </div>
  );
};

export default CareerRecommendation;