import React, { useEffect, useState } from 'react'
import { setToken } from './accessToken';
import { Routes } from './Routes'

type TProp = {

}

export const App: React.FC<TProp> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "http://localhost:3000/refresh_token",
      { credentials: 'include', method: 'POST' }
    )
      .then(async (x) => {
        const { accessToken } = await x.json();
        console.log({ accessToken })
        setToken(accessToken);
        setLoading(false);
      })
  },[])

  if (loading) {
    return <div>Loading...</div>
  }

  return <Routes />
}