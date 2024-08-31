import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale);

const NumberChart = ({ numbers, onSelect, selectedIndex }) => {
    const data = {
        datasets: [{
            label: 'Generated Numbers',
            data: numbers.map((number, index) => ({
                x: number,
                y: index / numbers.length,
                index
            })),
            backgroundColor: numbers.map((_, index) =>
                index === selectedIndex ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)'
            ),
            borderColor: numbers.map((_, index) =>
                index === selectedIndex ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
            ),
            borderWidth: 5,
            pointRadius: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 0.1
                },
                title: {
                    display: true,
                    text: 'X-axis'
                }
            },
            y: {
                min: 0,
                max: 1,
                title: {
                    display: true,
                    text: 'Y-axis'
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                onSelect(index); // Envía el índice del número seleccionado
            }
        }
    };

    return (
        <div style={{ width: '1000%', height: '500px', margin: '2,5%',  marginLeft: '2%'}}>
            <Scatter data={data} options={options} />
        </div>
    );
};

export default NumberChart;
