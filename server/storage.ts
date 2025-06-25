import { db } from "./db";
import { 
  users, trades, userMetrics, monthlyPerformance, riskMetrics, auditLogs, aiInsights,
  type User, type InsertUser, type Trade, type InsertTrade, 
  type UserMetrics, type InsertUserMetrics, type MonthlyPerformance, type InsertMonthlyPerformance,
  type RiskMetrics, type InsertRiskMetrics, type AuditLog, type InsertAuditLog,
  type AiInsight, type InsertAiInsight
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trade methods
  getTrades(userId: string, limit?: number, offset?: number): Promise<Trade[]>;
  getTradeById(id: string, userId: string): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, userId: string, updates: Partial<InsertTrade>): Promise<Trade | undefined>;
  deleteTrade(id: string, userId: string): Promise<boolean>;
  
  // Metrics methods
  getUserMetrics(userId: string): Promise<UserMetrics | undefined>;
  getMonthlyPerformance(userId: string): Promise<MonthlyPerformance[]>;
  getRiskMetrics(userId: string): Promise<RiskMetrics[]>;
  
  // Audit and insights methods
  getAuditLogs(userId: string, limit?: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAiInsights(userId: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Trade methods
  async getTrades(userId: string, limit = 50, offset = 0): Promise<Trade[]> {
    return await db.select()
      .from(trades)
      .where(eq(trades.user_id, userId))
      .orderBy(desc(trades.created_at))
      .limit(limit)
      .offset(offset);
  }

  async getTradeById(id: string, userId: string): Promise<Trade | undefined> {
    const result = await db.select()
      .from(trades)
      .where(and(eq(trades.id, id), eq(trades.user_id, userId)))
      .limit(1);
    return result[0];
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const result = await db.insert(trades).values(trade).returning();
    return result[0];
  }

  async updateTrade(id: string, userId: string, updates: Partial<InsertTrade>): Promise<Trade | undefined> {
    const result = await db.update(trades)
      .set({ ...updates, updated_at: sql`now()` })
      .where(and(eq(trades.id, id), eq(trades.user_id, userId)))
      .returning();
    return result[0];
  }

  async deleteTrade(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(trades)
      .where(and(eq(trades.id, id), eq(trades.user_id, userId)))
      .returning();
    return result.length > 0;
  }

  // Metrics methods
  async getUserMetrics(userId: string): Promise<UserMetrics | undefined> {
    const result = await db.select()
      .from(userMetrics)
      .where(eq(userMetrics.user_id, userId))
      .limit(1);
    return result[0];
  }

  async getMonthlyPerformance(userId: string): Promise<MonthlyPerformance[]> {
    return await db.select()
      .from(monthlyPerformance)
      .where(eq(monthlyPerformance.user_id, userId))
      .orderBy(desc(monthlyPerformance.month));
  }

  async getRiskMetrics(userId: string): Promise<RiskMetrics[]> {
    return await db.select()
      .from(riskMetrics)
      .where(eq(riskMetrics.user_id, userId))
      .orderBy(desc(riskMetrics.calc_date));
  }

  // Audit and insights methods
  async getAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    return await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.user_id, userId))
      .orderBy(desc(auditLogs.created_at))
      .limit(limit);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  }

  async getAiInsights(userId: string): Promise<AiInsight[]> {
    return await db.select()
      .from(aiInsights)
      .where(and(
        eq(aiInsights.user_id, userId),
        sql`dismissed_at IS NULL`
      ))
      .orderBy(desc(aiInsights.created_at));
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const result = await db.insert(aiInsights).values(insight).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trades: Map<string, Trade>;
  private userMetrics: Map<string, UserMetrics>;
  private monthlyPerformance: Map<string, MonthlyPerformance[]>;
  private riskMetrics: Map<string, RiskMetrics[]>;
  private auditLogs: Map<string, AuditLog[]>;
  private aiInsights: Map<string, AiInsight[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
    this.userMetrics = new Map();
    this.monthlyPerformance = new Map();
    this.riskMetrics = new Map();
    this.auditLogs = new Map();
    this.aiInsights = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTrades(userId: string, limit = 50, offset = 0): Promise<Trade[]> {
    const userTrades = Array.from(this.trades.values())
      .filter(trade => trade.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
    return userTrades;
  }

  async getTradeById(id: string, userId: string): Promise<Trade | undefined> {
    const trade = this.trades.get(id);
    return trade && trade.user_id === userId ? trade : undefined;
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const id = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newTrade: Trade = {
      ...trade,
      id,
      created_at: now,
      updated_at: now,
    };
    this.trades.set(id, newTrade);
    return newTrade;
  }

  async updateTrade(id: string, userId: string, updates: Partial<InsertTrade>): Promise<Trade | undefined> {
    const trade = this.trades.get(id);
    if (!trade || trade.user_id !== userId) return undefined;
    
    const updatedTrade: Trade = {
      ...trade,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async deleteTrade(id: string, userId: string): Promise<boolean> {
    const trade = this.trades.get(id);
    if (!trade || trade.user_id !== userId) return false;
    
    return this.trades.delete(id);
  }

  async getUserMetrics(userId: string): Promise<UserMetrics | undefined> {
    return this.userMetrics.get(userId);
  }

  async getMonthlyPerformance(userId: string): Promise<MonthlyPerformance[]> {
    return this.monthlyPerformance.get(userId) || [];
  }

  async getRiskMetrics(userId: string): Promise<RiskMetrics[]> {
    return this.riskMetrics.get(userId) || [];
  }

  async getAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    const logs = this.auditLogs.get(userId) || [];
    return logs.slice(0, limit);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = Date.now();
    const newLog: AuditLog = {
      ...log,
      id,
      created_at: new Date().toISOString(),
    };
    
    const userLogs = this.auditLogs.get(log.user_id) || [];
    userLogs.unshift(newLog);
    this.auditLogs.set(log.user_id, userLogs);
    
    return newLog;
  }

  async getAiInsights(userId: string): Promise<AiInsight[]> {
    return this.aiInsights.get(userId) || [];
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newInsight: AiInsight = {
      ...insight,
      id,
      created_at: new Date().toISOString(),
    };
    
    const userInsights = this.aiInsights.get(insight.user_id) || [];
    userInsights.unshift(newInsight);
    this.aiInsights.set(insight.user_id, userInsights);
    
    return newInsight;
  }
}

export const storage = new DatabaseStorage();
