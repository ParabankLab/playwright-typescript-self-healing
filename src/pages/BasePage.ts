import { Page } from '@playwright/test';
import { SelfHealingWrapper } from '../utils/SelfHealingWrapper';

export class BasePage {
  protected page: Page;
  protected healing: SelfHealingWrapper;

  constructor(page: Page) {
    this.page = page;
    this.healing = new SelfHealingWrapper(page);
  }
}