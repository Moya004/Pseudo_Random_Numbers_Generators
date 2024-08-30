import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import AlgorithmForm from './components/AlgorithmForm';
import NumberList from './components/NumberList';
import NumberChart from './components/NumberChart';
import './styles.css';
import './App.css' // Importar los estilos

function App() {
    const [numbers, setNumbers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showForm, setShowForm] = useState(false); 
    const [showResults, setShowResults] = useState(false);


    const handleGenerate = async (algorithm, count, params) => {
        const formData = new FormData();
        formData.append('algorithm', algorithm);
        formData.append('count', count);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                formData.append(key, params[key]);
            }
        });

        const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/generate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        setNumbers(data);
        setSelectedIndex(null); 
        setShowResults(true);
    };

    const handleSelect = (index) => {
        setSelectedIndex(index);
    };

    const toggleFormVisibility = () => {
        setShowForm(true);
        setNumbers([]); 
        setSelectedIndex(null);
        setShowResults(false);
      };

    return (
        <div className="app-container">
          <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="logo"> </h1>
            <nav>
              <ul className="nav-list d-flex list-unstyled">
                <li className="mx-3"><a href="#" onClick={toggleFormVisibility}>Generar números aleatorios</a></li>
                <li className="mx-3"><a href="#">Pruebas estadistícas</a></li>
                <li className="mx-3"><a href="#">Exportar Archivos CSV</a></li>
                <li className="mx-3"><a href="#">Importar Archivos CSV</a></li>
              </ul>
            </nav>
          </header>
          <main>
            {showForm && <AlgorithmForm onGenerate={handleGenerate} />} { }
            {showResults && numbers.length > 0 &&
            (
            <div className="d-flex justify-content-between">
                <NumberList
                    numbers={numbers}
                    selectedIndex={selectedIndex}
                    onSelect={handleSelect}
                    itemsPerPage={10}
                />
                <NumberChart 
                    numbers={numbers} 
                    onSelect={handleSelect} 
                    selectedIndex={selectedIndex} 
                />
            </div>
            )}
          </main>
        </div>
      );    
}

export default App;
