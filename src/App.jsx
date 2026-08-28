import { useEffect, useState } from 'react'
import TaskItem from './TaskItem.jsx'
import './App.css'

const STORAGE_KEY = 'taskflow.tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    const text = draft.trim()
    if (!text) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ])
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTask()
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const remaining = tasks.filter((t) => !t.completed).length

  return (
    <div className="page">
      <div className="card">
        <h1>TaskFlow</h1>

        <div className="add-row">
          <input
            type="text"
            className="add-input"
            placeholder="What needs to be done?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="add-btn" onClick={addTask}>
            Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet — add one above!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}

        {tasks.length > 0 && (
          <div className="footer">
            {remaining} {remaining === 1 ? 'task' : 'tasks'} left
          </div>
        )}
      </div>
    </div>
  )
}

export default App
