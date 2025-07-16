'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Crown, Medal, Award, Zap, Calendar, Book } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  category: 'study' | 'streak' | 'quiz' | 'vocabulary' | 'special';
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  studyStreak: number;
  maxStudyStreak: number;
  totalStudyTime: number;
  wordsLearned: number;
  quizzesCompleted: number;
  averageAccuracy: number;
  perfectQuizzes: number;
  dailyGoalStreak: number;
}

interface GamificationProps {
  userStats: UserStats;
  onUpdateStats: (stats: Partial<UserStats>) => void;
}

export default function Gamification({ userStats, onUpdateStats }: GamificationProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    initializeAchievements();
  }, []);

  useEffect(() => {
    checkAchievements();
  }, [userStats]);

  const initializeAchievements = () => {
    const achievementsList: Achievement[] = [
      // Study Achievements
      {
        id: 'first_word',
        name: 'First Steps',
        description: 'Learn your first word',
        icon: <Book className="w-6 h-6" />,
        progress: userStats.wordsLearned,
        maxProgress: 1,
        isUnlocked: userStats.wordsLearned >= 1,
        rarity: 'common',
        xpReward: 50,
        category: 'vocabulary'
      },
      {
        id: 'vocabulary_master',
        name: 'Vocabulary Master',
        description: 'Learn 100 words',
        icon: <Crown className="w-6 h-6" />,
        progress: userStats.wordsLearned,
        maxProgress: 100,
        isUnlocked: userStats.wordsLearned >= 100,
        rarity: 'epic',
        xpReward: 500,
        category: 'vocabulary'
      },
      {
        id: 'polyglot',
        name: 'Polyglot',
        description: 'Learn 500 words',
        icon: <Medal className="w-6 h-6" />,
        progress: userStats.wordsLearned,
        maxProgress: 500,
        isUnlocked: userStats.wordsLearned >= 500,
        rarity: 'legendary',
        xpReward: 1000,
        category: 'vocabulary'
      },

      // Streak Achievements
      {
        id: 'streak_starter',
        name: 'Getting Started',
        description: 'Study for 3 days in a row',
        icon: <Flame className="w-6 h-6" />,
        progress: userStats.studyStreak,
        maxProgress: 3,
        isUnlocked: userStats.studyStreak >= 3,
        rarity: 'common',
        xpReward: 100,
        category: 'streak'
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Study for 7 days in a row',
        icon: <Target className="w-6 h-6" />,
        progress: userStats.studyStreak,
        maxProgress: 7,
        isUnlocked: userStats.studyStreak >= 7,
        rarity: 'rare',
        xpReward: 250,
        category: 'streak'
      },
      {
        id: 'dedication_legend',
        name: 'Dedication Legend',
        description: 'Study for 30 days in a row',
        icon: <Crown className="w-6 h-6" />,
        progress: userStats.studyStreak,
        maxProgress: 30,
        isUnlocked: userStats.studyStreak >= 30,
        rarity: 'legendary',
        xpReward: 1500,
        category: 'streak'
      },

      // Quiz Achievements
      {
        id: 'quiz_novice',
        name: 'Quiz Novice',
        description: 'Complete your first quiz',
        icon: <Star className="w-6 h-6" />,
        progress: userStats.quizzesCompleted,
        maxProgress: 1,
        isUnlocked: userStats.quizzesCompleted >= 1,
        rarity: 'common',
        xpReward: 75,
        category: 'quiz'
      },
      {
        id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Get 100% on a quiz',
        icon: <Trophy className="w-6 h-6" />,
        progress: userStats.perfectQuizzes,
        maxProgress: 1,
        isUnlocked: userStats.perfectQuizzes >= 1,
        rarity: 'rare',
        xpReward: 300,
        category: 'quiz'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete 10 speed quizzes',
        icon: <Zap className="w-6 h-6" />,
        progress: 0, // Would need to track speed quiz completions
        maxProgress: 10,
        isUnlocked: false,
        rarity: 'rare',
        xpReward: 400,
        category: 'quiz'
      },

      // Study Time Achievements
      {
        id: 'study_time_bronze',
        name: 'Bronze Scholar',
        description: 'Study for 1 hour total',
        icon: <Award className="w-6 h-6" />,
        progress: userStats.totalStudyTime,
        maxProgress: 60,
        isUnlocked: userStats.totalStudyTime >= 60,
        rarity: 'common',
        xpReward: 150,
        category: 'study'
      },
      {
        id: 'study_time_silver',
        name: 'Silver Scholar',
        description: 'Study for 10 hours total',
        icon: <Award className="w-6 h-6" />,
        progress: userStats.totalStudyTime,
        maxProgress: 600,
        isUnlocked: userStats.totalStudyTime >= 600,
        rarity: 'rare',
        xpReward: 500,
        category: 'study'
      },
      {
        id: 'study_time_gold',
        name: 'Gold Scholar',
        description: 'Study for 50 hours total',
        icon: <Award className="w-6 h-6" />,
        progress: userStats.totalStudyTime,
        maxProgress: 3000,
        isUnlocked: userStats.totalStudyTime >= 3000,
        rarity: 'epic',
        xpReward: 1200,
        category: 'study'
      },

      // Special Achievements
      {
        id: 'daily_goal_master',
        name: 'Goal Master',
        description: 'Meet your daily goal 10 days in a row',
        icon: <Calendar className="w-6 h-6" />,
        progress: userStats.dailyGoalStreak,
        maxProgress: 10,
        isUnlocked: userStats.dailyGoalStreak >= 10,
        rarity: 'epic',
        xpReward: 750,
        category: 'special'
      }
    ];

    setAchievements(achievementsList);
  };

  const checkAchievements = () => {
    const newlyUnlocked: Achievement[] = [];
    
    setAchievements(prev => prev.map(achievement => {
      const wasUnlocked = achievement.isUnlocked;
      let progress = 0;
      
      switch (achievement.id) {
        case 'first_word':
        case 'vocabulary_master':
        case 'polyglot':
          progress = userStats.wordsLearned;
          break;
        case 'streak_starter':
        case 'week_warrior':
        case 'dedication_legend':
          progress = userStats.studyStreak;
          break;
        case 'quiz_novice':
          progress = userStats.quizzesCompleted;
          break;
        case 'perfect_score':
          progress = userStats.perfectQuizzes;
          break;
        case 'study_time_bronze':
        case 'study_time_silver':
        case 'study_time_gold':
          progress = userStats.totalStudyTime;
          break;
        case 'daily_goal_master':
          progress = userStats.dailyGoalStreak;
          break;
        default:
          progress = achievement.progress;
      }

      const isNowUnlocked = progress >= achievement.maxProgress;
      
      if (!wasUnlocked && isNowUnlocked) {
        newlyUnlocked.push({ ...achievement, progress, isUnlocked: true });
        // Award XP
        onUpdateStats({ xp: userStats.xp + achievement.xpReward });
      }

      return {
        ...achievement,
        progress,
        isUnlocked: isNowUnlocked
      };
    }));

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      setTimeout(() => setNewAchievements([]), 5000);
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelFromXP = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const getXPToNextLevel = (xp: number) => {
    const currentLevel = getLevelFromXP(xp);
    return (currentLevel * 1000) - xp;
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* New Achievement Notifications */}
      {newAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-full">
              {achievement.icon}
            </div>
            <div>
              <p className="font-semibold">Achievement Unlocked!</p>
              <p className="text-sm">{achievement.name}</p>
              <p className="text-xs">+{achievement.xpReward} XP</p>
            </div>
          </div>
        </div>
      ))}

      {/* Level and XP Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{getLevelFromXP(userStats.xp)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Level {getLevelFromXP(userStats.xp)}</h3>
              <p className="text-sm opacity-90">{userStats.xp} XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Next Level</p>
            <p className="font-semibold">{getXPToNextLevel(userStats.xp)} XP</p>
          </div>
        </div>
        
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage(userStats.xp % 1000, 1000)}%` }}
          />
        </div>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{userStats.studyStreak}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Book className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{userStats.wordsLearned}</p>
          <p className="text-sm text-gray-600">Words Learned</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{userStats.averageAccuracy}%</p>
          <p className="text-sm text-gray-600">Accuracy</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{userStats.perfectQuizzes}</p>
          <p className="text-sm text-gray-600">Perfect Quizzes</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showAchievements ? 'Hide All' : 'View All'}
          </button>
        </div>

        {/* Recent Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements
            .filter(a => a.isUnlocked)
            .slice(0, showAchievements ? achievements.length : 6)
            .map((achievement) => (
              <div
                key={achievement.id}
                className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getRarityTextColor(achievement.rarity)}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${getRarityTextColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">+{achievement.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* In Progress Achievements */}
        {showAchievements && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">In Progress</h4>
            <div className="space-y-3">
              {achievements
                .filter(a => !a.isUnlocked)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border border-gray-200 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-700">{achievement.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${getProgressPercentage(achievement.progress, achievement.maxProgress)}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}