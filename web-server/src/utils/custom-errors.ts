/**
 * 400 Bad Request error handler
 */
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * 401 Unauthorized error handler
 */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * 403 Forbidden error handler
 */
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * 404 Not Found error handler
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
