import { useEffect, useState } from 'react';
import { Todo, TodoError } from '../types/typedefs';
import { getTodos, USER_ID, postTodo } from '../api/todos';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const ToDoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  Title: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
} as const;

const ERROR_DURATION = 3000;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<TodoError | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [query, setQuery] = useState<string>('');

  const showError = (todoError: TodoError) => {
    setError(todoError);
    setTimeout(() => {
      setError(null);
    }, ERROR_DURATION);
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ToDoServiceErrors.UnableToLoad);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = todos.filter(todo => !todo.completed).length;

  const completedCount = todos.filter(todo => todo.completed).length;

  const todosFiltered = (() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  const addTodo = async (title: string) => {
    const noSpaceQuery = title.trim();

    if (!noSpaceQuery) {
      showError(ToDoServiceErrors.Title);

      return false;
    }

    const newTempTodo = {
      id: 0,
      title: noSpaceQuery,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setLoadingTodo(0);

    try {
      const newTodo = await postTodo({
        title: noSpaceQuery,
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);

      return true;
    } catch {
      showError(ToDoServiceErrors.UnableToAddTodo);

      return false;
    } finally {
      setLoadingTodo(null);
      setTempTodo(null);
    }
  };

  const clearQuery = () => setQuery('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo(query).then(success => {
      if (success) {
        clearQuery();
      }
    });
  };

  return {
    todos,
    setTodos,
    error,
    setError,
    isLoading,
    setIsLoading,
    filterStatus,
    setFilterStatus,
    todosFiltered,
    tempTodo,
    setTempTodo,
    loadingTodo,
    setLoadingTodo,
    addTodo,
    showError,
    query,
    setQuery,
    clearQuery,
    handleSubmit,
    activeCount,
    completedCount,
  };
};
