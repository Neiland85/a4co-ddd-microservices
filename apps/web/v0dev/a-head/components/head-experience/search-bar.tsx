'use client';

import * as React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundEffects } from '../../hooks/use-sound-effects';
import type { SearchResult } from '../../types/head-experience-types';

interface SearchBarProps {
  readonly onSearch: (query: string) => void;
  readonly placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar productos...',
}: Readonly<SearchBarProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playClick, playHover } = useSoundEffects();

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Ochío Tradicional de Jaén',
      type: 'product',
      url: '/productos/ochio-tradicional',
      description: 'Pan artesanal tradicional',
    },
    {
      id: '2',
      title: 'Aceite de Oliva Virgen Extra',
      type: 'product',
      url: '/productos/aceite-oliva',
      description: 'Aceite premium de olivas seleccionadas',
    },
    {
      id: '3',
      title: 'Queso de Cabra Artesanal',
      type: 'product',
      url: '/productos/queso-cabra',
      description: 'Queso cremoso de cabras locales',
    },
    {
      id: '4',
      title: 'Catálogo de Productos',
      type: 'page',
      url: '/catalogo',
      description: 'Explora todos nuestros productos',
    },
  ];

  const trendingSearches = ['ochío', 'aceite oliva', 'queso artesanal', 'jamón ibérico'];

  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          result =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);

      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent-searches', JSON.stringify(updated));

      setIsOpen(false);
      setQuery('');
      playClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const openSearch = () => {
    setIsOpen(true);
    playClick();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Helper functions to render different content sections
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="border-a4co-olive-600 h-6 w-6 animate-spin rounded-full border-b-2"></div>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="space-y-1">
          <h3 className="mb-3 text-sm font-medium text-gray-600">Resultados</h3>
          {results.map((result, index) => (
            <motion.button
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSearch(result.title)}
              onMouseEnter={() => playHover()}
              className="hover:bg-a4co-olive-50 flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors"
            >
              <Search className="text-a4co-olive-600 mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-900">{result.title}</div>
                {result.description && (
                  <div className="truncate text-sm text-gray-600">{result.description}</div>
                )}
                <div className="text-a4co-olive-600 text-xs capitalize">{result.type}</div>
              </div>
            </motion.button>
          ))}
        </div>
      );
    }

    return (
      <div className="py-8 text-center text-gray-500">
        No se encontraron resultados para "{query}"
      </div>
    );
  };

  const renderSuggestions = () => {
    return (
      <div className="space-y-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600">
              <Clock className="h-4 w-4" />
              Búsquedas recientes
            </h3>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSearch(search)}
                  onMouseEnter={() => playHover()}
                  className="hover:bg-a4co-olive-50 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600">
            <TrendingUp className="h-4 w-4" />
            Búsquedas populares
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((trend, index) => (
              <motion.button
                key={trend}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSearch(trend)}
                onMouseEnter={() => playHover()}
                className="bg-a4co-olive-100 text-a4co-olive-700 hover:bg-a4co-olive-200 rounded-full px-3 py-1.5 text-sm transition-colors"
              >
                {trend}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (query.length > 2) {
      return (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          {renderSearchResults()}
        </motion.div>
      );
    }

    return (
      <motion.div
        key="suggestions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        {renderSuggestions()}
      </motion.div>
    );
  };

  return (
    <>
      <Button
        onClick={openSearch}
        onMouseEnter={() => playHover()}
        className="hover:bg-a4co-olive-50 h-9 border-none bg-transparent px-3 transition-colors"
        aria-label="Abrir búsqueda"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Search className="text-a4co-olive-600 h-4 w-4" />
          <span className="hidden text-sm text-gray-600 sm:inline">Buscar...</span>
        </motion.div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-a4co-olive-200 max-w-2xl bg-white/95 p-0 backdrop-blur-sm">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="sr-only">Búsqueda</DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 pt-0"
          >
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="border-a4co-olive-200 focus:border-a4co-olive-400 h-12 pl-10 pr-10 text-lg"
              />
              {query && (
                <Button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 transform border-none bg-transparent p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            <AnimatePresence mode="wait">{renderMainContent()}</AnimatePresence>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
