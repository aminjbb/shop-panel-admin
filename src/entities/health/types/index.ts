export interface ServiceHealth {
  status: "ok";
}

export interface ApiHealth {
  status: "ready";
  checks: {
    database: "ok";
  };
}
