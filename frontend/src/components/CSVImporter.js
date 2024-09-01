import React, { useState } from 'react';

const CSVImporter = ({ onFileUpload, onImportSuccess }) => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setError('');
            onFileUpload(file);
        } else {
            setError('Por favor, seleccione un archivo CSV válido.');
        }
    };

    const handleFileUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }
            return response.json();
        })
        .then(data => {
            console.log('Archivo procesado:', data);
            onFileUpload(data);
            setSuccessMessage('Archivo cargado correctamente. A continuación puede realizar pruebas estadísticas sobre el archivo cargado.');
            onImportSuccess();
        })
        .catch(error => {
            console.error('Error al subir el archivo:', error);
        });
    };

    return (
        <div className="csv-importer">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="form-control"
                style={{ display: 'none' }}
                id="file-input"
            />

            <button 
                onClick={() => document.getElementById('file-input').click()} 
                className="btn custom-button2"
            >
                Importar archivo CSV
            </button>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
        </div>
    );
};

export default CSVImporter;
