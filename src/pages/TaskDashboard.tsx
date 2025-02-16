import { CheckSquare, ChevronDown, History, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { UserStats } from '../components/UserStats';
import { useAuth } from '../context/AuthContext';
import type { Rank, Task, UserProfile } from '../types';

const RANKS: Rank[] = [
  { name: 'Novice', minPoints: 0, maxPoints: 100 },
  { name: 'Apprentice', minPoints: 101, maxPoints: 250 },
  { name: 'Proficient', minPoints: 251, maxPoints: 500 },
  { name: 'Expert', minPoints: 501, maxPoints: 800 },
  { name: 'Master', minPoints: 801, maxPoints: 1200 },
  { name: 'Grandmaster', minPoints: 1201, maxPoints: 1800 },
  { name: 'Legend', minPoints: 1801, maxPoints: 2500 },
  { name: 'Titan', minPoints: 2501, maxPoints: 3500 },
  { name: 'Champion', minPoints: 3501, maxPoints: 5000 },
  { name: 'Hero', minPoints: 5001, maxPoints: Infinity }
];

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    points: 0,
    rank: 'Novice',
    tasksCompleted: 0,
    streak: 0,
    precision: 100,
    lastCompletedDate: null,
    dailyTasksCompleted: 0,
    lastDailyReset: new Date().toISOString(),
    lastMonthlyReset: new Date().toISOString(),
    username: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load tasks and profile from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedProfile = localStorage.getItem('profile');
    const storedTaskHistory = localStorage.getItem('taskHistory');

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    if (storedProfile) {
      setProfile(prev => ({ ...JSON.parse(storedProfile), username: user?.username || prev.username }));
    }
    if (!storedTaskHistory) {
      localStorage.setItem('taskHistory', JSON.stringify([]));
    }
  }, [user]);

  // Save tasks and profile to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({ ...prev, username: user.username }));
    }
  }, [user]);

  const calculateTimelinessPoints = (task: Task): number => {
    const completedTime = new Date();
    const dueDate = new Date(task.dueDate);
    
    let points = 0;
    const isPastDue = completedTime > dueDate;

    if (isPastDue) {
      switch (task.priority) {
        case 'high':
          points = 8;
          break;
        case 'medium':
          points = 4;
          break;
        case 'low':
          points = 1.5;
          break;
      }
    } else {
      switch (task.priority) {
        case 'high':
          points = 10;
          if (completedTime < dueDate) points += 2;
          break;
        case 'medium':
          points = 5;
          if (completedTime < dueDate) points += 1;
          break;
        case 'low':
          points = 2;
          if (completedTime < dueDate) points += 0.5;
          break;
      }
    }

    return points;
  };

  const calculateStreakBonus = (currentStreak: number): number => {
    if (currentStreak >= 30) return 250;
    if (currentStreak >= 14) return 100;
    if (currentStreak >= 7) return 50;
    if (currentStreak >= 3) return 20;
    return 0;
  };

  const updateRank = (points: number, currentRank: string): string => {
    const newRank = RANKS.find(rank => 
      points >= rank.minPoints && points <= rank.maxPoints
    );
    const rankName = newRank?.name || 'Hero';
    
    if (rankName !== currentRank) {
      toast.success(
        <div className="text-center">
          <p className="font-bold text-lg">🎉 Congratulations! 🎉</p>
          <p>You've been promoted to</p>
          <p className="text-xl font-bold text-blue-600">{rankName}</p>
        </div>,
        {
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
          },
        }
      );
    }
    
    return rankName;
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'status' | 'points' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: 'pending',
      points: 0,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleCompleteTask = (taskId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const timelinessPoints = calculateTimelinessPoints(task);
          const completedTask = {
            ...task,
            status: 'completed',
            points: timelinessPoints,
            completedAt: new Date()
          };

          // Update task history
          const storedHistory = JSON.parse(localStorage.getItem('taskHistory') || '[]');
          localStorage.setItem('taskHistory', JSON.stringify([completedTask, ...storedHistory]));

          return completedTask;
        }
        return task;
      });

      return updatedTasks;
    });

    setProfile(prev => {
      const completedTask = tasks.find(t => t.id === taskId)!;
      const timelinessPoints = calculateTimelinessPoints(completedTask);
      
      let newStreak = prev.streak;
      const lastCompleted = prev.lastCompletedDate ? new Date(prev.lastCompletedDate) : null;
      
      if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
        const daysDifference = Math.floor(
          (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference === 1) {
          newStreak += 1;
        } else if (daysDifference > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const streakBonus = calculateStreakBonus(newStreak);
      const newDailyTasksCompleted = prev.dailyTasksCompleted + 1;
      const newPoints = prev.points + timelinessPoints + streakBonus;
      
      // Calculate precision
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const onTimeCompletions = completedTasks.filter(t => {
        if (!t.completedAt) return false;
        const completedTime = new Date(t.completedAt);
        const dueDate = new Date(t.dueDate);
        return completedTime <= dueDate;
      }).length;
      
      const precision = completedTasks.length > 0
        ? Math.round((onTimeCompletions / completedTasks.length) * 100)
        : 100;

      const newRank = updateRank(newPoints, prev.rank);

      return {
        ...prev,
        points: newPoints,
        rank: newRank,
        tasksCompleted: prev.tasksCompleted + 1,
        streak: newStreak,
        precision,
        lastCompletedDate: today.toISOString(),
        dailyTasksCompleted: newDailyTasksCompleted
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <span className="font-medium">{user?.username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/task-history');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Task History
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskForm onAddTask={handleAddTask} />
            <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} />
          </div>
          
          <div className="lg:col-span-1">
            <UserStats profile={profile} />
          </div>
        </div>
      </main>
    </div>
  );
}