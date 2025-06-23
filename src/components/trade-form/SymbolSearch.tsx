
import React, { useState, useRef, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SymbolSearchProps {
  value: string;
  onChange: (symbol: string) => void;
  onSelect?: (symbol: string) => void;
}

const POPULAR_SYMBOLS = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT', 'NVDA', 'META', 'SPY', 'QQQ', 'IWM'];

export const SymbolSearch: React.FC<SymbolSearchProps> = ({ value, onChange, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteSymbols');
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSymbols = [...new Set([...favorites, ...POPULAR_SYMBOLS])]
    .filter(symbol => symbol.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 10);

  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter(s => s !== symbol)
      : [...favorites, symbol];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteSymbols', JSON.stringify(newFavorites));
  };

  const handleSelect = (symbol: string) => {
    onChange(symbol);
    onSelect?.(symbol);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search symbol (e.g., AAPL)"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => setIsOpen(true)}
          className="pl-10 bg-slate-800 border-slate-600 text-white"
        />
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 bg-slate-800 border-slate-600 max-h-60 overflow-y-auto">
          <div className="p-2">
            {filteredSymbols.length > 0 ? (
              filteredSymbols.map((symbol) => (
                <div
                  key={symbol}
                  className="flex items-center justify-between p-2 hover:bg-slate-700 rounded cursor-pointer"
                  onClick={() => handleSelect(symbol)}
                >
                  <span className="text-white font-mono">{symbol}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(symbol);
                    }}
                    className="p-1 h-auto"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.includes(symbol)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-400'
                      }`}
                    />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-2 text-slate-400 text-center">
                No symbols found
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
