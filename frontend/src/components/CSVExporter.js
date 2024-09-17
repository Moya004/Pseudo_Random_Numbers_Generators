import React from 'react';

const CSVExporter = ({ numbers, algorithm, fileImported}) => {
    const handleExportCSV = () => {

        if (fileImported) {
            exportCSV(numbers);
            return;
        }

        if (!algorithm || algorithm === 'select an algorithm') {
            alert('Por favor selecciona un algoritmo antes de exportar.');
            return;
        }

        if (!numbers || numbers.length === 0) {
            alert('No hay números generados para exportar.');
            return;
        }

        exportCSV(numbers);
    };

    const exportCSV=(numbers) =>
    {
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
        <button onClick={handleExportCSV} className="btn custom-button1">
            Exportar archivo CSV
        </button>
    );
};

export default CSVExporter;
