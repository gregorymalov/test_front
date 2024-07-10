import React, { useState, useEffect } from 'react';

function App() {
  const [counter, setCounter] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('');
  const [clickValue, setClickValue] = useState(1);
  const [incrementValue, setIncrementValue] = useState(1); // Изначальное значение инкремента

  useEffect(() => {
    if (userId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

      ws.onopen = () => {
        console.log('connected to websocket server');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCounter(data.counter);
        setEnergy(data.energy);
        if (data.increment_value !== undefined) {
          setIncrementValue(data.increment_value); // Обновляем значение инкремента при получении данных
        }
      };

      ws.onclose = () => {
        console.log('disconnected from websocket server');
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [userId]);

  const handleClick = () => {
    if (socket && energy >= clickValue) {
      socket.send(JSON.stringify({ action: 'increment', value: clickValue }));
    }
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleClickValueChange = (event) => {
    setClickValue(parseInt(event.target.value) || 1);
  };

  const handleIncrementValueChange = (event) => {
    setIncrementValue(parseInt(event.target.value) || 1);
  };

  const handleSetIncrementValue = () => {
    if (socket) {
      socket.send(JSON.stringify({ action: 'set_increment', new_increment_value: incrementValue }));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={handleUserIdChange}
        />
        <h1>Counter: {counter}</h1>
        <h2>Energy: {energy}</h2>
        <div>
          <input
            type="number"
            placeholder="Click value"
            value={clickValue}
            onChange={handleClickValueChange}
          />
          <button onClick={handleClick} disabled={energy < clickValue}>Click me!</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Increment value"
            value={incrementValue}
            onChange={handleIncrementValueChange}
          />
          <button onClick={handleSetIncrementValue}>Set Increment Value</button>
        </div>
      </header>
    </div>
  );
}

export default App;
