import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradeSchema, insertAuditLogSchema, insertAiInsightSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for now - in a real app this would come from authentication
  const MOCK_USER_ID = "user_123";

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const trades = await storage.getTrades(MOCK_USER_ID, limit, offset);
      res.json(trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  app.get("/api/trades/:id", async (req, res) => {
    try {
      const trade = await storage.getTradeById(req.params.id, MOCK_USER_ID);
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      console.error("Error fetching trade:", error);
      res.status(500).json({ error: "Failed to fetch trade" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const validatedData = insertTradeSchema.parse({
        ...req.body,
        user_id: MOCK_USER_ID
      });
      
      const trade = await storage.createTrade(validatedData);
      
      // Log audit event
      await storage.createAuditLog({
        user_id: MOCK_USER_ID,
        action_type: "CREATE",
        resource_type: "trade",
        resource_id: trade.id,
        new_values: trade
      });
      
      res.status(201).json(trade);
    } catch (error) {
      console.error("Error creating trade:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid trade data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create trade" });
    }
  });

  app.put("/api/trades/:id", async (req, res) => {
    try {
      const updates = insertTradeSchema.partial().parse(req.body);
      const trade = await storage.updateTrade(req.params.id, MOCK_USER_ID, updates);
      
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }
      
      // Log audit event
      await storage.createAuditLog({
        user_id: MOCK_USER_ID,
        action_type: "UPDATE",
        resource_type: "trade",
        resource_id: trade.id,
        new_values: trade
      });
      
      res.json(trade);
    } catch (error) {
      console.error("Error updating trade:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid trade data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update trade" });
    }
  });

  app.delete("/api/trades/:id", async (req, res) => {
    try {
      const success = await storage.deleteTrade(req.params.id, MOCK_USER_ID);
      
      if (!success) {
        return res.status(404).json({ error: "Trade not found" });
      }
      
      // Log audit event
      await storage.createAuditLog({
        user_id: MOCK_USER_ID,
        action_type: "DELETE",
        resource_type: "trade",
        resource_id: req.params.id
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting trade:", error);
      res.status(500).json({ error: "Failed to delete trade" });
    }
  });

  // Metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getUserMetrics(MOCK_USER_ID);
      res.json(metrics || {
        user_id: MOCK_USER_ID,
        total_pnl: "0",
        win_rate: "0",
        avg_risk_reward: "0",
        total_trades: 0,
        winning_trades: 0,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/monthly-performance", async (req, res) => {
    try {
      const performance = await storage.getMonthlyPerformance(MOCK_USER_ID);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching monthly performance:", error);
      res.status(500).json({ error: "Failed to fetch monthly performance" });
    }
  });

  app.get("/api/risk-metrics", async (req, res) => {
    try {
      const riskMetrics = await storage.getRiskMetrics(MOCK_USER_ID);
      res.json(riskMetrics);
    } catch (error) {
      console.error("Error fetching risk metrics:", error);
      res.status(500).json({ error: "Failed to fetch risk metrics" });
    }
  });

  // Audit and insights routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getAuditLogs(MOCK_USER_ID, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/ai-insights", async (req, res) => {
    try {
      const insights = await storage.getAiInsights(MOCK_USER_ID);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ error: "Failed to fetch AI insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const validatedData = insertAiInsightSchema.parse({
        ...req.body,
        user_id: MOCK_USER_ID
      });
      
      const insight = await storage.createAiInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      console.error("Error creating AI insight:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid insight data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create AI insight" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
