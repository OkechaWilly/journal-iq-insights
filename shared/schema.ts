import { pgTable, text, serial, integer, boolean, uuid, decimal, timestamp, date, bigserial, jsonb, inet } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const trades = pgTable("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  symbol: text("symbol").notNull(),
  entry_price: decimal("entry_price", { precision: 12, scale: 4 }).notNull(),
  exit_price: decimal("exit_price", { precision: 12, scale: 4 }),
  quantity: decimal("quantity", { precision: 12, scale: 4 }).notNull(),
  direction: text("direction").notNull(), // 'long' | 'short'
  tags: text("tags").array(),
  emotional_state: text("emotional_state"),
  notes: text("notes"),
  screenshot_url: text("screenshot_url"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const userMetrics = pgTable("user_metrics", {
  user_id: uuid("user_id").primaryKey(),
  total_pnl: decimal("total_pnl", { precision: 12, scale: 2 }).default("0"),
  win_rate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  avg_risk_reward: decimal("avg_risk_reward", { precision: 8, scale: 4 }).default("0"),
  total_trades: integer("total_trades").default(0),
  winning_trades: integer("winning_trades").default(0),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const monthlyPerformance = pgTable("monthly_performance", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  month: date("month").notNull(),
  total_trades: integer("total_trades").default(0),
  winning_trades: integer("winning_trades").default(0),
  total_pnl: decimal("total_pnl", { precision: 12, scale: 2 }).default("0"),
  avg_pnl: decimal("avg_pnl", { precision: 12, scale: 2 }).default("0"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const riskMetrics = pgTable("risk_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  calc_date: date("calc_date").notNull().defaultNow(),
  var_95: decimal("var_95", { precision: 12, scale: 4 }),
  expected_shortfall: decimal("expected_shortfall", { precision: 12, scale: 4 }),
  risk_of_ruin: decimal("risk_of_ruin", { precision: 8, scale: 4 }),
  sharpe_ratio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),
  sortino_ratio: decimal("sortino_ratio", { precision: 8, scale: 4 }),
  max_drawdown: decimal("max_drawdown", { precision: 8, scale: 4 }),
  volatility: decimal("volatility", { precision: 8, scale: 4 }),
  beta: decimal("beta", { precision: 8, scale: 4 }),
  alpha: decimal("alpha", { precision: 8, scale: 4 }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: uuid("user_id").notNull(),
  action_type: text("action_type").notNull(),
  resource_type: text("resource_type").notNull(),
  resource_id: uuid("resource_id"),
  old_values: jsonb("old_values"),
  new_values: jsonb("new_values"),
  ip_address: inet("ip_address"),
  user_agent: text("user_agent"),
  session_id: text("session_id"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  insight_type: text("insight_type").notNull(), // 'pattern' | 'risk-warning' | 'opportunity'
  confidence_score: decimal("confidence_score", { precision: 3, scale: 2 }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionable_data: jsonb("actionable_data"),
  trades_analyzed: integer("trades_analyzed"),
  valid_until: timestamp("valid_until", { withTimezone: true, mode: "string" }),
  dismissed_at: timestamp("dismissed_at", { withTimezone: true, mode: "string" }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserMetricsSchema = createInsertSchema(userMetrics);
export const insertMonthlyPerformanceSchema = createInsertSchema(monthlyPerformance).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertRiskMetricsSchema = createInsertSchema(riskMetrics).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  created_at: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  created_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertUserMetrics = z.infer<typeof insertUserMetricsSchema>;
export type UserMetrics = typeof userMetrics.$inferSelect;
export type InsertMonthlyPerformance = z.infer<typeof insertMonthlyPerformanceSchema>;
export type MonthlyPerformance = typeof monthlyPerformance.$inferSelect;
export type InsertRiskMetrics = z.infer<typeof insertRiskMetricsSchema>;
export type RiskMetrics = typeof riskMetrics.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
