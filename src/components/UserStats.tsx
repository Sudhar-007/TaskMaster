import React from 'react';
import { Trophy, Target, Zap, Award } from 'lucide-react';
import type { UserProfile } from '../types';

interface UserStatsProps {
  profile: UserProfile;
}

export function UserStats({ profile }: UserStatsProps) {
  const getPrecisionColor = (precision: number) => {
    if (precision >= 100) return 'bg-green-500';
    if (precision >= 75) return 'bg-yellow-500';
    if (precision >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPrecisionTextColor = (precision: number) => {
    if (precision >= 100) return 'text-green-600';
    if (precision >= 75) return 'text-yellow-600';
    if (precision >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <Award className="w-8 h-8 text-blue-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Rank</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{profile.rank}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Points</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{profile.points}</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-medium">Streak</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{profile.streak} days</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Precision</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className={`h-2.5 rounded-full ${getPrecisionColor(profile.precision)}`}
              style={{ width: `${profile.precision}%` }}
            ></div>
          </div>
          <p className={`text-xl font-bold ${getPrecisionTextColor(profile.precision)}`}>
            {profile.precision}%
          </p>
        </div>
      </div>
    </div>
  );
}