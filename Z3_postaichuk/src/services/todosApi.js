const API_BASE = import.meta.env.DEV ? '/api' : 'https://wt1zadanie.iolab.sk/api'

export async function getTodos(name) {
  const url = `${API_BASE}/${encodeURIComponent(name)}`
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo načítať (HTTP ${response.status}).`)
  }

  const student = await response.json()
  return student.todos
}

export async function createTodo(name, form) {
  const url = `${API_BASE}/${encodeURIComponent(name)}`
  const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(form)})

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo vytvorit (HTTP ${response.status}).`)
  }

  return await response.json()
}

export async function editTodo(name, todoId, updatedTodo) {
  const url = `${API_BASE}/${encodeURIComponent(name)}/${todoId}`
  const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(updatedTodo)})


  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo zmenit (HTTP ${response.status}).`)
  }

  return await response.json()
}

export async function deleteTodo(name, todoId) {
  const url = `${API_BASE}/${encodeURIComponent(name)}/${todoId}`
  const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json'}})

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo vymazat (HTTP ${response.status}).`)
  }
}

export async function doneTodo(name, todoId) {
  const url = `${API_BASE}/${encodeURIComponent(name)}/${todoId}/done`
  const response = await fetch(url, {method: 'PATCH', headers: {'Content-Type': 'application/json'}})

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo ukoncit (HTTP ${response.status}).`)
  }
  return await response.json()
}

export async function undoneTodo(name, todoId) {
  const url = `${API_BASE}/${encodeURIComponent(name)}/${todoId}/undone`
  const response = await fetch(url, {method: 'PATCH', headers: {'Content-Type': 'application/json'}})

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo startovat (HTTP ${response.status}).`)
  }
  return await response.json()
}

export async function resetTodo(name) {
  const url = `${API_BASE}/${encodeURIComponent(name)}/reset`
  const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}})

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Tento identifikátor nie je na serveri povolený. Skontrolujte ho.')
    }
    throw new Error(`Úlohy sa nepodarilo resetovat (HTTP ${response.status}).`)
  }
  return await response.json()
}