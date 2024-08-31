import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import AlgorithmForm from './components/AlgorithmForm';
import NumberChart from './components/NumberChart';
import CSVExporter from './components/CSVExporter';
import './styles.css';
import './App.css' 

function App() {
    const [numbers, setNumbers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showForm, setShowForm] = useState(false); 
    const [showResults, setShowResults] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');


    const handleGenerate = async (algorithm, count, params) => {
      if (algorithm === 'Select an algorithm') {
        setNumbers([]);
        setSelectedAlgorithm('');
        setShowResults(false);
        return;
      }
      setSelectedAlgorithm(algorithm);
        
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
        setSelectedAlgorithm('');
      };

    return (
        <div className="app-container">
          <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="logo"></h1>
            <nav>
              <ul className="nav-list d-flex list-unstyled">
                <li className="mx-3"><button href="#" onClick={toggleFormVisibility} className="btn btn-secundary">Generar números aleatorios</button></li>
                <li className="mx-3"><button href="#" className="btn btn-secundary">Pruebas estadistícas</button></li>
                <li className="mx-3"><CSVExporter numbers={numbers} algorithm={selectedAlgorithm} /></li>
                <li className="mx-3"><button href="#" className="btn btn-secundary">Importar archivo CSV</button></li>
              </ul>
            </nav>
          </header>
          <main>
            {showForm && <AlgorithmForm onGenerate={handleGenerate} />} { }
            {showResults && numbers.length > 0 &&
            (
                <NumberChart 
                    numbers={numbers} 
                    onSelect={handleSelect} 
                    selectedIndex={selectedIndex} 
                />
            )}
          </main>
        </div>
      );    
}

export default App;
