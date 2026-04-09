export type Nullable<T> = T | null;

export class DatabaseConnectionError extends Error {
  constructor(message = "Database connection is unavailable.") {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}
