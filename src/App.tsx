/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useTodos } from './hooks/useTodos';
import { FilterStatus, useFilters } from './hooks/useFilter';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const todoListState = useTodos();
  const todosFilterState = useFilters(todoListState.todos, query);

  // console.log(todoListState.todos);

  const counter = () => {
    return todoListState.todos.filter(todo => !todo.completed).length;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleSelectedTodo = (todoId: number) => {
    const updatedTodos = todoListState.todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    );

    todoListState.setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={() => console.log('submitted')}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todosFilterState.todosFiltered.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed === true,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggleSelectedTodo(todo.id)}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
            //    <div data-cy="Todo" className="todo">
            //   <label className="todo__status-label">
            //     <input
            //       data-cy="TodoStatus"
            //       type="checkbox"
            //       className="todo__status"
            //     />
            //   </label>

            //   <span data-cy="TodoTitle" className="todo__title">
            //     Not Completed Todo
            //   </span>
            //   <button type="button" className="todo__remove" data-cy="TodoDelete">
            //     ×
            //   </button>

            //   <div data-cy="TodoLoader" className="modal overlay">
            //     <div className="modal-background has-background-white-ter" />
            //     <div className="loader" />
            //   </div>
            // </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todoListState.todos.length > 0 ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {counter()} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {Object.entries(FilterStatus).map(([key, value]) => (
                <a
                  key={key}
                  href="#/"
                  className={classNames('filter__link', {
                    selected: todosFilterState.filterStatus === value,
                  })}
                  data-cy={`FilterLink${value}`}
                  onClick={() => todosFilterState.setFilterStatus(value)}
                >
                  {value}
                </a>
              ))}
              {/* <a
                href="#/"
                className="filter__link selected"
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a> */}
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        ) : (
          <>no Todos Left</>
        )}

        {/* DON'T use conditional rendering to hide the notification */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: !todoListState.error,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => todoListState.setError('')}
          />
          {todoListState.error}
          {/* show only one message at a time */}

          {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      </div>
    </div>
  );
};
