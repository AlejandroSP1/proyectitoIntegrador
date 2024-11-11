import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../App.css';

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [genderCount, setGenderCount] = useState({ M: 0, F: 0 });
    const [isDataUpdated, setIsDataUpdated] = useState(false);  // Flag para controlar la actualización de los datos

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDocentes(data);

                    // Contar el número de registros de cada género
                    const genderCounts = data.reduce(
                        (counts, docente) => {
                            if (docente.sexo === 'M') {
                                counts.M += 1;
                            } else if (docente.sexo === 'F') {
                                counts.F += 1;
                            }
                            return counts;
                        },
                        { M: 0, F: 0 }
                    );
                    setGenderCount(genderCounts);
                    setIsDataUpdated(true);  // Marcar que los datos se han actualizado
                } else {
                    throw new Error('Formato de datos no válido');
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 3000); // Actualización cada 3 segundos
        return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
    }, []);

    if (loading && !isDataUpdated) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const data = {
        labels: ['Masculino', 'Femenino'],
        datasets: [
            {
                label: 'Cantidad de docentes por género',
                data: [genderCount.M, genderCount.F],
                backgroundColor: ['#4CAF50', '#FF4081'],
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="container mt-5">
            <h1 className="titulo">DOCENTES INGENIERÍA INFORMÁTICA TESSFP</h1>
            
            {/* Tarjetas de docentes */}
            <div className="row">
                {docentes.map((docente) => (
                    <div key={docente.claveiss} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <p className="card-title">Clave ISSEMYN: <strong>{docente.claveiss}</strong></p>
                                <p className="card-text">Nombre: <strong>{docente.nombre}</strong></p>
                                <p className="card-text">Sexo: <strong>{docente.sexo}</strong></p>
                                <p className="card-text">Teléfono: <strong>{docente.telefono}</strong></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico */}
            <div className="chart-container mt-4" style={{ width: '50%', margin: '20px auto' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default ListaDocentes;
