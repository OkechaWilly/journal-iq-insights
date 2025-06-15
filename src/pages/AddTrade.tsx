
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
import { CalendarIcon, Save, Plus, Camera, Image, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AddTrade = () => {
  const [date, setDate] = useState<Date>();
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    symbol: "",
    type: "",
    side: "",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    stopLoss: "",
    takeProfit: "",
    commission: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newScreenshots = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      setScreenshots(prev => [...prev, ...newScreenshots]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trade data:", { ...formData, date, screenshots });
    // Add trade submission logic here
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
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, EURUSD"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange("symbol", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Trade Type</Label>
                  <Select onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="side">Side</Label>
                  <Select onValueChange={(value) => handleInputChange("side", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Buy/Sell" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy (Long)</SelectItem>
                      <SelectItem value="sell">Sell (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Trade Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    placeholder="150.25"
                    value={formData.entryPrice}
                    onChange={(e) => handleInputChange("entryPrice", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.01"
                    placeholder="155.75"
                    value={formData.exitPrice}
                    onChange={(e) => handleInputChange("exitPrice", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    placeholder="145.00"
                    value={formData.stopLoss}
                    onChange={(e) => handleInputChange("stopLoss", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.01"
                    placeholder="160.00"
                    value={formData.takeProfit}
                    onChange={(e) => handleInputChange("takeProfit", e.target.value)}
                  />
                </div>
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

              {/* Screenshots Section */}
              <div className="space-y-4">
                <Label>Screenshots</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="flex justify-center space-x-2 mb-4">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload screenshots of your trade setup, charts, or analysis
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('screenshot-upload')?.click()}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Screenshots
                    </Button>
                  </div>
                </div>

                {/* Screenshot Preview */}
                {screenshots.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(screenshot)}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {screenshot.name.split('.')[0].substring(0, 10)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                  Save Trade
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
