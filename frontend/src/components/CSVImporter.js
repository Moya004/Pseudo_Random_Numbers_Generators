import React, { useState } from 'react';

const CSVImporter = ({ onFileUpload }) => {
    const [error, setError] = useState('');

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
                className="btn btn-secundary"
            >
                Importar archivo CSV
            </button>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default CSVImporter;
