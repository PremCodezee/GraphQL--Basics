import "./App.css";
import { gql, useQuery } from "@apollo/client";

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      title
      completed
      mainUser {
        id
        name
        email
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  return (
    <div className="App">
      <h1>Todo List</h1>
      <ul className="todo-list">
        {data.getTodos.map((todo, index) => (
          <li key={index} className="todo-item">
            <div>
              <span className="todo-title">{todo.title}</span>
              <div className="todo-details">
                <span>Completed: {todo.completed ? "Yes" : "No"}</span>
                <span>Main User:</span>
                <span>ID: {todo.mainUser.id}</span>
                <span>Name: {todo.mainUser.name}</span>
                <span>Email: {todo.mainUser.email}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
