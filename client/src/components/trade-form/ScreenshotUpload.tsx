
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotUploadProps {
  screenshots: string[];
  onScreenshotsChange: (urls: string[]) => void;
}

export const ScreenshotUpload = ({ screenshots, onScreenshotsChange }: ScreenshotUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: "Please upload only image files",
            variant: "destructive"
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please upload images smaller than 10MB",
            variant: "destructive"
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('trade-screenshots')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('trade-screenshots')
          .getPublicUrl(data.path);

        newUrls.push(urlData.publicUrl);
      }

      onScreenshotsChange([...screenshots, ...newUrls]);
      
      if (newUrls.length > 0) {
        toast({
          title: "Success",
          description: `${newUrls.length} screenshot(s) uploaded successfully`
        });
      }
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload screenshots",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeScreenshot = async (urlToRemove: string) => {
    try {
      // Extract file path from URL
      const url = new URL(urlToRemove);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      await supabase.storage
        .from('trade-screenshots')
        .remove([filePath]);

      onScreenshotsChange(screenshots.filter(url => url !== urlToRemove));
      
      toast({
        title: "Success",
        description: "Screenshot removed successfully"
      });
    } catch (error) {
      console.error('Error removing screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to remove screenshot",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Trading Screenshots</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Add Screenshots'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {screenshots.map((url, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={url}
                    alt={`Trade screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeScreenshot(url)}
                    className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {screenshots.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <FileImage className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-2">
              Upload screenshots from TradingView or your broker
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG up to 10MB each
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
