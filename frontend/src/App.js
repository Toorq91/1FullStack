import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [inputText, setInputText] = useState('');

  // Fetch data from backend when the component mounts
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:5238/todo'); // Make sure this matches your backend route
      setTodoItems(response.data); // Store the fetched todos in state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createTodoItem = async () => {
    try {
      const todoItem = { text: inputText };
      await axios.post('http://localhost:5238/todo', todoItem);
      setInputText(''); // Clear the input
      getData(); // Refresh the list after adding a new item
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const registerDone = async (id) => {
    try {
      const todoItem = todoItems.find(ti => ti.id === id);
      await axios.put('http://localhost:5238/todo', todoItem);
      getData(); // Refresh the list after updating an item
    } catch (error) {
      console.error('Error registering done:', error);
    }
  };

  const deleteTodoItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5238/todo/${id}`);
      getData(); // Refresh the list after deleting an item
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Thor's Todo App</h1>
        <ul>
          {todoItems.map(todoItem => (
            <li key={todoItem.id}>
              {todoItem.text}
              {todoItem.done == null ? (
                <button onClick={() => registerDone(todoItem.id)}>Register Done</button>
              ) : (
                <span> Done on {new Date(todoItem.done).toLocaleDateString()}</span>
              )}
              <button onClick={() => deleteTodoItem(todoItem.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="New todo..."
        />
        <button onClick={createTodoItem}>Add Todo</button>
      </header>
    </div>
  );
}

export default App;