import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import AlgorithmForm from './components/AlgorithmForm';
import NumberChart from './components/NumberChart';
import './styles.css';
import './App.css' 

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

      const handleExportCSV = () => {
        if (numbers.length === 0) {
            alert('No hay números generados para exportar.');
            return;
        }

        // Generar contenido CSV
        const csvContent = 'data:text/csv;charset=utf-8,' + numbers.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'generated_numbers.csv');
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="app-container">
          <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="logo"></h1>
            <nav>
              <ul className="nav-list d-flex list-unstyled">
                <li className="mx-3"><a href="#" onClick={toggleFormVisibility}>Generar números aleatorios</a></li>
                <li className="mx-3"><a href="#">Pruebas estadistícas</a></li>
                <li className="mx-3"><a href="#"onClick={handleExportCSV}>Exportar archivo CSV</a></li>
                <li className="mx-3"><a href="#">Importar archivo CSV</a></li>
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
