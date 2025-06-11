import classNames from 'classnames';
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../types/Todo';

interface TodoCardProps {
  todoListState: ReturnType<typeof useTodos>;
  todo: Todo;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todoListState,

  todo,
}) => {
  const handleToggleSelectedTodo = (todoId: number) => {
    const updatedTodos = todoListState.todos.map(td =>
      td.id === todoId ? { ...td, completed: !td.completed } : td,
    );

    todoListState.setTodos(updatedTodos);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleSelectedTodo(todo.id)}
          aria-label="Toggle todo completion status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
