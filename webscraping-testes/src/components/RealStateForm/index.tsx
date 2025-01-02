import React, { useState } from 'react';
import './style.css';

function RealEstateForm() {
  const [formData, setFormData] = useState({
    squareMeters: '',
    bedrooms: '',
    suites: '',
    garages: '',
    bathrooms: '',
    city: '',
    neighborhood: '',
    street: '',
  });

  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { city, neighborhood } = formData;

    if (!city || !neighborhood) {
      setError('Por favor, preencha a cidade e o bairro.');
      return;
    }

    try {
      setError('');
      const response = await fetch(
        `http://localhost:5000/scrape?bairro=${encodeURIComponent(
          neighborhood
        )}&cidade=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados. Tente novamente mais tarde.');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao buscar dados.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="real-estate-form">
        {/* Campos do formulário */}
        <div>
          <label htmlFor="squareMeters">Metros quadrados:</label>
          <input
            type="number"
            id="squareMeters"
            name="squareMeters"
            value={formData.squareMeters}
            onChange={handleChange}
            required
          />
        </div>
        {/* Outros campos... */}
        <div>
          <label htmlFor="city">Cidade:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="neighborhood">Bairro:</label>
          <input
            type="text"
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Buscar Imóveis</button>
      </form>

      {/* Exibe erros */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Exibe resultados */}
      {results.length > 0 && (
        <div>
          <h2>Resultados:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <strong>{result.title}</strong>
                <p>{result.price}</p>
                <p>{result.address}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RealEstateForm;
