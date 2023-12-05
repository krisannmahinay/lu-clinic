// import { Chart } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
// import Chart from 'chart.js'
import 'moment'
import 'chartjs-adapter-moment'
import { useRef, useEffect, useState } from 'react'


    // const hoursArray = []
    // for (let i = 1; i < 24; i++) {
    //     const hourString = i.toString().padStart(2, '0') + '00';
    //     hoursArray.push(hourString)
    // }
    // return hoursArray

const generateBlankData = () => {
    // const hoursArray = []
    // const totalHours = numberOfDays * 24

    // for (let i = 0; i < totalHours; i++) {
    //     for (let j = 0; j < 60; j++) {
    //         const hourString = (i % 24).toString().padStart(2, '0')
    //         const minuteString = j.toString().padStart(2, '0')
    //         hoursArray.push(hourString + minuteString)
    //     }
    // }
    // return hoursArray

    const hoursArray = []
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j++) {
            const hourString = i.toString().padStart(2, '0')
            const minuteString = j.toString().padStart(2, '0')
            hoursArray.push(hourString + minuteString);
        }
    }
    return hoursArray
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

const HealthMonitor = ({data, onSetHour, onInputtedRR, onInputtedPR, onInputtedTemp}) => {
    const chartRef = useRef(null)
    const currentDate = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const formattedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    const [displayedDateTime, setDisplayedDateTime] = useState("05 Oct 2023")
    const [displayedHour, setDisplayedHour] = useState('')
    const [addedSets, setAddedSets] = useState([])
    const [respiratoryRate, setRespiratoryRate] = useState('')
    const [pulseRate, setPulseRate] = useState('')
    const [temperature, setTemperature] = useState('')
    const [hasAddedDay, setHasAddedDay] = useState(false)
    const [hour, setHour] = useState('')

    const handleDateTimeChange = (e) => {
        setDisplayedDateTime(e.target.value)

        if (e.target.value !== formattedCurrentDate) {
            handleAddDay()
        }
    }

    const baseLabels = generateBlankData()
    // console.log(baseLabels)
    const fillDataWithBaseLabels = (labelName) => {
        return fillData(baseLabels, {
            labels: data.labels,
            data: data.datasets.find(dataset => dataset.label === labelName).data
        })
    }

    const handleHourChange = (e) => {
        const time = e.target.value // This will give something like "16:00"
        setDisplayedHour(time)

        const militaryTime = time.replace(':', ''); // Convert it to "1600"
        setHour(militaryTime)
        onSetHour(militaryTime)
    }

    const handleRespiratoryRateCahnge = (e) => {
        setRespiratoryRate(e.target.value)
        onInputtedRR(e.target.value)
    }

    const handlePulseRateChange = (e) => {
        setPulseRate(e.target.value)
        onInputtedPR(e.target.value)
    }

    const handleTemperatureChange = (e) => {
        setTemperature(e.target.value)
        onInputtedTemp(e.target.value)
    }

    const respiratoryRateData = fillDataWithBaseLabels('Respiratory Rate')
    const pulseRateData = fillDataWithBaseLabels('Pulse Rate')
    const temperatureData = fillDataWithBaseLabels('Temperature')
    
    const [labels, setLabels] = useState([...baseLabels]) // Start with Day 1 labels

    const handleAddDay = () => {
        // const newLabels = baseLabels.map(label => `${label}`)
        // setLabels(prevLabels => [...prevLabels, ...newLabels])
        if (hasAddedDay) return

        const newLabels = baseLabels.map(label => `${label}`);
        setLabels(prevLabels => [...prevLabels, ...newLabels]);

        setAddedSets(prevSets => [...prevSets, newLabels]);  // Remember this new set
        
        setHasAddedDay(true)
    }

    const handleRemoveDay = () => {
        if (addedSets.length > 0) { 
            const lastAdded = addedSets[addedSets.length - 1];
            const lastAddedCount = lastAdded.length;
    
            setLabels(prevLabels => prevLabels.slice(0, -lastAddedCount));  // Remove the last added set
    
            setAddedSets(prevSets => prevSets.slice(0, -1));  // Forget the last added set
        }
        // if (labels.length > 24) { 
        //     setLabels(prevLabels => prevLabels.slice(0, -24)) 
        // }
    }
    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`
    const minTime = displayedDateTime === formattedCurrentDate ? currentTime : "00:00"

    useEffect(() => {
        if (displayedDateTime !== formattedCurrentDate && !hasAddedDay) {
            handleAddDay()
        }

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
                        // data: respiratoryRateData,
                        data: respiratoryRateData,
                        yAxisID: 'rr',
                        borderColor: '#0000FF',
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,
                        pointRadius: 3,

                    },
                    {
                        label: 'Pulse Rate',
                        data: pulseRateData,
                        yAxisID: 'pr',
                        borderColor: '#FF0000',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,
                        pointRadius: 3,

                    },
                    {
                        label: 'Temperature',
                        yAxisID: 'temperature',
                        data: temperatureData,
                        borderColor: '#FFFF00',
                        backgroundColor: 'rgba(255, 255, 0, 0.2)',
                        fill: false,
                        borderWidth: 2,
                        spanGaps: true,
                        pointRadius: 3,

                    }
                ]
            },
            options: {
                // responsive: true,
                // maintainAspectRatio: false,
                scales: {
                    x: {
                        // type: 'time',
                        // time: {
                        //     unit: 'year',
                        //     stepSize: 100,
                        //     // displayFormats: {
                        //     //     hour: 'HH:mm'
                        //     // }
                        // },
                        ticks: {
                            font: {
                                size: 12 // change the value as needed
                            }
                        }
                    },
                    temperature: {
                        type: 'linear',
                        position: 'left',
                        min: 30,
                        max: 44,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                if (value >= 35 && value <= 42) {
                                    return value;
                                }
                                return null;
                            },
                            
                        },
                        grid: {
                            drawBorder: true,
                            drawOnChartArea: false,
                            borderColor: '#000',  // border color
                            borderWidth: 1        // border width
                        }
                    },

                    
                    pr: {
                        type: 'linear',
                        position: 'left',  // All left, they'll overlap visually
                        min: 30,
                        max: 180,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                if (value >= 50 && value <= 180) {
                                    return value;
                                }
                                return null;
                            },
                            afterBuildTicks: function(scale) {
                                let temperatureScale = scale.chart.scales['temperature'];
                                
                                console.log(scale)
                                // Check if 180 exists in the PR ticks
                                if (scale.ticks.includes(180)) {
                                    temperatureScale.ticks = [null, null, 40, 39, 38, 37, 36, 35];
                                }
                                // Further adjustments can be added based on your requirements.
                            }
                        },
                        grid: {
                            drawBorder: true,
                            drawOnChartArea: false,
                            borderColor: '#000',  // border color
                            borderWidth: 1        // border width
                        }
                    },
                    rr: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: 150,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                if (value >= 10 && value <= 60) {
                                    return value;
                                }
                                return null;
                            }
                        },
                        grid: {
                            drawBorder: true,
                            drawOnChartArea: false,
                            borderColor: '#000',  // border color
                            borderWidth: 1        // border width
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
    }, [data, labels, respiratoryRateData, pulseRateData, temperatureData])  
    

    return (
        <div>
            <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                <div className="flex flex-col w-1/6">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Date</label>
                    <input type="text" value={displayedDateTime} onChange={handleDateTimeChange} readOnly className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    {/* <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Date | Time</label>
                    <input type="datetime-local" placeholder="Enter date/time" value={displayedDateTime} onChange={handleDateTimeChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" /> */}
                </div>
                <div className="flex flex-col w-1/6">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Hour</label>
                    <input type="time" placeholder="Enter hour" value={displayedHour} min={minTime} max="23:59"  onChange={handleHourChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    {/* <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Date | Time</label>
                    <input type="datetime-local" placeholder="Enter date/time" value={displayedDateTime} onChange={handleDateTimeChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" /> */}
                </div>
                <div className="flex flex-col w-1/6">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Respiratory Rate</label>
                    <input type="text" placeholder="Enter RR" value={respiratoryRate} onChange={handleRespiratoryRateCahnge} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-1/6">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Pulse Rate</label>
                    <input type="text" placeholder="Enter PR" value={pulseRate} onChange={handlePulseRateChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-1/6">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Temperature</label>
                    <input type="text" placeholder="Enter T" value={temperature} onChange={handleTemperatureChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
            </div>

            <div className="flex h-screen">
                <div className="w-full max-w-6xl p-4" style={{position: 'relative'}}>
                    <div style={{position: 'absolute', top: '4rem', left: '10px', fontSize: '10px', width: '5px', lineHeight: '.5rem', fontWeight: 700}}>RR cpm</div>
                    <div style={{ position: 'absolute', top: '4rem', left: 'calc(4% + 5px)', fontSize: '10px', width: '5px', lineHeight: '.5rem', fontWeight: 700}}>PR cpm</div>
                    <div style={{ position: 'absolute', top: '4rem', left: 'calc(7% + 5px)', fontSize: '10px', width: '5px', lineHeight: '.5rem', fontWeight: 700}}>Temp</div>
                    
                    <canvas id="myChart"></canvas>
                    <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                        <div className="flex flex-col w-[10rem]">
                            <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded mr-2" onClick={handleAddDay}>Add Day</button>
                        </div>

                        <div className="flex flex-col w-[10rem]">
                            <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded mr-2" onClick={handleRemoveDay}>Remove Day</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthMonitor