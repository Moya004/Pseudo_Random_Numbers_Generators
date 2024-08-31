import React, { useState } from 'react';

function StatisticalTests({ numbers }) {
    const [selectedTest, setSelectedTest] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const tests = [
        'Prueba 1',
        'Prueba 2',
        'Prueba 3',
        'Prueba 4',
        'Prueba 5'
    ];

    const handleTestSelection = async (event) => {
        setSelectedTest(test);

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    test: test,
                    numbers: numbers,
                }),
            });

            const data = await response.json();
            setTestResult(data.passed ? 'Pasó 😊' : 'No pasó 😞');
        } catch (error) {
            console.error('Error al realizar la prueba:', error);
            setTestResult('Error al realizar la prueba 😞');
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="dropdown">
            <button 
                className="btn btn-secundary" 
                onClick={toggleVisibility}
                id="dropdownMenuButton"
                aria-haspopup="true" 
                aria-expanded={isVisible}
            >
                Pruebas estadísticas <i className="bi bi-caret-down-fill"></i>
            </button>
            {isVisible && (
                <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                    {tests.map((test, index) => (
                        <button 
                            key={index} 
                            className="dropdown-item"
                            onClick={() => handleTestSelection(test)}
                        >
                            {test}
                        </button>
                    ))}
                </div>
            )}
            {testResult && (
                <div className="test-result mt-3">
                    <h5>{selectedTest}: {testResult}</h5>
                </div>
            )}
        </div>
    );
}

export default StatisticalTests;
