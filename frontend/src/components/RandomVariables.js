import React, { useState, useEffect } from 'react';
import NumberChart from './NumberChart';
import CSVExporter from './CSVExporter'; 

function RandomVariables({ numbers, reset, onNumbersGenerated }) {
    const [testResult, setTestResult] = useState(null);
    const [generatedVariables, setGeneratedVariables] = useState([]); // Para las variables generadas
    const [isVisible, setIsVisible] = useState(false);
    const [range, setRange] = useState({ a: 0.0, b: 0.0});
    const [event, setEvent] = useState(null);
    const [experiment, setExperiment] = useState(null)
    const [eventParams, setEventParams] = useState({});

    const tests = [
        'Distribución Exponencial',
        'Distribución Poisson',
        'Distribución Uniforme entre a - b',
        'Eventos'
    ];

    const events = [
        'equalX', 'lessThanX', 'lessEqualThanX', 'greaterThanX', 'greaterEqualThanX',
        'inRangeCloseOpen', 'inRangeCloseClose', 'inRangeOpenClose', 'inRangeOpenOpen'
    ];

    useEffect(() => {
        setTestResult(null);
        setRange({ a: '', b: '' });
        setEvent(null);
        setEventParams({});
        setGeneratedVariables([]); // Reinicia las variables generadas cada vez que se haga reset
    }, [reset]);

    const handleTestSelection = async (test) => {
        setEvent(null);
        setEventParams({});
        setRange({ a: 0, b: 0});
        setGeneratedVariables([]); // Reinicia las variables generadas al seleccionar una nueva opción

        let dataToSend = {
            dist: test,
            data: numbers,
            mean: null,
            rango: [0, 0]
        };

        if (!numbers || numbers.length === 0) {
            alert('No hay números generados para generar variables aleatorias.');
            setIsVisible(false);
            return;
        }

        if (test === 'Eventos') {
            setEvent('Eventos');
            return;
        }

        if (test === 'Distribución Uniforme entre a - b') {
            let a = parseFloat(prompt('Ingrese el valor de a:'));
            let b = parseFloat(prompt('Ingrese el valor de b:'));

            if (a === null || b === null || parseFloat(a) >= parseFloat(b)) {
                alert('Debe ingresar un valor válido para a y b, y a debe ser menor que b.');
                return;
            }

            dataToSend.rango = [a, b]
        }

        if (test === 'Distribución Exponencial' || test === 'Distribución Poisson' || test === 'Distribución Uniforme entre a - b') {
            dataToSend.mean = parseFloat(prompt('Ingrese la media:'));
        }

        console.log("Información enviada: " + JSON.stringify(dataToSend))

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/transformToVariable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            console.log("Recibido: " + result)
            setGeneratedVariables(result); // Guarda las nuevas variables generadas
            onNumbersGenerated(result); // Llama al callback con las nuevas variables
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const handleEventSelection = (selectedEvent) => {
        let params = {};
        switch (selectedEvent) {
            case 'equalX':
            case 'lessThanX':
            case 'lessEqualThanX':
            case 'greaterThanX':
            case 'greaterEqualThanX':
                params.value_x = parseFloat(prompt('Ingrese el valor de X:'));
                break;
            case 'inRangeCloseOpen':
            case 'inRangeCloseClose':
            case 'inRangeOpenClose':
            case 'inRangeOpenOpen':
                params.range_a = parseFloat(prompt('Ingrese el valor de A:'));
                params.range_b = parseFloat(prompt('Ingrese el valor de B:'));
                break;
            default:
                break;
        }

        setExperiment(selectedEvent);
        setEventParams(params);
        console.log(params)
    };

    const handleEventSubmit = async () => {
        console.log(event)
        if (event == "") return;

        const dataToSend = {
            data: numbers,
            event_type: experiment,
            value_x: eventParams.value_x,
            range_a: eventParams.range_a,
            range_b: eventParams.range_b,
            groupsOf: eventParams.groupsOf
        };

        console.log(JSON.stringify(dataToSend))

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/experiment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            console.log("Resultado: " + JSON.stringify(result))
            setTestResult(result);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        setTestResult(null);
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

            {event === 'Eventos' && (
                <div>
                    <select onChange={(e) => handleEventSelection(e.target.value)}>
                        <option value="">Seleccione un evento</option>
                        {events.map((event, index) => (
                            <option key={index} value={event}>{event}</option>
                        ))}
                    </select>

                    {event != "" && (
                        <button onClick={handleEventSubmit}>Enviar</button>
                    )}
                </div>
            )}

            {testResult && (
                <div className="test-result mt-3">
                    <h5>Resultado: {JSON.stringify(testResult)}</h5>
                </div>
            )}
        </div>
    );
}

export default RandomVariables;
