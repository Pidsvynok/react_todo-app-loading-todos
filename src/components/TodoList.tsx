import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  deleteTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div key={todo.id} data-cy="Todo" className="todo">
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo)}
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
