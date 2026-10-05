import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function logAudit(action: string, metadata: Record<string, unknown>) {
  logger.info({
    type: "AUDIT_LOG",
    action,
    ...metadata,
  });
}
