export class SurvivorNotFoundError extends Error {
  constructor() {
    super('Survivor not found');

    this.name = 'SurvivorNotFoundError';
  }
}
