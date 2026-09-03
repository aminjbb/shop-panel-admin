export interface ResetDevelopmentDataRequest {
  confirmation: "development-data";
  idempotencyKey: string;
}
