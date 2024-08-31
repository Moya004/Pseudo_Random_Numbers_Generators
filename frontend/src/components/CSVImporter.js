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

    return (
        <div className="csv-importer">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="form-control"
            />
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default CSVImporter;
