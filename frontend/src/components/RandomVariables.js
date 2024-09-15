import React, { useState, useEffect} from 'react';

function RandomVariables({ numbers, reset }) {
    const [selectedTest, setSelectedTest] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const tests = [
        'Distribución Exponencial',
        'Distribución Poisson',
        'Distribución Uniforme entre 0 - 1',
        'Distribución Uniforme entre a - b',
    ];

    useEffect(() => {
        setTestResult(null);
        setSelectedTest('');
    }, [reset]);

    const handleTestSelection = async (test) => {
        
        if (!numbers || numbers.length === 0) {
            alert('No hay números generados para generar variables aleatorias.');
            setIsVisible(false);
            return;
        }

    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        setTestResult(null); 
    };
      
    return (
        <div className="dropdown">
            <button 
                className="btn custom-button"
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
            {testResult && (
                <div className="test-result mt-3">
                    <h5>{selectedTest}: {testResult}</h5>
                </div>
            )}
        </div>
    );
}

export default RandomVariables;