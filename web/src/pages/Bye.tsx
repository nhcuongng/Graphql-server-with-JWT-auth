import React from 'react'
import { useByeQuery } from '../generated/graphql'

type TProp = {

}

export const Bye: React.FC<TProp> = () => {
  const { data, loading, error } = useByeQuery({ fetchPolicy: 'network-only' });

  if (loading) {
    return <div>Loading....</div>
  }

  if (error) {
    console.log(error);
    return <div>err</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <>
      {data.bye}
    </>
  )
}