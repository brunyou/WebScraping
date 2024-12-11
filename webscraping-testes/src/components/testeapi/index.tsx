import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function TesteApi() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/')
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);

  return <h1>{message}</h1>;
}

export default TesteApi;
