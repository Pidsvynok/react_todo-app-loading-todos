import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoList } from './TodoList';
import { getTodos, postTodo, updateTodo, USER_ID } from '../api/todos';
import { Errors } from '../types/Errors';
import classNames from 'classnames';

export const TodoContent: React.FC = () => {
  const [todoValue, setTodoValue] = useState<string>('');
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [isAllcompleted, setIsAllCompleted] = useState<boolean>(false);
  const [anyLoading, setAnyLoading] = useState<boolean>(false);

  function resetErrorMessage(): void {
    setErrorMessage('');
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTodoValue(event.target.value);

    if (todoValue !== '') {
      resetErrorMessage();
    }
  }

  function handleUpdateTodos(todoses: Todo[]) {
    setTodosFromServer(todoses);
  }

  function handleErrorMessage(error: Errors | '') {
    setErrorMessage(error);
  }

  function handleAllButtonClick() {
    todosFromServer.map(todo => {
      setAnyLoading(true);
      const updatedTodo: Todo = {
        ...todo,
        completed: !todo.completed,
      };

      updateTodo(updatedTodo)
        .then(() => getTodos())
        .then(setTodosFromServer)
        .catch(() => setErrorMessage(Errors.notUpdate))
        .finally(() => setAnyLoading(false));
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (todoValue.trim() === '') {
      setErrorMessage(Errors.notEmpty);
      setTimeout(resetErrorMessage, 3000);

      return;
    }

    const preparedTodo = {
      userId: USER_ID,
      title: todoValue,
      completed: false,
    };

    const currentTodos = todosFromServer;

    setTodosFromServer(curTodos => [...curTodos, preparedTodo]);

    postTodo(preparedTodo)
      .then(getTodos)
      .then(data => setTodosFromServer(data))
      .then(() => setTodoValue(''))
      .catch(() => {
        setTodosFromServer(currentTodos);
        setErrorMessage(Errors.notAdd);
        setTimeout(resetErrorMessage, 3000);
      })
      .finally(() => setLoadingTodo(null));
  }

  function setLoadingValue(todo: Todo | null) {
    setLoadingTodo(todo);
  }

  useEffect(() => {
    getTodos()
      .then(data => {
        setErrorMessage('');
        setTodosFromServer(data);
      })
      .catch(() => {
        setErrorMessage(Errors.notLoad);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (todosFromServer.every(todo => todo.completed)) {
      setIsAllCompleted(true);
    } else {
      setIsAllCompleted(false);
    }

    setCompletedTodos([...todosFromServer].filter(todo => todo.completed));
  }, [todosFromServer]);

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllcompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleAllButtonClick}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              value={todoValue}
              onChange={handleInputChange}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={todosFromServer}
          completedTodos={completedTodos}
          loadingTodo={loadingTodo}
          anyLoading={anyLoading}
          setTodos={handleUpdateTodos}
          setErrorMessage={handleErrorMessage}
          resetError={resetErrorMessage}
          setLoadingTodo={setLoadingValue}
        />

        {todosFromServer.length ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosFromServer.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
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
              </a>
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
        ) : null}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === '',
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage === Errors.notLoad && Errors.notLoad}
        {errorMessage === Errors.notEmpty && Errors.notEmpty}
        {errorMessage === Errors.notAdd && Errors.notAdd}
        {errorMessage === Errors.notDelete && Errors.notDelete}
        {errorMessage === Errors.notUpdate && Errors.notUpdate}
      </div>
    </>
  );
};

{
  /* {Errors.notAdd}
        <br />
        {Errors.notDelete}
        <br />
        {Errors.notEmpty}
        <br />
        {Errors.notUpdate} */
}
