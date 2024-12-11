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
    street: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert("Formulário enviado com sucesso! Verifique os dados no console.");
  };

  return (
<form onSubmit={handleSubmit}>
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
  
  <div className="form-row">
    <div>
      <label htmlFor="bedrooms">Quartos:</label>
      <input
        type="number"
        id="bedrooms"
        name="bedrooms"
        value={formData.bedrooms}
        onChange={handleChange}
        required
      />
    </div>
    <div>
      <label htmlFor="suites">Suítes:</label>
      <input
        type="number"
        id="suites"
        name="suites"
        value={formData.suites}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <div className="form-row">
    <div>
      <label htmlFor="garages">Garagens:</label>
      <input
        type="number"
        id="garages"
        name="garages"
        value={formData.garages}
        onChange={handleChange}
        required
      />
    </div>
    <div>
      <label htmlFor="bathrooms">Banheiros:</label>
      <input
        type="number"
        id="bathrooms"
        name="bathrooms"
        value={formData.bathrooms}
        onChange={handleChange}
        required
      />
    </div>
  </div>
  
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

  <div>
    <label htmlFor="street">Rua:</label>
    <input
      type="text"
      id="street"
      name="street"
      value={formData.street}
      onChange={handleChange}
      required
    />
  </div>

  <button type="submit">Enviar</button>
</form>

  );
}

export default RealEstateForm;
