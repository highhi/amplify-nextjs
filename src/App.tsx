import React, { useEffect, useState, useCallback } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'

import awsExports from './aws-exports';
Amplify.configure(awsExports);

type Todo = {
  id?: string;
  name: string
  description: string;
}

const initialState: Todo = { name: '', description: '' }



export const App = (props: { todos: Todos[] }) => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState<Todo[]>([...props.todos])

  const onInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [event.currentTarget.name]: event.currentTarget.value })
  }, [])

  const fetchTodos = async (): Promise<void> => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      // @ts-ignore
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  // useEffect(() => {
  //   fetchTodos()
  // }, [])

  const addTodo = async () => {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div> 
      <h2>Amplify Todos</h2>
      <input type="text" onChange={onInput} name="name" value={formState.name} placeholder="Name" />
      <input type="text" onChange={onInput} name="description" value={formState.description} placeholder="Name" />
      <button type="button" onClick={addTodo}>Create Todo</button>

      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index}>
            <p>{todo.name}</p>
            <p>{todo.description}</p>
          </div>
        ))
      }
    </div>
  )
}

