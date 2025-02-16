import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

/**
 * Renders a list of tasks with their details and provides functionality to mark tasks as complete.
 *
 * @param {TaskListProps} props - The props for the TaskList component.
 * @param {Array} props.tasks - The list of tasks to display.
 * @param {Function} props.onCompleteTask - The function to call when a task is marked as complete.
 *
 * @returns {JSX.Element} The rendered TaskList component.
 */
export function TaskList({ tasks, onCompleteTask }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(task.status)}
              <h3 className="text-lg font-semibold">{task.title}</h3>
            </div>
            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <p className="mt-2 text-gray-600">{task.description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleString()}
              </span>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {task.category}
              </span>
            </div>
            
            {task.status !== 'completed' && (
              <button
                onClick={() => onCompleteTask(task.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}