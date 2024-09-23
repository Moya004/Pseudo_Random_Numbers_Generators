import React, { useState, useEffect} from 'react';

function StatisticalTests({ numbers, reset}) {
    const [selectedTest, setSelectedTest] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const tests = [
        'Promedios',
        'Frecuencias',
        'Kolmogorov-smirnov',
        'Series',
        'Poker'
    ];

    useEffect(() => {
        setTestResult(null);
        setSelectedTest('');
    }, [reset]);

    const handleTestSelection = async (test) => {
        
        if (!numbers || numbers.length === 0) {
            alert('No hay números generados para realizar pruebas estadistícas.');
            setIsVisible(false);
            return;
        }
        
        setSelectedTest(test);
        
        const requestData = {
            prueba: test,
            datos: numbers
        }
        console.log(requestData)

        try {
            const response = await fetch('https://pseudo-random-numbers-generators.onrender.com/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            alert(data.passed ? 'Pasó 😊' : 'No pasó 😞');
            setIsVisible(false);

        } catch (error) {
            setIsVisible(false);
            console.error('Error al realizar la prueba:', error);
            alert('Error al realizar la prueba 😞');
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        setTestResult(null); 
    };
      
    return (
        <div className="dropdown">
            <button 
                className="btn custom-button3"
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
                            style={{ fontFamily: 'Helvetica', fontSize: '14px' }}
                            
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
