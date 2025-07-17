/**
 * Vocabulary management system with categorization and difficulty assessment
 */

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  pronunciation?: string;
  partOfSpeech: PartOfSpeech;
  difficulty: DifficultyLevel;
  frequency: FrequencyLevel;
  categories: string[];
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  notes?: string;
  isFavorite: boolean;
  dateAdded: Date;
  dateModified: Date;
  audioUrl?: string;
  imageUrl?: string;
}

export interface Example {
  sentence: string;
  translation: string;
  context?: string;
}

export type PartOfSpeech = 
  | 'noun' 
  | 'verb' 
  | 'adjective' 
  | 'adverb' 
  | 'pronoun' 
  | 'preposition' 
  | 'conjunction' 
  | 'interjection'
  | 'article'
  | 'phrase';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';
export type FrequencyLevel = 'very-common' | 'common' | 'uncommon' | 'rare';

export interface VocabularySet {
  id: string;
  name: string;
  description: string;
  language: string;
  words: string[]; // Word IDs
  isPublic: boolean;
  createdBy: string;
  dateCreated: Date;
  tags: string[];
}

export interface StudyProgress {
  wordId: string;
  userId: string;
  status: 'new' | 'learning' | 'familiar' | 'mastered';
  correctAnswers: number;
  totalAttempts: number;
  averageResponseTime: number;
  lastStudied: Date;
  nextReview: Date;
  difficultyOverride?: DifficultyLevel;
}

export const allPartsOfSpeech: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection',
  'article',
  'phrase',
];

// Default vocabulary data for different languages
export const defaultVocabulary: { [key: string]: Partial<VocabularyWord>[] } = {
  spanish: [
    {
      word: 'Hola',
      translation: 'Hello',
      pronunciation: 'OH-lah',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: 'very-common',
      categories: ['greetings', 'basic'],
      examples: [
        { sentence: 'Hola, ¿cómo estás?', translation: 'Hello, how are you?' }
      ]
    },
    {
      word: 'Gracias',
      translation: 'Thank you',
      pronunciation: 'GRAH-see-ahs',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: 'very-common',
      categories: ['politeness', 'basic'],
      examples: [
        { sentence: 'Gracias por tu ayuda', translation: 'Thank you for your help' }
      ]
    },
    {
      word: 'Casa',
      translation: 'House',
      pronunciation: 'KAH-sah',
      partOfSpeech: 'noun',
      difficulty: 'beginner',
      frequency: 'very-common',
      categories: ['home', 'nouns'],
      examples: [
        { sentence: 'Mi casa es grande', translation: 'My house is big' }
      ]
    },
    {
      word: 'Hermoso',
      translation: 'Beautiful',
      pronunciation: 'er-MOH-soh',
      partOfSpeech: 'adjective',
      difficulty: 'intermediate',
      frequency: 'common',
      categories: ['adjectives', 'appearance'],
      examples: [
        { sentence: 'Qué día tan hermoso', translation: 'What a beautiful day' }
      ],
      synonyms: ['bello', 'precioso', 'lindo']
    },
    {
      word: 'Responsabilidad',
      translation: 'Responsibility',
      pronunciation: 'res-pon-sah-bee-lee-DAHD',
      partOfSpeech: 'noun',
      difficulty: 'advanced',
      frequency: 'common',
      categories: ['abstract', 'formal'],
      examples: [
        { sentence: 'Es tu responsabilidad estudiar', translation: 'It is your responsibility to study' }
      ]
    }
  ],
  french: [
    {
      word: 'Bonjour',
      translation: 'Hello',
      pronunciation: 'bon-ZHOOR',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: 'very-common',
      categories: ['greetings', 'basic'],
      examples: [
        { sentence: 'Bonjour, comment allez-vous?', translation: 'Hello, how are you?' }
      ]
    },
    {
      word: 'Merci',
      translation: 'Thank you',
      pronunciation: 'mer-SEE',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: 'very-common',
      categories: ['politeness', 'basic'],
      examples: [
        { sentence: 'Merci beaucoup', translation: 'Thank you very much' }
      ]
    },
    {
      word: 'Magnifique',
      translation: 'Magnificent',
      pronunciation: 'mah-nee-FEEK',
      partOfSpeech: 'adjective',
      difficulty: 'intermediate',
      frequency: 'common',
      categories: ['adjectives', 'appearance'],
      examples: [
        { sentence: 'C\'est magnifique!', translation: 'It\'s magnificent!' }
      ],
      synonyms: ['beau', 'splendide', 'superbe']
    }
  ]
};

/**
 * Create a new vocabulary word with default values
 */
export function createVocabularyWord(
  data: Partial<VocabularyWord> & { word: string; translation: string; language: string }
): VocabularyWord {
  const now = new Date();
  
  return {
    id: generateId(),
    categories: [],
    examples: [],
    synonyms: [],
    antonyms: [],
    isFavorite: false,
    dateAdded: now,
    dateModified: now,
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    frequency: 'common',
    ...data,
  };
}

/**
 * Filter vocabulary by various criteria
 */
export function filterVocabulary(
  words: VocabularyWord[],
  filters: {
    language?: string;
    difficulty?: DifficultyLevel[];
    partOfSpeech?: PartOfSpeech[];
    categories?: string[];
    favorites?: boolean;
    search?: string;
  }
): VocabularyWord[] {
  return words.filter(word => {
    if (filters.language && word.language !== filters.language) return false;
    if (filters.difficulty && !filters.difficulty.includes(word.difficulty)) return false;
    if (filters.partOfSpeech && !filters.partOfSpeech.includes(word.partOfSpeech)) return false;
    if (filters.categories && !filters.categories.some(cat => word.categories.includes(cat))) return false;
    if (filters.favorites && !word.isFavorite) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        word.word.toLowerCase().includes(searchLower) ||
        word.translation.toLowerCase().includes(searchLower) ||
        word.categories.some(cat => cat.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });
}

/**
 * Sort vocabulary by different criteria
 */
export function sortVocabulary(
  words: VocabularyWord[],
  sortBy: 'alphabetical' | 'difficulty' | 'frequency' | 'dateAdded' | 'random'
): VocabularyWord[] {
  const sorted = [...words];
  
  switch (sortBy) {
    case 'alphabetical':
      return sorted.sort((a, b) => a.word.localeCompare(b.word));
    
    case 'difficulty':
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2, native: 3 };
      return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    
    case 'frequency':
      const frequencyOrder = { 'very-common': 0, common: 1, uncommon: 2, rare: 3 };
      return sorted.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]);
    
    case 'dateAdded':
      return sorted.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
    
    case 'random':
      return sorted.sort(() => Math.random() - 0.5);
    
    default:
      return sorted;
  }
}

/**
 * Get all unique categories from vocabulary
 */
export function getCategories(words: VocabularyWord[]): string[] {
  const categories = new Set<string>();
  words.forEach(word => {
    word.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
}

/**
 * Get vocabulary statistics
 */
export function getVocabularyStats(words: VocabularyWord[]): {
  total: number;
  byDifficulty: { [key in DifficultyLevel]: number };
  byPartOfSpeech: { [key in PartOfSpeech]: number };
  byFrequency: { [key in FrequencyLevel]: number };
  favorites: number;
  recentlyAdded: number; // Last 7 days
} {
  const stats = {
    total: words.length,
    byDifficulty: { beginner: 0, intermediate: 0, advanced: 0, native: 0 },
    byPartOfSpeech: allPartsOfSpeech.reduce((acc, part) => ({ ...acc, [part]: 0 }), {}) as { [key in PartOfSpeech]: number },
    byFrequency: { 'very-common': 0, common: 0, uncommon: 0, rare: 0 },
    favorites: 0,
    recentlyAdded: 0,
  };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  words.forEach(word => {
    stats.byDifficulty[word.difficulty]++;
    stats.byPartOfSpeech[word.partOfSpeech] = (stats.byPartOfSpeech[word.partOfSpeech] || 0) + 1;
    stats.byFrequency[word.frequency]++;
    
    if (word.isFavorite) stats.favorites++;
    if (word.dateAdded >= sevenDaysAgo) stats.recentlyAdded++;
  });

  return stats;
}

/**
 * Suggest related words based on categories and difficulty
 */
export function suggestRelatedWords(
  targetWord: VocabularyWord,
  allWords: VocabularyWord[],
  limit: number = 5
): VocabularyWord[] {
  const suggestions = allWords
    .filter(word => word.id !== targetWord.id)
    .map(word => {
      let score = 0;
      
      // Same category bonus
      const commonCategories = word.categories.filter(cat => 
        targetWord.categories.includes(cat)
      ).length;
      score += commonCategories * 3;
      
      // Similar difficulty bonus
      const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'native'];
      const targetDiffIndex = difficultyLevels.indexOf(targetWord.difficulty);
      const wordDiffIndex = difficultyLevels.indexOf(word.difficulty);
      const difficultyDistance = Math.abs(targetDiffIndex - wordDiffIndex);
      score += Math.max(0, 2 - difficultyDistance);
      
      // Same part of speech bonus
      if (word.partOfSpeech === targetWord.partOfSpeech) score += 1;
      
      return { word, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.word);

  return suggestions;
}

/**
 * Import vocabulary from various formats
 */
export function importFromCSV(csvText: string, language: string): VocabularyWord[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const words: VocabularyWord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const wordData: Partial<VocabularyWord> = { language };
    
    headers.forEach((header, index) => {
      if (values[index]) {
        switch (header.toLowerCase()) {
          case 'word':
            wordData.word = values[index];
            break;
          case 'translation':
            wordData.translation = values[index];
            break;
          case 'pronunciation':
            wordData.pronunciation = values[index];
            break;
          case 'part of speech':
          case 'pos':
            wordData.partOfSpeech = values[index] as PartOfSpeech;
            break;
          case 'difficulty':
            wordData.difficulty = values[index] as DifficultyLevel;
            break;
          case 'categories':
            wordData.categories = values[index].split(';').map(c => c.trim());
            break;
        }
      }
    });
    
    if (wordData.word && wordData.translation) {
      words.push(createVocabularyWord(wordData as { word: string; translation: string; language: string }));
    }
  }
  
  return words;
}

/**
 * Export vocabulary to CSV format
 */
export function exportToCSV(words: VocabularyWord[]): string {
  const headers = ["id", "word", "translation", "language", "pronunciation", "partOfSpeech", "difficulty", "frequency", "categories", "examples", "synonyms", "antonyms", "etymology", "notes", "isFavorite", "dateAdded", "dateModified", "audioUrl", "imageUrl"];
  const rows = words.map(word => {
    const values = headers.map(header => {
      if (header === "categories" || header === "synonyms" || header === "antonyms") {
        return (word[header as keyof VocabularyWord] as string[]).join(";");
      } else if (header === "examples") {
        return JSON.stringify(word.examples.map(ex => ex.sentence));
      } else if (header === "dateAdded" || header === "dateModified") {
        return (word[header as keyof VocabularyWord] as Date).toISOString();
      } else {
        return word[header as keyof VocabularyWord];
      }
    });
    return values.join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Generate a unique ID for words
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}