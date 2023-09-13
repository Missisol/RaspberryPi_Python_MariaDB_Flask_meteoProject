const dateEl = document.querySelector('#local-date')

const temperatureDiv = document.getElementById("temperature");
const humidityDiv = document.getElementById("humidity");
const pressureDiv = document.getElementById("pressure");

const temperatureGaugeDiv = document.getElementById("temperature-gauge");
const humidityGaugeDiv = document.getElementById("humidity-gauge");
const pressureGaugeDiv = document.getElementById("pressure-gauge");
const gaugeDivs = [temperatureGaugeDiv, humidityGaugeDiv, pressureGaugeDiv] 

const temperatureHistoryDiv = document.getElementById("temperature-chart");
const humidityHistoryDiv = document.getElementById("humidity-chart");
const pressureHistoryDiv = document.getElementById("pressure-chart");
const historyDivs = [temperatureHistoryDiv, humidityHistoryDiv, pressureHistoryDiv]

const tempDeltaEl = document.querySelector('#temp-delta')

const gaugeDataArr = [
  { 
    name: 'temperature', 
    text: 'Температура, &deg;C',
    reference: 30,
    range: [null, 50],
    color: "#3ba639",
    steps: [
      { range: [0, 20], color: "#fff" },
      { range: [20, 30], color: "#aaffa9" },
      { range: [30, 50], color: "#ef7985" },
    ],
    value: 40,
  },
  { 
    name: 'humidity', 
    text: 'Влажность, %', 
    reference: 40,
    range: [null, 100],
    color: "#047df3",
    steps: [
      { range: [0, 40], color: "#fff" },
      { range: [40, 60], color: "#a6cdf3" },
      { range: [60, 100], color: "#70b0ef" },
    ],
    value: 70,
  },
  { 
    name: 'pressure', 
    text: 'Давление, мм.рт.ст.', 
    reference: 748,
    range: [700, 800],
    color: "#808080",
    steps: [
      { range: [700, 748], color: "#fff" },
      { range: [748, 800], color: "#cecece" },
    ],
    value: 760,
  },
];

// gauge layout
const layout = { 
  width: 300,
  height: 250, 
  margin: { t: 30, b: 30, l: 30, r: 30 },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

const historyDataArr = [
  { name: 'temperature', text: 'Температура', colorway: '3ba639' },
  { name: 'humidity', text: 'Влажность', colorway: '047df3' },
  { name: 'pressure', text: 'Давление', colorway: '808080'},
];

function getGaugePlotly() {
  gaugeDataArr.forEach((data, idx) => {
    const trace = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        title: { text: data.text },
        delta: { reference: data.reference },
        gauge: {
          axis: { range: data.range },
          bar: { color: data.color},
          steps: data.steps,
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: data.value,
          },
        },
      },
    ];
    Plotly.newPlot(gaugeDivs[idx], trace, layout, {displayModeBar: false});
  })
};

function getHystoryPlotly() {
  historyDataArr.forEach((data, idx) => {
    const trace = {
      x: [],
      y: [],
      name: data.name,
      mode: "lines+markers",
      type: "line",
    };
    const layout = {
      height: 300,
      title: {
        text: data.text,
      },
      font: {
        size: 14,
        color: "#808080",
      },
      colorway: [data.colorway],
    };
    Plotly.newPlot(historyDivs[idx], [trace], layout, config);
  })
};

function getDeltaPlotly() {
  let datesArr;
  let minTempArr;
  let maxTempArr;

  fetch('/tempDelta')
  .then((res) => res.json())
  .then((resJson) => {
    datesArr = resJson.dates;
    minTempArr = resJson.min_t;
    maxTempArr = resJson.max_t;

  const trace1 = {
    x: datesArr,
    y: minTempArr,
    marker: {
      color: 'rgba(1,1,1,0.0)',
    },
    type: 'bar',
  };
  const trace2 = {
    x: datesArr,
    y: maxTempArr,
    marker: {
      color: 'rgba(55,128,191,0.7)',
    },
    type: 'bar',
  };
  const data = [trace1, trace2];
  const layout = {
    title: 'Температурная дельта',
    barmode: 'stack',
    paper_bgcolor: 'rgba(245,246,249,1)',
    plot_bgcolor: 'rgba(245,246,249,1)',
    showlegend: false,
    annotations: []  
  };


  Plotly.newPlot(tempDeltaEl, data, layout, config)
})
};

function updateSensorReadings() {
  fetch(`/sensorDataReading`)
    .then((response) => response.json())
    .then((jsonResponse) => {
      const temperature = jsonResponse.temperature;
      const humidity = jsonResponse.humidity;
      const pressure = jsonResponse.pressure;
      const localDate = jsonResponse.date;

      updateBoxes(temperature, humidity, pressure, localDate);

      updateGauge(temperature, humidity, pressure);
    });
};

function updateBoxes(temperature, humidity, pressure, localDate) {
  temperatureDiv.innerHTML = temperature;
  humidityDiv.innerHTML = humidity;
  pressureDiv.innerHTML = pressure;
  dateEl.innerHTML = localDate;
}

function updateGauge(temperature, humidity, pressure) {
  const temperature_update = {
    value: temperature,
  };
  const humidity_update = {
    value: humidity,
  };
  const pressure_update = {
    value: pressure,
  };

  Plotly.update(temperatureGaugeDiv, temperature_update);
  Plotly.update(humidityGaugeDiv, humidity_update);
  Plotly.update(pressureGaugeDiv, pressure_update);
}

function updateLastData() {
  let datesArr;
  let temperatureArr;
  let humidityArr;
  let pressureArr;
  fetch('/lastDataReading')
    .then((res) => res.json())
    .then((jsonRes) => {
      datesArr = jsonRes.dates;
      temperatureArr = jsonRes.temperatures;
      humidityArr = jsonRes.humidities;
      pressureArr = jsonRes.pressures;

      updateCharts(
        datesArr,
        temperatureArr,
        temperatureHistoryDiv,
      );
      updateCharts(
        datesArr,
        humidityArr,
        humidityHistoryDiv,
      );
      updateCharts(
        datesArr,
        pressureArr,
        pressureHistoryDiv,
      );
  })
}

function updateCharts(xArray, yArray, historyDiv) {
  const data_update = {
    x: [xArray],
    y: [yArray],
  };
    Plotly.update(historyDiv, data_update);
}

function updateTempDelta() {
  let datesArr;
  let minTempArr;
  let maxTempArr;
  fetch('/tempDelta')
    .then((res) => res.json())
    .then((resJson) => {
      datesArr = resJson.dates;
      minTempArr = resJson.min_t;
      maxTempArr = resJson.max_t;
    })

    const data_update = [
      {
        x: [datesArr],
        y: [minTempArr],
      },
      {
        x: [datesArr],
        y: [maxTempArr],
      },
    ]

    Plotly.update(tempDeltaEl, data_update);
}

const timer = 30000
// const timer = 60 * 1000 * 5
// const timer = 60 * 1000 * 15 // every 15 minutes

function loop() {
  setTimeout(() => {
    updateSensorReadings();
    updateLastData();
    loop();
  }, timer);
}

(function init() {
  getHystoryPlotly();
  getGaugePlotly();
  getDeltaPlotly();
  updateSensorReadings();
  updateLastData();
  loop();
})();