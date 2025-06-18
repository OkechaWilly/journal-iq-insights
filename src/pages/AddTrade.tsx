
import React, { useState } from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus } from "lucide-react";
import { TradeEntryForm } from '@/components/trade-form/TradeEntryForm';
import { EmotionalStateSelector } from '@/components/trade-form/EmotionalStateSelector';
import { TradeOutcomeAnalyzer } from '@/components/trade-form/TradeOutcomeAnalyzer';
import { ScreenshotUpload } from '@/components/trade-form/ScreenshotUpload';
import { useTradeValidation } from '@/hooks/useTradeValidation';
import { useTrades } from '@/hooks/useTrades';
import { useNavigate } from 'react-router-dom';

const AddTrade = () => {
  const [formData, setFormData] = useState({
    symbol: "",
    direction: "",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    emotionalState: "",
    notes: "",
    tags: "",
    screenshots: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  
  const { errors, validateTrade } = useTradeValidation();
  const { addTrade } = useTrades();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotsChange = (screenshots: string[]) => {
    setFormData(prev => ({ ...prev, screenshots }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTrade(formData)) {
      return;
    }
    
    setLoading(true);
    
    try {
      await addTrade({
        symbol: formData.symbol.toUpperCase(),
        entry_price: parseFloat(formData.entryPrice),
        exit_price: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
        quantity: parseFloat(formData.quantity),
        direction: formData.direction as 'long' | 'short',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
        emotional_state: formData.emotionalState || undefined,
        notes: formData.notes || undefined,
        screenshot_url: formData.screenshots.length > 0 ? formData.screenshots[0] : undefined,
      });
      
      // Reset form
      setFormData({
        symbol: "",
        direction: "",
        quantity: "",
        entryPrice: "",
        exitPrice: "",
        emotionalState: "",
        notes: "",
        tags: "",
        screenshots: []
      });
      
      navigate('/trade-log');
    } catch (error) {
      console.error('Failed to add trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Add Trade</h2>
            <p className="text-slate-400">Log a new trade with screenshots and detailed analysis.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Trade Details</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter the core details of your trade execution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TradeEntryForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    errors={errors}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Trading Screenshots</CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload screenshots from TradingView or your trading platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScreenshotUpload
                    screenshots={formData.screenshots}
                    onScreenshotsChange={handleScreenshotsChange}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Additional Information</CardTitle>
                  <CardDescription className="text-slate-400">
                    Emotional state and notes about your trade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EmotionalStateSelector
                    value={formData.emotionalState}
                    onChange={(value) => handleInputChange("emotionalState", value)}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., breakout, earnings, technical"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white">Trade Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add your trade analysis, setup reasoning, market conditions, etc..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={4}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <TradeOutcomeAnalyzer formData={formData} />
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="gap-2 bg-green-600 hover:bg-green-700" 
                      disabled={loading}
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Trade'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddTrade;
