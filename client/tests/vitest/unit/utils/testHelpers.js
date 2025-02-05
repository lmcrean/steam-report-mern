import { vi } from 'vitest';

export const createMockPage = () => ({
  waitForSelector: vi.fn().mockResolvedValue(true),
  waitForLoadState: vi.fn().mockResolvedValue(undefined),
  waitForTimeout: vi.fn().mockResolvedValue(undefined),
  getByRole: vi.fn(),
  locator: vi.fn(),
  $$: vi.fn(),
  $: vi.fn(),
  $$eval: vi.fn(),
  $eval: vi.fn(),
  evaluate: vi.fn(),
  screenshot: vi.fn(),
  content: vi.fn(),
  url: vi.fn().mockReturnValue('http://localhost:3000/quiz'),
});

export const mockTestCase = {
  personalityAnswers: {
    trait1: [5, 5, 5, 5, 5],
    trait2: [4, 4, 4, 4, 4],
    trait3: [3, 3, 3, 3, 3]
  },
  subjectAnswers: {
    subject1: [true, true, true, false, false],
    subject2: [true, true, false, false, false],
    subject3: [true, false, false, false, false]
  },
  preferredTrait: 'trait1',
  preferredSubject: 'subject1',
  topScores: 'subject1 and trait1'
}; 