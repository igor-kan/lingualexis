'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Book, TrendingUp, Languages, FileText, Download, Upload,
  Globe, MessageCircle, Hash, Clock, Star, BarChart3
} from 'lucide-react';
import { 
  wordDatabase, 
  VocabularyWord, 
  DifficultyLevel, 
  FrequencyLevel,
  PartOfSpeech,
  RegisterLevel,
  EmotionalConnotation 
} from '@/lib/vocabulary';

export default function WordDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const [searchResults, setSearchResults] = useState<VocabularyWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [databaseStats, setDatabaseStats] = useState<any>(null);
  const [mostFrequentWords, setMostFrequentWords] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    // Initialize with most frequent words
    const frequent = wordDatabase.getMostFrequentWords(selectedLanguage, 20);
    setMostFrequentWords(frequent);
    setSearchResults(frequent);

    // Get database statistics
    const stats = wordDatabase.getWordStatistics(selectedLanguage);
    setDatabaseStats(stats);
  }, [selectedLanguage]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(mostFrequentWords);
      return;
    }

    const results = wordDatabase.searchWords(searchQuery, {
      language: selectedLanguage,
      includeEtymology: true,
      includeIdioms: true,
      includePhrases: true
    });
    setSearchResults(results);
  };

  const handleWordSelect = (word: VocabularyWord) => {
    setSelectedWord(word);
  };

  const exportData = (format: 'json' | 'csv' | 'anki') => {
    const data = wordDatabase.exportWords(format, selectedLanguage);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary_${selectedLanguage}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Comprehensive Word Database
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore vocabulary with frequency data, etymology, idioms, and more
          </p>
        </div>

        {/* Search and Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search words, meanings, etymology, idioms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Results */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Words ({searchResults.length})
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('anki')}>
                      <Download className="w-4 h-4 mr-2" />
                      Anki
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {searchResults.map((word) => (
                    <Card 
                      key={word.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedWord?.id === word.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleWordSelect(word)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{word.word}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {word.translation}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {word.pronunciation}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="secondary">
                              Rank #{word.frequency.rank}
                            </Badge>
                            <Badge variant="outline">
                              {word.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {word.categories.slice(0, 3).map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Word Details & Statistics */}
          <div className="space-y-4">
            {/* Database Statistics */}
            {databaseStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Database Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Words:</span>
                    <span className="font-semibold">{databaseStats.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Idioms:</span>
                    <span className="font-semibold">{databaseStats.totalIdioms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Phrases:</span>
                    <span className="font-semibold">{databaseStats.totalPhrases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Collocations:</span>
                    <span className="font-semibold">{databaseStats.totalCollocations}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-2">Etymology Origins</h4>
                    {Object.entries(databaseStats.etymologyOrigins).slice(0, 3).map(([origin, count]) => (
                      <div key={origin} className="flex justify-between text-sm">
                        <span>{origin}:</span>
                        <span>{count as number}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Word Details */}
            {selectedWord && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Word Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="frequency">Frequency</TabsTrigger>
                      <TabsTrigger value="etymology">Etymology</TabsTrigger>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-3 mt-4">
                      <div>
                        <h3 className="font-bold text-2xl">{selectedWord.word}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedWord.translation}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          /{selectedWord.pronunciation}/
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">Part of Speech</Label>
                          <p className="font-medium">{selectedWord.partOfSpeech}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Difficulty</Label>
                          <p className="font-medium capitalize">{selectedWord.difficulty}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">Categories</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedWord.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedWord.synonyms.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Synonyms</Label>
                          <p className="text-sm">{selectedWord.synonyms.join(', ')}</p>
                        </div>
                      )}

                      {selectedWord.antonyms.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Antonyms</Label>
                          <p className="text-sm">{selectedWord.antonyms.join(', ')}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="frequency" className="space-y-3 mt-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500">Frequency Rank</Label>
                          <p className="font-bold text-lg">#{selectedWord.frequency.rank}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Writing Frequency</Label>
                          <p className="font-medium">{selectedWord.frequency.writingFrequency} per million</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Speech Frequency</Label>
                          <p className="font-medium">{selectedWord.frequency.speechFrequency} per million</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Frequency Level</Label>
                          <Badge variant="secondary" className="capitalize">
                            {selectedWord.frequency.level}
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="etymology" className="space-y-3 mt-4">
                      {selectedWord.etymology ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">Origin</Label>
                            <p className="font-medium">{selectedWord.etymology.origin}</p>
                          </div>
                          {selectedWord.etymology.originalForm && (
                            <div>
                              <Label className="text-xs text-gray-500">Original Form</Label>
                              <p className="font-medium">{selectedWord.etymology.originalForm}</p>
                            </div>
                          )}
                          <div>
                            <Label className="text-xs text-gray-500">Meaning Evolution</Label>
                            <p className="text-sm">{selectedWord.etymology.meaningEvolution}</p>
                          </div>
                          {selectedWord.etymology.firstKnownUse && (
                            <div>
                              <Label className="text-xs text-gray-500">First Known Use</Label>
                              <p className="font-medium">{selectedWord.etymology.firstKnownUse}</p>
                            </div>
                          )}
                          {selectedWord.etymology.relatedWords && selectedWord.etymology.relatedWords.length > 0 && (
                            <div>
                              <Label className="text-xs text-gray-500">Related Words</Label>
                              <p className="text-sm">{selectedWord.etymology.relatedWords.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No etymology data available</p>
                      )}
                    </TabsContent>

                    <TabsContent value="usage" className="space-y-3 mt-4">
                      {selectedWord.examples.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Examples</Label>
                          {selectedWord.examples.map((example, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mt-2">
                              <p className="font-medium text-sm">{example.sentence}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {example.translation}
                              </p>
                              {example.context && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {example.context}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedWord.idioms.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Idioms</Label>
                          {selectedWord.idioms.map((idiom) => (
                            <div key={idiom.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-2">
                              <p className="font-medium text-sm">{idiom.phrase}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {idiom.meaning}
                              </p>
                              <p className="text-xs font-medium mt-1">"{idiom.example}"</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedWord.phrases.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Phrases</Label>
                          {selectedWord.phrases.map((phrase) => (
                            <div key={phrase.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mt-2">
                              <p className="font-medium text-sm">{phrase.phrase}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {phrase.meaning}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {phrase.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {phrase.register}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedWord.collocations.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500">Collocations</Label>
                          {selectedWord.collocations.map((collocation) => (
                            <div key={collocation.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md mt-2">
                              <p className="font-medium text-sm">{collocation.phrase}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {collocation.translation}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {collocation.type} strength
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {collocation.frequency} freq
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}