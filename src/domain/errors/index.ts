export class ServerError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ServerError';
  }
}

export class NotFoundError extends ServerError {
  constructor(entity: string) {
    super(`${entity} not found`);

    this.name = 'NotFoundError';
  }
}
