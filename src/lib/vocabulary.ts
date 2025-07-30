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
  frequency: FrequencyData;
  categories: string[];
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
  etymology?: Etymology;
  idioms: Idiom[];
  phrases: Phrase[];
  collocations: Collocation[];
  notes?: string;
  isFavorite: boolean;
  dateAdded: Date;
  dateModified: Date;
  audioUrl?: string;
  imageUrl?: string;
  // Additional linguistic data
  morphology?: MorphologyData;
  semanticField?: string[];
  register?: RegisterLevel;
  emotionalConnotation?: EmotionalConnotation;
  culturalContext?: CulturalContext[];
}

export interface Example {
  sentence: string;
  translation: string;
  context?: string;
  source?: string;
  difficulty?: DifficultyLevel;
}

export interface FrequencyData {
  writingFrequency: number; // Frequency per million words in written text
  speechFrequency: number; // Frequency per million words in spoken language
  rank: number; // Overall frequency rank (1 = most common)
  level: FrequencyLevel; // Human-readable frequency level
  corpusSize?: number; // Size of corpus used for frequency calculation
  lastUpdated?: Date;
}

export interface Etymology {
  origin: string; // Language or culture of origin
  originalForm?: string; // Original word form
  meaningEvolution: string; // How meaning changed over time
  firstKnownUse?: string; // Date or period of first known use
  relatedWords?: string[]; // Words with same etymological root
  linguisticFamily?: string; // Language family
}

export interface Idiom {
  id: string;
  phrase: string;
  meaning: string;
  usage: string; // When and how to use it
  example: string;
  translation: string;
  difficulty: DifficultyLevel;
  culturalSignificance?: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  type: PhraseType;
  meaning: string;
  usage: string;
  example: string;
  translation: string;
  register: RegisterLevel;
}

export interface Collocation {
  id: string;
  phrase: string;
  type: CollocationStrength;
  frequency: number;
  example: string;
  translation: string;
  notes?: string;
}

export interface MorphologyData {
  root?: string;
  prefix?: string[];
  suffix?: string[];
  inflections?: Inflection[];
  derivedForms?: DerivedForm[];
}

export interface Inflection {
  form: string;
  type: InflectionType;
  usage: string;
  example?: string;
}

export interface DerivedForm {
  word: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  morphologicalProcess: string; // e.g., "nominalization", "adjectivization"
}

export interface CulturalContext {
  context: string;
  significance: string;
  usage: string;
  region?: string;
  timesPeriod?: string;
  examples: string[];
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
  | 'phrase'
  | 'modal'
  | 'auxiliary'
  | 'determiner'
  | 'quantifier';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';
export type FrequencyLevel = 'very-common' | 'common' | 'uncommon' | 'rare' | 'archaic';

export type PhraseType = 
  | 'prepositional'
  | 'verbal'
  | 'adverbial'
  | 'adjectival'
  | 'fixed-expression'
  | 'colloquial'
  | 'formal';

export type RegisterLevel = 
  | 'very-formal'
  | 'formal'
  | 'neutral'
  | 'informal'
  | 'very-informal'
  | 'slang'
  | 'archaic'
  | 'technical'
  | 'academic';

export type EmotionalConnotation = 
  | 'very-positive'
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'very-negative'
  | 'offensive'
  | 'euphemistic';

export type CollocationStrength = 
  | 'very-strong'
  | 'strong'
  | 'moderate'
  | 'weak'
  | 'occasional';

export type InflectionType = 
  | 'plural'
  | 'singular'
  | 'past-tense'
  | 'present-tense'
  | 'future-tense'
  | 'past-participle'
  | 'present-participle'
  | 'comparative'
  | 'superlative'
  | 'possessive'
  | 'gerund'
  | 'infinitive';

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

// Default vocabulary data with comprehensive linguistic information
export const defaultVocabulary: { [key: string]: Partial<VocabularyWord>[] } = {
  english: [
    {
      word: 'Hello',
      translation: 'A greeting used when meeting someone',
      pronunciation: 'həˈloʊ',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: {
        writingFrequency: 145.2,
        speechFrequency: 320.8,
        rank: 892,
        level: 'very-common',
        corpusSize: 1000000,
        lastUpdated: new Date('2024-01-01')
      },
      categories: ['greetings', 'basic', 'social'],
      examples: [
        { 
          sentence: 'Hello, how are you today?', 
          translation: 'A polite greeting asking about someone\'s well-being',
          context: 'casual conversation',
          difficulty: 'beginner'
        }
      ],
      synonyms: ['hi', 'hey', 'greetings', 'salutations'],
      antonyms: ['goodbye', 'farewell'],
      etymology: {
        origin: 'Middle English',
        originalForm: 'hallo',
        meaningEvolution: 'Originally used to attract attention, evolved into a greeting',
        firstKnownUse: '1883',
        relatedWords: ['hallo', 'hollo', 'hullo'],
        linguisticFamily: 'Germanic'
      },
      idioms: [
        {
          id: 'hello-1',
          phrase: 'hello there',
          meaning: 'A friendly, casual greeting',
          usage: 'Used when greeting someone you know casually',
          example: 'Hello there, stranger!',
          translation: 'A warm, informal way to greet someone',
          difficulty: 'beginner'
        }
      ],
      phrases: [
        {
          id: 'hello-phrase-1',
          phrase: 'say hello to',
          type: 'verbal',
          meaning: 'To greet someone or give regards',
          usage: 'Used when asking someone to pass on a greeting',
          example: 'Please say hello to your mother for me',
          translation: 'Give my regards to your mother',
          register: 'neutral'
        }
      ],
      collocations: [
        {
          id: 'hello-coll-1',
          phrase: 'hello world',
          type: 'strong',
          frequency: 85.4,
          example: 'Hello world! This is my first program.',
          translation: 'A traditional first program in computer science',
          notes: 'Commonly used in programming tutorials'
        }
      ],
      register: 'neutral',
      emotionalConnotation: 'positive',
      culturalContext: [
        {
          context: 'Western greeting culture',
          significance: 'Universal friendly greeting in English-speaking countries',
          usage: 'Used in both formal and informal situations',
          region: 'Global English',
          examples: ['Business meetings', 'Casual encounters', 'Phone calls']
        }
      ]
    },
    {
      word: 'Beautiful',
      translation: 'Having qualities that give great pleasure to see, hear, or think about',
      pronunciation: 'ˈbjuːtɪfəl',
      partOfSpeech: 'adjective',
      difficulty: 'intermediate',
      frequency: {
        writingFrequency: 89.3,
        speechFrequency: 156.7,
        rank: 1247,
        level: 'common',
        corpusSize: 1000000,
        lastUpdated: new Date('2024-01-01')
      },
      categories: ['adjectives', 'appearance', 'emotions'],
      examples: [
        { 
          sentence: 'The sunset was absolutely beautiful tonight.', 
          translation: 'The evening sky display was very pleasing to look at',
          context: 'describing nature',
          difficulty: 'intermediate'
        },
        {
          sentence: 'She has a beautiful voice.',
          translation: 'Her singing voice is very pleasant to hear',
          context: 'describing abilities',
          difficulty: 'intermediate'
        }
      ],
      synonyms: ['gorgeous', 'stunning', 'lovely', 'attractive', 'pretty', 'handsome'],
      antonyms: ['ugly', 'hideous', 'repulsive', 'unattractive'],
      etymology: {
        origin: 'Middle English',
        originalForm: 'beaute',
        meaningEvolution: 'From Old French "beaute", meaning physical attractiveness, expanded to include abstract beauty',
        firstKnownUse: '14th century',
        relatedWords: ['beauty', 'beautify', 'beauteous'],
        linguisticFamily: 'Romance (via French)'
      },
      idioms: [
        {
          id: 'beautiful-1',
          phrase: 'beauty is in the eye of the beholder',
          meaning: 'People have different opinions about what is beautiful',
          usage: 'Used when people disagree about attractiveness',
          example: 'I don\'t like modern art, but beauty is in the eye of the beholder',
          translation: 'Everyone has different tastes in what they find attractive',
          difficulty: 'advanced',
          culturalSignificance: 'Emphasizes subjective nature of aesthetic judgment'
        }
      ],
      phrases: [
        {
          id: 'beautiful-phrase-1',
          phrase: 'beautiful people',
          type: 'adjectival',
          meaning: 'Attractive, fashionable, or wealthy people',
          usage: 'Often used to describe social elite',
          example: 'The party was full of beautiful people',
          translation: 'The party was attended by attractive, fashionable people',
          register: 'informal'
        }
      ],
      collocations: [
        {
          id: 'beautiful-coll-1',
          phrase: 'beautiful weather',
          type: 'strong',
          frequency: 124.6,
          example: 'What beautiful weather we\'re having!',
          translation: 'The weather conditions are very pleasant',
          notes: 'Common collocation for pleasant weather conditions'
        }
      ],
      morphology: {
        root: 'beauty',
        suffix: ['-ful'],
        inflections: [
          {
            form: 'more beautiful',
            type: 'comparative',
            usage: 'Used when comparing two things',
            example: 'She is more beautiful than her sister'
          },
          {
            form: 'most beautiful',
            type: 'superlative',
            usage: 'Used when describing the highest degree',
            example: 'That was the most beautiful sunset I\'ve ever seen'
          }
        ],
        derivedForms: [
          {
            word: 'beautifully',
            partOfSpeech: 'adverb',
            meaning: 'In a beautiful manner',
            morphologicalProcess: 'adverbialization'
          }
        ]
      },
      register: 'neutral',
      emotionalConnotation: 'very-positive',
      semanticField: ['aesthetics', 'appearance', 'evaluation']
    }
  ],
  spanish: [
    {
      word: 'Hola',
      translation: 'Hello',
      pronunciation: 'OH-lah',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      frequency: {
        writingFrequency: 234.5,
        speechFrequency: 445.8,
        rank: 456,
        level: 'very-common',
        corpusSize: 500000,
        lastUpdated: new Date('2024-01-01')
      },
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
    idioms: [],
    phrases: [],
    collocations: [],
    isFavorite: false,
    dateAdded: now,
    dateModified: now,
    partOfSpeech: 'noun',
    difficulty: 'beginner',
    frequency: {
      writingFrequency: 0,
      speechFrequency: 0,
      rank: 0,
      level: 'common',
      corpusSize: 1000000,
      lastUpdated: now
    },
    register: 'neutral',
    emotionalConnotation: 'neutral',
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

/**
 * Word Database Service - Comprehensive word management system
 */
export class WordDatabaseService {
  private words: Map<string, VocabularyWord> = new Map();
  private indexByLanguage: Map<string, Set<string>> = new Map();
  private indexByFrequencyRank: Map<string, string[]> = new Map();
  private indexByCategory: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Initialize with default vocabulary data
   */
  private initializeDefaultData(): void {
    Object.entries(defaultVocabulary).forEach(([language, words]) => {
      words.forEach(wordData => {
        if (wordData.word && wordData.translation) {
          const word = createVocabularyWord({
            ...wordData,
            word: wordData.word,
            translation: wordData.translation,
            language
          });
          this.addWord(word);
        }
      });
    });
  }

  /**
   * Add a new word to the database
   */
  addWord(word: VocabularyWord): void {
    this.words.set(word.id, word);
    this.updateIndexes(word);
  }

  /**
   * Get word by ID
   */
  getWord(id: string): VocabularyWord | undefined {
    return this.words.get(id);
  }

  /**
   * Search words by text query
   */
  searchWords(query: string, options: {
    language?: string;
    includeEtymology?: boolean;
    includeIdioms?: boolean;
    includePhrases?: boolean;
  } = {}): VocabularyWord[] {
    const searchTerm = query.toLowerCase();
    const results: VocabularyWord[] = [];

    for (const word of this.words.values()) {
      if (options.language && word.language !== options.language) continue;

      // Search in word and translation
      if (word.word.toLowerCase().includes(searchTerm) || 
          word.translation.toLowerCase().includes(searchTerm)) {
        results.push(word);
        continue;
      }

      // Search in categories
      if (word.categories.some(cat => cat.toLowerCase().includes(searchTerm))) {
        results.push(word);
        continue;
      }

      // Search in synonyms and antonyms
      if (word.synonyms.some(syn => syn.toLowerCase().includes(searchTerm)) ||
          word.antonyms.some(ant => ant.toLowerCase().includes(searchTerm))) {
        results.push(word);
        continue;
      }

      // Search in etymology
      if (options.includeEtymology && word.etymology) {
        if (word.etymology.origin.toLowerCase().includes(searchTerm) ||
            word.etymology.meaningEvolution.toLowerCase().includes(searchTerm)) {
          results.push(word);
          continue;
        }
      }

      // Search in idioms
      if (options.includeIdioms && word.idioms.some(idiom => 
        idiom.phrase.toLowerCase().includes(searchTerm) ||
        idiom.meaning.toLowerCase().includes(searchTerm))) {
        results.push(word);
        continue;
      }

      // Search in phrases
      if (options.includePhrases && word.phrases.some(phrase => 
        phrase.phrase.toLowerCase().includes(searchTerm) ||
        phrase.meaning.toLowerCase().includes(searchTerm))) {
        results.push(word);
        continue;
      }
    }

    return results;
  }

  /**
   * Get words by frequency range
   */
  getWordsByFrequencyRange(
    language: string,
    minRank: number,
    maxRank: number
  ): VocabularyWord[] {
    return Array.from(this.words.values())
      .filter(word => 
        word.language === language &&
        word.frequency.rank >= minRank &&
        word.frequency.rank <= maxRank
      )
      .sort((a, b) => a.frequency.rank - b.frequency.rank);
  }

  /**
   * Get most frequent words by language
   */
  getMostFrequentWords(language: string, limit: number = 100): VocabularyWord[] {
    return Array.from(this.words.values())
      .filter(word => word.language === language && word.frequency.rank > 0)
      .sort((a, b) => a.frequency.rank - b.frequency.rank)
      .slice(0, limit);
  }

  /**
   * Get words with specific etymology origin
   */
  getWordsByEtymology(origin: string, language?: string): VocabularyWord[] {
    return Array.from(this.words.values())
      .filter(word => {
        if (language && word.language !== language) return false;
        return word.etymology?.origin.toLowerCase().includes(origin.toLowerCase());
      });
  }

  /**
   * Get all idioms for a specific word
   */
  getIdiomsForWord(wordId: string): Idiom[] {
    const word = this.getWord(wordId);
    return word ? word.idioms : [];
  }

  /**
   * Get all phrases for a specific word
   */
  getPhrasesForWord(wordId: string): Phrase[] {
    const word = this.getWord(wordId);
    return word ? word.phrases : [];
  }

  /**
   * Get collocations for a specific word
   */
  getCollocationsForWord(wordId: string): Collocation[] {
    const word = this.getWord(wordId);
    return word ? word.collocations : [];
  }

  /**
   * Update word frequencies from corpus data
   */
  updateWordFrequencies(frequencyData: { 
    [word: string]: { 
      writingFreq: number; 
      speechFreq: number; 
      rank: number; 
    } 
  }): void {
    for (const word of this.words.values()) {
      const freqData = frequencyData[word.word.toLowerCase()];
      if (freqData) {
        word.frequency = {
          ...word.frequency,
          writingFrequency: freqData.writingFreq,
          speechFrequency: freqData.speechFreq,
          rank: freqData.rank,
          level: this.getFrequencyLevel(freqData.rank),
          lastUpdated: new Date()
        };
      }
    }
    this.rebuildIndexes();
  }

  /**
   * Get comprehensive word statistics
   */
  getWordStatistics(language?: string): {
    totalWords: number;
    averageFrequencyRank: number;
    etymologyOrigins: { [origin: string]: number };
    registerDistribution: { [register: string]: number };
    emotionalDistribution: { [emotion: string]: number };
    totalIdioms: number;
    totalPhrases: number;
    totalCollocations: number;
    morphologyStats: {
      wordsWithInflections: number;
      wordsWithDerivedForms: number;
      commonPrefixes: { [prefix: string]: number };
      commonSuffixes: { [suffix: string]: number };
    };
  } {
    const words = language ? 
      Array.from(this.words.values()).filter(w => w.language === language) :
      Array.from(this.words.values());

    const stats = {
      totalWords: words.length,
      averageFrequencyRank: 0,
      etymologyOrigins: {} as { [origin: string]: number },
      registerDistribution: {} as { [register: string]: number },
      emotionalDistribution: {} as { [emotion: string]: number },
      totalIdioms: 0,
      totalPhrases: 0,
      totalCollocations: 0,
      morphologyStats: {
        wordsWithInflections: 0,
        wordsWithDerivedForms: 0,
        commonPrefixes: {} as { [prefix: string]: number },
        commonSuffixes: {} as { [suffix: string]: number }
      }
    };

    let totalRank = 0;
    let wordsWithRank = 0;

    words.forEach(word => {
      // Frequency statistics
      if (word.frequency.rank > 0) {
        totalRank += word.frequency.rank;
        wordsWithRank++;
      }

      // Etymology statistics
      if (word.etymology?.origin) {
        stats.etymologyOrigins[word.etymology.origin] = 
          (stats.etymologyOrigins[word.etymology.origin] || 0) + 1;
      }

      // Register statistics
      if (word.register) {
        stats.registerDistribution[word.register] = 
          (stats.registerDistribution[word.register] || 0) + 1;
      }

      // Emotional connotation statistics
      if (word.emotionalConnotation) {
        stats.emotionalDistribution[word.emotionalConnotation] = 
          (stats.emotionalDistribution[word.emotionalConnotation] || 0) + 1;
      }

      // Count idioms, phrases, collocations
      stats.totalIdioms += word.idioms.length;
      stats.totalPhrases += word.phrases.length;
      stats.totalCollocations += word.collocations.length;

      // Morphology statistics
      if (word.morphology) {
        if (word.morphology.inflections && word.morphology.inflections.length > 0) {
          stats.morphologyStats.wordsWithInflections++;
        }
        if (word.morphology.derivedForms && word.morphology.derivedForms.length > 0) {
          stats.morphologyStats.wordsWithDerivedForms++;
        }

        // Prefix and suffix counting
        word.morphology.prefix?.forEach(prefix => {
          stats.morphologyStats.commonPrefixes[prefix] = 
            (stats.morphologyStats.commonPrefixes[prefix] || 0) + 1;
        });
        word.morphology.suffix?.forEach(suffix => {
          stats.morphologyStats.commonSuffixes[suffix] = 
            (stats.morphologyStats.commonSuffixes[suffix] || 0) + 1;
        });
      }
    });

    if (wordsWithRank > 0) {
      stats.averageFrequencyRank = totalRank / wordsWithRank;
    }

    return stats;
  }

  /**
   * Export words in various formats
   */
  exportWords(format: 'json' | 'csv' | 'anki', language?: string): string {
    const words = language ? 
      Array.from(this.words.values()).filter(w => w.language === language) :
      Array.from(this.words.values());

    switch (format) {
      case 'json':
        return JSON.stringify(words, null, 2);
      
      case 'csv':
        return this.exportToCSV(words);
        
      case 'anki':
        return this.exportToAnki(words);
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Import words from various formats
   */
  importWords(data: string, format: 'json' | 'csv', language: string): number {
    let imported = 0;
    
    try {
      switch (format) {
        case 'json':
          const jsonWords = JSON.parse(data) as VocabularyWord[];
          jsonWords.forEach(word => {
            this.addWord({ ...word, id: generateId(), language });
            imported++;
          });
          break;
          
        case 'csv':
          const csvWords = importFromCSV(data, language);
          csvWords.forEach(word => {
            this.addWord(word);
            imported++;
          });
          break;
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
    
    return imported;
  }

  /**
   * Private helper methods
   */
  private updateIndexes(word: VocabularyWord): void {
    // Language index
    if (!this.indexByLanguage.has(word.language)) {
      this.indexByLanguage.set(word.language, new Set());
    }
    this.indexByLanguage.get(word.language)!.add(word.id);

    // Category index
    word.categories.forEach(category => {
      if (!this.indexByCategory.has(category)) {
        this.indexByCategory.set(category, new Set());
      }
      this.indexByCategory.get(category)!.add(word.id);
    });
  }

  private rebuildIndexes(): void {
    this.indexByLanguage.clear();
    this.indexByFrequencyRank.clear();
    this.indexByCategory.clear();

    for (const word of this.words.values()) {
      this.updateIndexes(word);
    }
  }

  private getFrequencyLevel(rank: number): FrequencyLevel {
    if (rank <= 1000) return 'very-common';
    if (rank <= 5000) return 'common';
    if (rank <= 20000) return 'uncommon';
    if (rank <= 50000) return 'rare';
    return 'archaic';
  }

  private exportToCSV(words: VocabularyWord[]): string {
    const headers = [
      "id", "word", "translation", "language", "pronunciation", 
      "partOfSpeech", "difficulty", "writingFrequency", "speechFrequency", 
      "frequencyRank", "categories", "synonyms", "antonyms", 
      "etymology", "register", "emotionalConnotation"
    ];
    
    const rows = words.map(word => {
      return headers.map(header => {
        switch (header) {
          case "writingFrequency":
            return word.frequency.writingFrequency;
          case "speechFrequency":
            return word.frequency.speechFrequency;
          case "frequencyRank":
            return word.frequency.rank;
          case "categories":
          case "synonyms":
          case "antonyms":
            return (word[header as keyof VocabularyWord] as string[]).join(";");
          case "etymology":
            return word.etymology ? JSON.stringify(word.etymology) : "";
          default:
            return word[header as keyof VocabularyWord] || "";
        }
      });
    });

    return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
  }

  private exportToAnki(words: VocabularyWord[]): string {
    // Anki format: Front;Back;Tags
    const ankiCards = words.map(word => {
      const front = word.word;
      const back = `${word.translation}<br><br>` +
        `<i>${word.pronunciation || ''}</i><br>` +
        `Part of Speech: ${word.partOfSpeech}<br>` +
        `Frequency Rank: ${word.frequency.rank}<br>` +
        (word.synonyms.length > 0 ? `Synonyms: ${word.synonyms.join(', ')}<br>` : '') +
        (word.etymology ? `Etymology: ${word.etymology.origin}<br>` : '');
      const tags = [word.language, word.difficulty, ...word.categories].join(' ');
      
      return `${front};${back};${tags}`;
    });

    return ankiCards.join('\n');
  }
}

// Global instance of the word database service
export const wordDatabase = new WordDatabaseService();