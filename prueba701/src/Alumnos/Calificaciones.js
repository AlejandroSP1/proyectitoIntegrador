import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registramos los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Practicas = () => {
    const [datos, setDatos] = useState([]);
    const [promedios, setPromedios] = useState([]);

    // Obtener los datos de la API
    useEffect(() => {
        const obtenerDatos = async () => {
            const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
            const data = await response.json();
            setDatos(data);
            calcularPromedios(data);
        };
        obtenerDatos();
    }, []);

    // Calcular el promedio de calificaciones por alumno
    const calcularPromedios = (data) => {
        const promedios = data.map(alumno => {
            const calificaciones = Object.values(alumno.practicas).map(Number);
            const promedio = calificaciones.reduce((acc, val) => acc + val, 0) / calificaciones.length;
            return promedio;
        });
        setPromedios(promedios);
    };

    // Configuración de las gráficas por alumno
    const obtenerDatosGraficaAlumno = (practicas) => {
        const etiquetas = Object.keys(practicas);
        const calificaciones = Object.values(practicas).map(Number);

        return {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Calificaciones de Prácticas',
                    data: calificaciones,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

// Configuración de la gráfica general de todos los alumnos
const obtenerDatosGraficaGeneral = () => {
    return {
        labels: datos.map((alumno) => alumno.nombre), // Usar el nombre del alumno en lugar de "Alumno 1"
        datasets: [
            {
                label: 'Promedio de Calificaciones por Alumno',
                data: promedios,
                backgroundColor: promedios.map(promedio => promedio >= 7 ? 'rgba(76, 175, 80, 0.6)' : 'rgba(255, 99, 132, 0.6)'), // Verde si aprobado, rojo si reprobado
                borderColor: promedios.map(promedio => promedio >= 7 ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 1,
            },
        ],
    };
};

return (
    <div>
        <h1 style={{ textAlign: 'center' }}>Listado de Alumnos y sus Calificaciones</h1>
         {/* Tarjetas para cada alumno con su gráfica individual */}
         <div className="alumnos-lista">
                {datos.length === 0 ? (
                    <p>Cargando...</p>
                ) : (
                    datos.map((alumno, index) => (
                        <div key={alumno.id} className="alumno-card">
                            <p><strong>Nombre:</strong> {alumno.nombre}</p>
                            <p><strong>ID:</strong> {alumno.id}</p>
                            <p><strong>Cuenta:</strong> {alumno.cuenta}</p>
                            <Bar data={obtenerDatosGraficaAlumno(alumno.practicas)} />
                            <p><strong>Promedio:</strong> {promedios[index].toFixed(2)}</p>
                            {/* Mostrar si está aprobado o reprobado */}
                            <input
                                type="text"
                                value={promedios[index] >= 7 ? 'Aprobado' : 'Reprobado'}
                                style={{
                                    color: promedios[index] >= 7 ? 'green' : 'red',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                }}
                                readOnly
                                />
                            </div>
                        ))
                    )}
                </div>
    
                {/* Gráfica general de promedios de todos los alumnos */}
                <div className="grafica-general">
                    <h2>Promedio General de Calificaciones</h2>
                    {promedios.length > 0 && <Bar data={obtenerDatosGraficaGeneral()} />}
                </div>
            </div>
        );
    };
    
    export default Practicas;

