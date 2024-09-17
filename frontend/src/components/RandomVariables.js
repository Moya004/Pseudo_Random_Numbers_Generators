import React, { useState, useEffect } from 'react';
import NumberChart from './NumberChart';

function RandomVariables({ numbers, reset, onNumbersGenerated}) {
    const [selectedTest, setSelectedTest] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mean, setMean] = useState(null); // Para distribuciones que requieran media
    const [range, setRange] = useState({ a: ' ', b: ' ' }); // Para distribuciones con rango
    const [eventType, setEventType] = useState(''); // Para experimentos
    const [eventResult, setEventResult] = useState(null);

    const tests = [
        'Distribución Exponencial',
        'Distribución Poisson',
        'Distribución Uniforme entre a - b',
        'Eventos'
    ];

    useEffect(() => {
        setTestResult(null);
        setEventResult(null);
        setSelectedTest('');
        setMean(null);
        setRange({ a: '', b: '' });
    }, [reset]);

    const handleTestSelection = async (test) => {
        if (!numbers || numbers.length === 0) {
            alert('No hay números generados para generar variables aleatorias.');
            setIsVisible(false);
            return;
        }

        // Validación para las distribuciones que requieren un rango
        if (test === 'Distribución Uniforme entre a - b') {
            if (range.a === '' || range.b === '' || parseFloat(range.a) >= parseFloat(range.b)) {
                alert('Por favor ingrese un valor válido para a y b (a < b).');
                return;
            }
        }

        // Calcular el promedio de los números generados
        const calculatedMean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
        setMean(calculatedMean);

        // Creación del objeto JSON para enviar al backend
        const dataToSend = {
            dist: test,
            data: numbers,
            mean: calculatedMean || null, // Solo para distribuciones que lo necesiten
            rango: test === 'Distribución Uniforme entre a - b' ? [range.a, range.b] : []
        };

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/transformToVariable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            setTestResult(result);
            onNumbersGenerated(result);
            
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const handleEventExperiment = async (eventType) => {
        if (!numbers || numbers.length === 0) {
            alert('No hay números disponibles para realizar el experimento.');
            return;
        }

        // Creación del objeto JSON para enviar al backend para el experimento
        const experimentData = {
            data: numbers,
            event_type: eventType,
            value_x: 10, // Ejemplo: valor x puede ser dinámico basado en el tipo de evento
            range_a: range.a || null,
            range_b: range.b || null,
        };

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/experiment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(experimentData),
            });

            const result = await response.json();
            setEventResult(result.probability);
        } catch (error) {
            console.error('Error al realizar el experimento:', error);
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        setTestResult(null); 
        setEventResult(null);
    };

    return (
        <div className="dropdown">
            <button 
                className="btn custom-button4"
                onClick={toggleVisibility}
                id="dropdownMenuButton"
                aria-haspopup="true" 
                aria-expanded={isVisible}
            >
                Generar variables aleatorias <i className="bi bi-caret-down-fill"></i>
            </button>
            {isVisible && (
                <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                    {tests.map((test, index) => (
                        <button 
                            key={index} 
                            className="dropdown-item"
                            onClick={() => handleTestSelection(test)}
                            style={{ fontFamily: 'Helvetica', fontSize: '14px' }}
                        >
                            {test}
                        </button>
                    ))}
                </div>
            )}
            {selectedTest === 'Distribución Uniforme entre a - b' && (
                <div className="range-inputs">
                    <label>
                        a: 
                        <input 
                            type="number" 
                            value={range.a} 
                            onChange={(e) => setRange({ ...range, a: e.target.value })} 
                        />
                    </label>
                    <label>
                        b: 
                        <input 
                            type="number" 
                            value={range.b} 
                            onChange={(e) => setRange({ ...range, b: e.target.value })} 
                        />
                    </label>
                </div>
            )}
            {testResult && (
                <div className="test-result mt-3">
                    <h5>Resultado: {JSON.stringify(testResult)}</h5>
                </div>
            )}

            {/* Botón y sección para experimentos */}
            <div className="experiment-section">
                {eventResult && (
                    <div className="experiment-result mt-3">
                        <h5>Resultado del experimento: {eventResult}</h5>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RandomVariables;
