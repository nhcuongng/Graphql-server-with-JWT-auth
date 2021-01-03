import React from 'react';
import { useHelloQuery } from './generated/graphql';

function App() {
  const { data, loading } = useHelloQuery();

  if (loading || !data) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      {data.hello}
    </div>
  );
}

export default App;
