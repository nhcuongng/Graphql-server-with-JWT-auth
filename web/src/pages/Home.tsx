import React from 'react';
import { useUsersQuery } from '../generated/graphql';

export const Home: React.FC = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>Users:</p>
      <ul>
        {data.users.map(({ email, id }) => <li key={id}>{id}: {email}</li>)}
      </ul>
    </div>
  )
}