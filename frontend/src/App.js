import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import AlgorithmForm from './components/AlgorithmForm';
import NumberChart from './components/NumberChart';
import CSVExporter from './components/CSVExporter';
import CSVImporter from './components/CSVImporter';
import StatisticalTest from './components/StatisticalTest';
import './styles.css';
import './App.css' 

function App() {
    const [numbers, setNumbers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showForm, setShowForm] = useState(false); 
    const [showResults, setShowResults] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [showImporter, setShowImporter] = useState(false);
    const [showTest, setShowTest] = useState(false);
    const [showMainDesign, setShowMainDesign] = useState(true);


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

      if(showForm)
      {
        setShowForm(false);
        setShowMainDesign(true);
        setNumbers([]); 
        setShowResults(false);
        setSelectedAlgorithm('');

      } else{
        setShowForm(true);
        setNumbers([]); 
        setSelectedIndex(null);
        setShowResults(false);
        setSelectedAlgorithm('');
        setShowTest(false);
        setShowMainDesign(false);
      }
      };

      const toggleTestsVisibility = () => {
        setShowForm(false);
        setShowResults(false);
        setShowTest(!showTest); 
     };

      const handleFileUpload = (data) => {
        setNumbers(data.numbers);
      };

      const handleImportSuccess = () => {
        alert('Archivo importado y números procesados');
    };

    return (
        <div className="app-container">
        <header className="header-container"> <h1 className="title"> </h1>
            <nav>
              <ul className="nav-list d-flex list-unstyled">
                <li className="mx-3"><button href="#" onClick={toggleFormVisibility} className="btn custom-button">Generar números aleatorios</button></li>
                <li className="mx-3"><StatisticalTest numbers={numbers} /></li>
                <li className="mx-3"><CSVExporter numbers={numbers} algorithm={selectedAlgorithm} /></li>
                <li className="mx-3"><CSVImporter onFileUpload={handleFileUpload} onImportSuccess={handleImportSuccess}/></li>
              </ul>
            </nav>
          </header>
          {showMainDesign && (
           <div className="center-container">
            <div className="logo-container">
             <h1 className="title">Random Numbers Generator</h1>
         </div>
        </div>
        )}
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
