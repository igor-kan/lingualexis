'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Clock, Award, Brain } from 'lucide-react';

interface ProgressStats {
  totalWords: number;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  studyTime: number; // in minutes
  weeklyGoal: number;
  weeklyProgress: number;
}

interface DailyProgress {
  date: string;
  wordsStudied: number;
  timeSpent: number;
  accuracy: number;
}

interface ProgressDashboardProps {
  language: string;
}

export default function ProgressDashboard({ language }: ProgressDashboardProps) {
  const [stats, setStats] = useState<ProgressStats>({
    totalWords: 500,
    wordsLearned: 342,
    currentStreak: 7,
    longestStreak: 12,
    accuracy: 89,
    studyTime: 1245, // total minutes
    weeklyGoal: 300, // minutes per week
    weeklyProgress: 245
  });

  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([
    { date: '2024-01-15', wordsStudied: 15, timeSpent: 25, accuracy: 92 },
    { date: '2024-01-14', wordsStudied: 12, timeSpent: 20, accuracy: 88 },
    { date: '2024-01-13', wordsStudied: 18, timeSpent: 30, accuracy: 95 },
    { date: '2024-01-12', wordsStudied: 10, timeSpent: 15, accuracy: 85 },
    { date: '2024-01-11', wordsStudied: 20, timeSpent: 35, accuracy: 91 },
    { date: '2024-01-10', wordsStudied: 16, timeSpent: 28, accuracy: 89 },
    { date: '2024-01-09', wordsStudied: 14, timeSpent: 22, accuracy: 87 }
  ]);

  const completionRate = Math.round((stats.wordsLearned / stats.totalWords) * 100);
  const weeklyCompletionRate = Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Progress Dashboard</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Learning {language.charAt(0).toUpperCase() + language.slice(1)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Brain className="w-6 h-6 text-indigo-600" />}
          title="Words Learned"
          value={stats.wordsLearned}
          total={stats.totalWords}
          subtitle={`${completionRate}% complete`}
          color="indigo"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Current Streak"
          value={stats.currentStreak}
          subtitle="days in a row"
          color="green"
          badge={stats.currentStreak > 7 ? '🔥' : undefined}
        />
        <MetricCard
          icon={<Target className="w-6 h-6 text-purple-600" />}
          title="Accuracy"
          value={`${stats.accuracy}%`}
          subtitle="average score"
          color="purple"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          title="Study Time"
          value={`${Math.floor(stats.studyTime / 60)}h ${stats.studyTime % 60}m`}
          subtitle="total time"
          color="orange"
        />
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goal</h3>
          <span className="text-sm text-gray-600">{stats.weeklyProgress} / {stats.weeklyGoal} minutes</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(weeklyCompletionRate, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{weeklyCompletionRate}% completed</span>
          <span className="text-gray-600">{stats.weeklyGoal - stats.weeklyProgress} minutes remaining</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Activity</h3>
          <div className="space-y-4">
            {dailyProgress.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{day.wordsStudied} words</span>
                    <span className="text-sm text-gray-500">{day.timeSpent}min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${(day.wordsStudied / 25) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className={`text-sm font-medium ${
                    day.accuracy >= 90 ? 'text-green-600' : 
                    day.accuracy >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {day.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievements</h3>
          <div className="space-y-4">
            <AchievementBadge
              icon="🔥"
              title="Week Warrior"
              description="7-day study streak"
              unlocked={stats.currentStreak >= 7}
            />
            <AchievementBadge
              icon="📚"
              title="Word Master"
              description="Learn 100 words"
              unlocked={stats.wordsLearned >= 100}
              progress={stats.wordsLearned >= 100 ? 100 : (stats.wordsLearned / 100) * 100}
            />
            <AchievementBadge
              icon="🎯"
              title="Accuracy Expert"
              description="Maintain 90%+ accuracy"
              unlocked={stats.accuracy >= 90}
            />
            <AchievementBadge
              icon="⏰"
              title="Time Scholar"
              description="Study for 10 hours total"
              unlocked={stats.studyTime >= 600}
              progress={stats.studyTime >= 600 ? 100 : (stats.studyTime / 600) * 100}
            />
            <AchievementBadge
              icon="🏆"
              title="Consistency King"
              description="30-day study streak"
              unlocked={stats.longestStreak >= 30}
              progress={stats.longestStreak >= 30 ? 100 : (stats.longestStreak / 30) * 100}
            />
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              {Math.round(stats.studyTime / stats.currentStreak || 0)}
            </div>
            <p className="text-sm text-gray-600">Average minutes per day</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.round(dailyProgress.reduce((acc, day) => acc + day.wordsStudied, 0) / dailyProgress.length)}
            </div>
            <p className="text-sm text-gray-600">Average words per session</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.round(dailyProgress.reduce((acc, day) => acc + day.accuracy, 0) / dailyProgress.length)}%
            </div>
            <p className="text-sm text-gray-600">Average accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, total, subtitle, color, badge }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  total?: number;
  subtitle: string;
  color: string;
  badge?: string;
}) {
  const colorClasses = {
    indigo: 'bg-indigo-50 border-indigo-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        {badge && <span className="text-lg">{badge}</span>}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {total && <span className="text-sm text-gray-500">/ {total}</span>}
        </div>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function AchievementBadge({ icon, title, description, unlocked, progress }: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}) {
  return (
    <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
      unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className={`text-2xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </h4>
        <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
        {!unlocked && progress !== undefined && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gray-400 h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>
      {unlocked && (
        <Award className="w-5 h-5 text-yellow-600" />
      )}
    </div>
  );
}