export abstract class ServerError extends Error {}

export class NotFoundError extends ServerError {
  constructor(entity: string) {
    super(`${entity} not found`);

    this.name = 'NotFoundError';
  }
}
