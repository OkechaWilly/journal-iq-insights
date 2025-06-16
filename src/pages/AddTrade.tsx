
import React, { useState } from "react";
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTrades } from '@/hooks/useTrades';
import { useNavigate } from 'react-router-dom';

const AddTrade = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    symbol: "",
    direction: "",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    emotionalState: "",
    notes: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  
  const { addTrade } = useTrades();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        tags: ""
      });
      setDate(undefined);
      
      navigate('/trade-log');
    } catch (error) {
      console.error('Failed to add trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Trade</h2>
            <p className="text-gray-600">Log a new trade into your journal with detailed information.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
              <CardDescription>Enter the details of your trade execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, EURUSD"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange("symbol", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">Direction *</Label>
                  <Select onValueChange={(value) => handleInputChange("direction", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Long/Short" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.0001"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price *</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.0001"
                    placeholder="150.25"
                    value={formData.entryPrice}
                    onChange={(e) => handleInputChange("entryPrice", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.0001"
                    placeholder="155.75"
                    value={formData.exitPrice}
                    onChange={(e) => handleInputChange("exitPrice", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotionalState">Emotional State</Label>
                  <Select onValueChange={(value) => handleInputChange("emotionalState", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="nervous">Nervous</SelectItem>
                      <SelectItem value="excited">Excited</SelectItem>
                      <SelectItem value="fearful">Fearful</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="greedy">Greedy</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., breakout, earnings, technical"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Trade Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add your trade analysis, setup reasoning, market conditions, etc..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700" disabled={loading}>
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Trade'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default AddTrade;
