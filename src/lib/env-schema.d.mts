export type EnvScope = "public" | "build";
export type EnvLevel = "ok" | "info" | "warn" | "error";

export interface EnvEntry {
  name: string;
  scope: EnvScope;
  required: boolean;
  secret?: boolean;
  default?: string;
  requiredWith?: string;
  description: string;
  validate?: (value: string) => string | undefined;
}

export interface EnvFinding {
  name: string;
  level: EnvLevel;
  message: string;
}

export interface EnvCheckResult {
  findings: EnvFinding[];
  errors: EnvFinding[];
  warnings: EnvFinding[];
  ok: boolean;
}

export declare const DEFAULT_SITE_URL: string;
export declare const ENV_SCHEMA: EnvEntry[];
export declare function checkEnv(
  source: Record<string, string | undefined> | undefined,
  options?: { includeBuildScope?: boolean },
): EnvCheckResult;
export declare function summarizeEnv(result: EnvCheckResult): string;
