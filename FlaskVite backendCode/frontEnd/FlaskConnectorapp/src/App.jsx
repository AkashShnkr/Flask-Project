import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);  // Assuming the response from Flask is an array of tasks
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Post the new task to the backend
    fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        content: newTask,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: Date.now(), content: newTask, created: new Date().toLocaleString(), comelete: false },
        ]);
        setNewTask('');
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/delete/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleEditClick = (id, content) => {
    setEditTaskId(id);
    setEditTaskContent(content);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    // Put the edited task to the backend
    fetch(`http://localhost:5000/update/${editTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        content: editTaskContent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId ? { ...task, content: editTaskContent } : task
          )
        );
        setEditTaskId(null);
        setEditTaskContent('');
      })
      .catch((error) => console.error('Error editing task:', error));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-4xl font-extrabold text-center mb-8">
        Flask app and Reactjs <span className="text-blue-600">Task Manager</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <input
            required
            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="content"
            id="content"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      </form>

      {editTaskId && (
        <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4 mt-6">
          <div className="flex space-x-4">
            <input
              required
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="editContent"
              id="editContent"
              value={editTaskContent}
              onChange={(e) => setEditTaskContent(e.target.value)}
              placeholder="Edit task"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Save Edit
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800">Task Application</h1>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-6 text-left">Task</th>
              <th className="py-3 px-6 text-left">Created</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Delete</th>
              <th className="py-3 px-6 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-100 text-black">
                <td className="py-3 px-6">{task.content}</td>
                <td className="py-3 px-6">{task.created}</td>
                <td className="py-3 px-6">{task.comelete ? 'Complete' : 'Incomplete'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEditClick(task.id, task.content)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
