import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoList } from './TodoList';
import { deleteSelectedTodo, getTodos, postTodo, USER_ID } from '../api/todos';
import { Errors } from '../types/Errors';
import classNames from 'classnames';

interface Props {}

export const TodoContent: React.FC<Props> = () => {
  const [todoValue, setTodoValue] = useState<string>('');
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTodoValue(event.target.value);

    if (todoValue !== '') {
      setErrorMessage('');
    }
  }

  function onDeleteTodo(todo: Todo) {
    deleteSelectedTodo(todo)
      .then(getTodos)
      .then(data => setTodosFromServer(data));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (todoValue.trim() === '') {
      setErrorMessage(Errors.notEmpty);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const preparedTodo = {
      userId: USER_ID,
      title: todoValue,
      completed: false,
    };

    postTodo(preparedTodo)
      .then(getTodos)
      .then(data => setTodosFromServer(data));
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

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
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

      <TodoList todos={todosFromServer} deleteTodo={onDeleteTodo} />

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
        {errorMessage === Errors.notLoad && <span>{Errors.notLoad}</span>}
        {errorMessage === Errors.notEmpty && <span>{Errors.notEmpty}</span>}
      </div>
    </div>
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
