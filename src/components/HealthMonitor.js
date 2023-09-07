// import { Chart } from 'react-chartjs-2'
import Chart from 'chart.js/auto';
// import Chart from 'chart.js'
import { useRef, useEffect, useState } from 'react'

const generateBlankData = () => {
    const hoursArray = []
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j++) {
            const hourString = i.toString().padStart(2, '0')
            const minuteString = j.toString().padStart(2, '0')
            hoursArray.push(hourString + minuteString);
        }
    }
    return hoursArray

    // const hoursArray = []
    // for (let i = 1; i < 24; i++) {
    //     const hourString = i.toString().padStart(2, '0') + '00';
    //     hoursArray.push(hourString)
    // }
    // return hoursArray
}

const fillData = (baseData, inputData) => {
    let filledData = []

    baseData.map((hour) => {
        const index = inputData.labels.indexOf(hour);
        if (index !== -1) {
            filledData.push(inputData.data[index]);

        } else {
            filledData.push(null)
        }
        
    })
    return filledData
}

const HealthMonitor = ({data}) => {
    const chartRef = useRef(null)

    const baseLabels = generateBlankData()
    const fillDataWithBaseLabels = (labelName) => {
        return fillData(baseLabels, {
            labels: data.labels,
            data: data.datasets.find(dataset => dataset.label === labelName).data
        })
    }

    const respiratoryRateData = fillDataWithBaseLabels('Respiratory Rate')
    const pulseRateData = fillDataWithBaseLabels('Pulse Rate')
    const temperatureData = fillDataWithBaseLabels('Temperature')
    
    const [labels, setLabels] = useState([...baseLabels]) // Start with Day 1 labels

    const handleAddDay = () => {
        const newLabels = baseLabels.map(label => `${label}`)
        setLabels(prevLabels => [...prevLabels, ...newLabels])
    }

    const handleRemoveDay = () => {
        if (labels.length > 24) { // Ensure there's more than one day to remove
            setLabels(prevLabels => prevLabels.slice(0, -24)) // Remove the last 24 hours
        }
    }

    // const respiratoryRateData = fillData(baseLabels, {
    //     labels: data.labels,
    //     data: data.datasets.find(dataset => dataset.label === 'Respiratory Rate').data
    // })

    // const pulseRateData = fillData(baseLabels, {
    //     labels: data.labels,
    //     data: data.datasets.find(dataset => dataset.label === 'Pulse Rate').data
    // })

    // const temperatureData = fillData(baseLabels, {
    //     labels: data.labels,
    //     data: data.datasets.find(dataset => dataset.label === 'Temperature').data
    // })

    // const chartData = {
    //     labels: labels,
    //     datasets: [
    //         {
    //             label: 'Respiratory Rate',
    //             data: respiratoryRateData,
    //             borderColor: '#FF5733',
    //             backgroundColor: 'rgba(255, 87, 51, 0.2)',
    //             fill: false,
    //             borderWidth: 2,
    //             spanGaps: true

    //         },
    //         {
    //             label: 'Pulse Rate',
    //             data: pulseRateData,
    //             borderColor: '#33FF57',
    //             backgroundColor: 'rgba(51, 255, 87, 0.2)',
    //             fill: false,
    //             borderWidth: 2,
    //             spanGaps: true

    //         },
    //         {
    //             label: 'Temperature',
    //             data: temperatureData,
    //             borderColor: '#3357FF',
    //             backgroundColor: 'rgba(51, 87, 255, 0.2)',
    //             fill: false,
    //             borderWidth: 2,
    //             spanGaps: true

    //         }
    //     ]
    // }
    // console.log(chartData)

    useEffect(() => {
        
        // If there's an existing chart instance, destroy it
        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }
    
        const ctx = document.getElementById('myChart').getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Respiratory Rate',
                        data: respiratoryRateData,
                        borderColor: '#FF5733',
                        backgroundColor: 'rgba(255, 87, 51, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,
                        pointRadius: 5,

                    },
                    {
                        label: 'Pulse Rate',
                        data: pulseRateData,
                        borderColor: '#33FF57',
                        backgroundColor: 'rgba(51, 255, 87, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,
                        pointRadius: 5,

                    },
                    {
                        label: 'Temperature',
                        data: temperatureData,
                        borderColor: '#3357FF',
                        backgroundColor: 'rgba(51, 87, 255, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,

                    }
                ]
            },
            options: {
                // responsive: true,
                // maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 12 // change the value as needed
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 12 // change the value as needed
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        font: {
                            size: 24 // change the value as needed
                        }
                    }
                }
            }
            // Add other configuration options if needed
        });
    
        chartRef.current = newChartInstance

        return () => {
          // Cleanup: destroy chart instance before unmounting component
          if (chartRef.current) {
            chartRef.current.destroy();
          }
        }
    }, [data, respiratoryRateData, pulseRateData, temperatureData])  

    return (
        <div className="flex h-screen">
            <div className="w-full max-w-6xl p-4">
                <canvas id="myChart"></canvas>
                <button onClick={handleAddDay}>Add Day</button>
                <button onClick={handleRemoveDay}>Remove Day</button>
                
            </div>
        </div>
    )
}

export default HealthMonitor