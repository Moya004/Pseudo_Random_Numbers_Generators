import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios para la gráfica
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DistributionChart({ data, distributionType }) {
    // Configuración de la gráfica según la distribución
    const chartData = {
        labels: data.map((_, index) => index + 1), // Etiquetas en el eje X, usando el índice de cada dato
        datasets: [
            {
                label: 'distribution',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            x: { title: { display: true, text: ' ' } },
            y: { title: { display: true, text: 'Valores' }, min: 0, max: 500 }, // Ajustar rango de y si es necesario
        },
    };

    useEffect(() => {
        // Si necesitas algún ajuste o efecto adicional cada vez que cambien los datos
    }, [data, distributionType]);

    return (
        <div style={{  width: '1000%', height: '500px', margin: '-1.5%',  marginLeft: '-2%', marginRight:'-30px', marginLeft: '200px' }}>
            <Line data={chartData}/>
        </div>
    );
}

export default DistributionChart;
