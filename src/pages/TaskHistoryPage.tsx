import { AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types';

export function TaskHistoryPage() {
  const navigate = useNavigate();
  const [taskHistory, setTaskHistory] = React.useState<Task[]>([]);

  React.useEffect(() => {
    const storedTasks = localStorage.getItem('taskHistory');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      const uniqueTasks = parsedTasks.filter((task: Task, index: number, self: Task[]) =>
        index === self.findIndex((t) => t.id === task.id)
      );
      setTaskHistory(uniqueTasks);
    }
  }, []);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (task: Task) => {
    if (task.status === 'completed') {
      const completedDate = new Date(task.completedAt!);
      const dueDate = new Date(task.dueDate);
      return completedDate <= dueDate ? 'text-green-600' : 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getStatusText = (task: Task) => {
    if (task.status === 'completed') {
      const completedDate = new Date(task.completedAt!);
      const dueDate = new Date(task.dueDate);
      return completedDate <= dueDate ? 'Completed on time' : 'Completed late';
    }
    return 'Overdue';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task History</h1>
              <p className="text-gray-600">View your completed tasks</p>
            </div>
          </div>

          <div className="space-y-4">
            {taskHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No task history available
              </div>
            ) : (
              taskHistory.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Due: {formatDate(task.dueDate)}</p>
                        {task.completedAt && (
                          <p>Completed: {formatDate(task.completedAt)}</p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
                            {task.priority}
                          </span>
                          {task.category && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getStatusColor(task)}`}>
                      {getStatusText(task)}
                    </span>
                    <p className="text-sm text-purple-600 font-medium mt-1">
                      +{task.points} points
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}