import { useState } from 'react'
import {deleteTodo, doneTodo, editTodo, getTodos, resetTodo, undoneTodo} from './services/todosApi.js'
import { createTodo } from './services/todosApi.js'
import {formatRange} from "@fullcalendar/core";

export default function App() {
  const [name, setName] = useState('')
  const [activeName, setActiveName] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const [editingTodoId, setEditingTodoId] = useState(null)

  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    date_from: '',
    date_to: '',
  })
  const [formErrors, setFormErrors] = useState({})


  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_from')


  async function loadTodos(event) {
    event.preventDefault()
    const studentName = name.trim()
    if (!studentName) {
      setError('Zadajte svoj identifikátor.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const serverTodos = await getTodos(studentName)
      setTodos(serverTodos)
      setActiveName(studentName)
      setLoaded(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Nastala neznáma chyba.')
    } finally {
      setLoading(false)
    }
  }
  function fancyDate(iso) {
    let date = new Date(iso);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  const visibleTodos = todos
      .filter((todo) => {
        const matchesSearch = todo.title.toLowerCase().includes(searchText.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && !todo.is_finished) ||
            (statusFilter === 'finished' && todo.is_finished)

        return matchesSearch && matchesStatus})
      .sort((a, b) =>
          new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()
      )

  return (
    <div className="page">
      <header className="site-header">
        <div className="container">
          <p className="eyebrow">WEBTE1 · Zadanie 3</p>
          <h1>Môj TODO List</h1>
        </div>
      </header>

      <main className="container main-content">
        <section aria-labelledby="access-heading">
          <h2 id="access-heading">Načítanie úloh</h2>
          <p>Zadajte svoj identifikátor pridelený pre API.</p>
          <form className="access-form" onSubmit={loadTodos}>
            <label htmlFor="student-name">Identifikátor študenta</label>
            <div className="form-row">
              <input
                id="student-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                maxLength={100}
                autoComplete="username"
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Načítavam…' : 'Načítať úlohy'}
              </button>
            </div>
          </form>
          {error && <p className="message error" role="alert">{error}</p>}
          {loading && <p className="message" role="status">Načítavam úlohy zo servera…</p>}
        </section>

        {loaded && (
          <section className="tasks" aria-labelledby="tasks-heading">
            <h2 id="tasks-heading">Úlohy: {activeName} ({todos.length})</h2>
            <label htmlFor="todo-search">Hľadať podľa názvu</label>
            <input
                id="todo-search"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
            />
            <label htmlFor="status-filter">Stav úloh</label>
            <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Všetky</option>
              <option value="active">Nedokončené</option>
              <option value="finished">Dokončené</option>
            </select>

            <label htmlFor="sort-by">Zoradiť podľa</label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="date_from">Podľa začiatku</option>
              <option value="date_to">Podľa konca</option>
            </select>

            {todos.length === 0 ? (
                <p>Zatiaľ nemáte žiadne úlohy.</p>
            ) : visibleTodos.length === 0 ? (
                <p>Žiadne úlohy nezodpovedajú filtrom.</p>
            ) : (
                <ul className="task-list">
                {visibleTodos.map((todo) => (
                  <li key={todo.id} className="task">
                    <div className="task-content">
                      <strong>{todo.title}</strong>
                      <span>{todo.is_finished ? 'Dokončená' : 'Nedokončená'}</span>
                      <p>{!todo.is_finished && new Date(todo.date_to) < new Date() ? ' po termine' : ''} </p>
                      {todo.description && <p>{todo.description}</p>}
                      <small>
                        Od {new Date(todo.date_from).toLocaleString('sk-SK')} do{' '}
                        {new Date(todo.date_to).toLocaleString('sk-SK')}
                      </small>
                    </div>

                    <div className="task-actions">
                      <button type="button" onClick={() => {
                        setEditingTodoId(todo.id)
                        setForm({
                          title: todo.title,
                          description: todo.description ?? '',
                          date_from: fancyDate(todo.date_from),
                          date_to: fancyDate(todo.date_to)
                        })}}>Upravit</button>

                      <button type="button"  onClick={async() => {
                        if (!window.confirm('ano naozaj?')) {
                          return
                        }
                        try{
                          await deleteTodo(activeName, todo.id)
                          const updatedTodos = await getTodos(activeName)
                          setTodos(updatedTodos)
                          setEditingTodoId(null)
                          setFormErrors({})
                          setForm({title: '', description: '', date_from: '', date_to: ''})
                          setSubmitError('')
                        } catch(cause){
                          setSubmitError(cause.message)
                        }
                      }}>vymazat</button>

                      <button type="button"  onClick={async() => {
                        try{
                          if(todo.is_finished === false){ await doneTodo(activeName, todo.id) }
                          else{ await undoneTodo(activeName, todo.id) }
                          const updatedTodos = await getTodos(activeName)
                          setTodos(updatedTodos)
                          setEditingTodoId(null)
                          setFormErrors({})
                          setForm({title: '', description: '', date_from: '', date_to: ''})
                          setSubmitError('')
                        } catch(cause){
                          setSubmitError(cause.message)
                        }
                      }}>{todo.is_finished ? 'undone' : 'done' }</button>

                    </div>


                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        {loaded && (
            <section>
              <h2>{editingTodoId === null ? 'Nová úloha' : 'Upraviť úlohu'}</h2>

              <form onSubmit={async (event) => {
                event.preventDefault()
                const errors = {};
                if(form.title.trim().length === 0 || form.title.length > 200) {errors.title = 'dlzka hlavy musi byt v rozsahu (0;200] znakov'}
                if(form.description.length > 1000) {errors.description = 'dlzka opisu musi byt v rozsahu [0;1000] znakov'}
                if(!form.date_from) {errors.date_from = 'datum od musi existovat'}
                if((new Date(form.date_from) > new Date(form.date_to)) || !form.date_to) {errors.date_to = 'datum od musi existovat a nesmie prekrocit datum do'}
                setFormErrors(errors)

                if (Object.keys(errors).length > 0) {
                  return
                }
                const startIso = new Date(form.date_from).toISOString()
                console.log(startIso)
                const endIso = new Date(form.date_to).toISOString()
                console.log(endIso)

                const editingTodo = todos.find((todo) => todo.id === editingTodoId)

                const todoData = {
                  title: form.title.trim(),
                  description: form.description,
                  date_from: startIso,
                  date_to: endIso,
                  is_finished: editingTodo?.is_finished ?? false
                }
                setSubmitError('')

                if(editingTodoId === null){
                  try{
                    await createTodo(activeName, todoData)
                    const updatedTodos = await getTodos(activeName)
                    setTodos(updatedTodos)
                    setEditingTodoId(null)
                    setFormErrors({})
                    setForm({title: '', description: '', date_from: '', date_to: ''})
                    setSubmitError('')
                  } catch (cause) {
                    setSubmitError(cause.message)
                  }
                }
                else{
                  try{
                    await editTodo(activeName, editingTodoId, todoData)
                    const updatedTodos = await getTodos(activeName)
                    setEditingTodoId(null)
                    setTodos(updatedTodos)
                    setFormErrors({})
                    setForm({title: '', description: '', date_from: '', date_to: ''})
                    setSubmitError('')
                  } catch (cause) {
                    setSubmitError(cause.message)
                  }
                }


                console.log(form);
              }}>
                <label htmlFor="todo-title">Názov</label>
                <input
                    id="todo-title"
                    value={form.title}
                    onChange={(event) =>
                        setForm({ ...form, title: event.target.value })
                    }
                />
                {formErrors.title && <p className="error">{formErrors.title}</p>}
                <label htmlFor="todo-description">Popis</label>
                <input
                    id="todo-description"
                    value={form.description}
                    onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                }
                />
                {formErrors.description && <p className="error">{formErrors.description}</p>}
                <label htmlFor="todo-date-from">Datum od</label>
                <input
                    id="todo-date-from"
                    type="datetime-local"
                    value={form.date_from}
                    onChange={(event) =>
                        setForm({ ...form, date_from: event.target.value }) // type="datetime-local"
                    }
                />
                {formErrors.date_from && <p className="error">{formErrors.date_from}</p>}
                <label htmlFor="todo-date-to">Datum do</label>
                <input
                    id="todo-date-to"
                    type="datetime-local"
                    value={form.date_to}
                    onChange={(event) =>
                        setForm({ ...form, date_to: event.target.value })
                    }
                />
                {formErrors.date_to && <p className="error">{formErrors.date_to}</p>}
                <p><button type="submit">Uložiť</button></p>

                {submitError && <p className="error">{submitError}</p>}


                {editingTodoId !== null &&(
                    <button type="button" onClick={() => {
                      setEditingTodoId(null)
                      setFormErrors({})
                      setForm({title: '', description: '', date_from: '', date_to: ''})
                      setSubmitError('')
                    }}>
                      Zrušiť
                    </button>
                )}

                <button type="button" onClick={async() => {
                  if (!window.confirm('ano naozaj?')) {
                    return
                  }
                  try{
                    await resetTodo(activeName)
                    const updatedTodos = await getTodos(activeName)
                    setTodos(updatedTodos)
                    setEditingTodoId(null)
                    setFormErrors({})
                    setForm({title: '', description: '', date_from: '', date_to: ''})
                    setSubmitError('')
                  } catch(cause){
                    setSubmitError(cause.message)
                  }
                }}>reset</button>
              </form>
            </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">Môj TODO List · React, Vite</div>
      </footer>
    </div>
  )
}
