export async function completePersonalitySection(page, answers) {
  // Complete all personality questions
  for (const trait of Object.keys(answers)) {
    for (const answer of answers[trait]) {
      await page.getByRole('radio', { name: String(answer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
  
  // Wait for either the tie breaker screen OR the subject quiz screen
  try {
    const [tieBreaker, subjectQuiz] = await Promise.race([
      Promise.all([
        page.waitForSelector('h2:has-text("We Found a Tie!")', { timeout: 2000 }),
        Promise.resolve(null)
      ]),
      Promise.all([
        Promise.resolve(null),
        page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { timeout: 2000 })
      ])
    ]);

    if (tieBreaker) {

      return;
    } else if (subjectQuiz) {

      return;
    }
  } catch (error) {
    console.error('❌ Failed to detect next screen after personality section');
    throw new Error('Quiz failed to transition properly after personality section');
  }
}
