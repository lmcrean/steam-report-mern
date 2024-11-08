export async function startQuiz(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  await page.getByPlaceholder('Enter your username').fill('TestUser');
  await page.getByRole('button', { name: 'Continue' }).click();
}
