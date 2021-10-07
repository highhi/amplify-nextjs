import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { App } from '../App'
import React, { useEffect, useState, useCallback } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'

import awsExports from '../aws-exports';
Amplify.configure(awsExports);

type Todo = {
  id?: string;
  name: string
  description: string;
}

export const getStaticProps: GetStaticProps<{ todos: Todo[] }> = async (context) => {
  let todos: Todo[] = []

  try {
    const todoData = await API.graphql(graphqlOperation(listTodos))
    // @ts-ignore
    todos = todoData.data.listTodos.items
  } catch (err) {
    console.log('error fetching todos')
  }
  
  return {
    props: {
      todos,
    }
  }
}

export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <App todos={props.todos} />
  )
}

