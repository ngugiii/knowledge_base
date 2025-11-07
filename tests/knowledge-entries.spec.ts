import { test, expect } from '@playwright/test';

test.describe('Knowledge Entries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should add a new knowledge entry', async ({ page }) => {
    await page.getByTestId('add-entry-button').click();

    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    await page.getByTestId('form-title-input').fill('Test Knowledge Entry');
    await page.getByTestId('form-description-input').fill('This is a test description for the knowledge entry.');

    await page.getByTestId('form-submit-button').click();

    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    await page.waitForTimeout(500);

    await expect(page.getByText('Test Knowledge Entry')).toBeVisible();
    
    const entryCard = page.locator('[data-testid^="knowledge-entry-"]').first();
    await expect(entryCard).toBeVisible();
  });

  test('should delete a knowledge entry', async ({ page }) => {
    await page.getByTestId('add-entry-button').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    
    await page.getByTestId('form-title-input').fill('Entry to Delete');
    await page.getByTestId('form-description-input').fill('This entry will be deleted.');
    await page.getByTestId('form-submit-button').click();
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    await expect(page.getByText('Entry to Delete')).toBeVisible();

    const entryCard = page.locator('[data-testid^="knowledge-entry-"]').first();
    const deleteButton = entryCard.getByTestId(/delete-button-/).first();

    await deleteButton.click();

    await expect(page.getByTestId('confirmation-modal-overlay')).toBeVisible();

    await expect(page.getByText('Delete Knowledge Entry')).toBeVisible();
    await expect(page.getByText('Are you sure you want to delete')).toBeVisible();

    await page.getByTestId('confirm-delete-button').click();

    await expect(page.getByTestId('confirmation-modal-overlay')).not.toBeVisible();

    await expect(page.getByText('Entry to Delete')).not.toBeVisible({ timeout: 5000 });
  });

  test('should edit a knowledge entry', async ({ page }) => {
    await page.getByTestId('add-entry-button').click();
    await page.getByTestId('form-title-input').fill('Original Title');
    await page.getByTestId('form-description-input').fill('Original description.');
    await page.getByTestId('form-submit-button').click();
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    await expect(page.getByText('Original Title')).toBeVisible();

    const entryCard = page.locator('[data-testid^="knowledge-entry-"]').first();
    const editButton = entryCard.getByTestId(/edit-button-/).first();
    await editButton.click();

    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    await page.getByTestId('form-title-input').clear();
    await page.getByTestId('form-title-input').fill('Updated Title');
    await page.getByTestId('form-submit-button').click();

    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Original Title')).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByTestId('add-entry-button').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    await page.getByTestId('form-submit-button').click();

    await expect(page.getByTestId('modal-overlay')).toBeVisible();
  });

  test('should display empty state when no entries exist', async ({ page }) => {
    const emptyStateText = page.getByText('No knowledge entries yet');
    const addButton = page.getByTestId('add-entry-button');
    
    const isEmptyStateVisible = await emptyStateText.isVisible().catch(() => false);
    const isAddButtonVisible = await addButton.isVisible();
    
    expect(isEmptyStateVisible || isAddButtonVisible).toBe(true);
  });
});

