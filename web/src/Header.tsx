import React from 'react'
import { Link } from 'react-router-dom';
import { setToken } from './accessToken';
import { useLogoutMutation, useMeQuery } from './generated/graphql'

type TProp = {

}

export const Header: React.FC<TProp> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: React.ReactNode = '';

  if (loading) {
    body = '';
  } else if (data && data.me) {
    body = `you are logged in as ${data.me.email}`;
  } else {
    body = 'Not log in';
  }

  console.log(body)

  return (
    <>
      <div><Link to="/">home</Link></div>
      <div><Link to="/register">resgister</Link></div>
      <div><Link to="/login">login</Link></div>
      <div><Link to="/bye">bye</Link></div>
      {!loading && data?.me && (
         <button onClick={async () => {
          await logout();
          setToken('');
          await client.resetStore();
        }}>Log out</button>
      )}
      {body}
    </>
  )
}