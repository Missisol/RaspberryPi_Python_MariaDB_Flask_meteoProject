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

const temperatureDeltaEl = document.querySelector('#temperature-delta')
const humidityDeltaEl = document.querySelector('#humidity-delta')
const pressureDeltaEl = document.querySelector('#pressure-delta')
const deltaDivs = [temperatureDeltaEl, humidityDeltaEl, pressureDeltaEl]

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

const deltaDataArr = [
  { name: 'температура', text: 'Температура', color: '3ba639' },
  { name: 'влажность', text: 'Влажность', color: '047df3' },
  { name: 'давление', text: 'Давление', color: '3d3c3c'},
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
  deltaDataArr.forEach((data, idx) => {
    const trace1 = {
      x: [],
      y: [],
      name: `min ${data.name}`,
      marker: {
        color: 'ef7985',
      },
      type: 'bar',
    };
    const trace2 = {
      x: [],
      y: [],
      name: `max ${data.name}`,
      marker: {
        color: data.color,
      },
      type: 'bar',
    };
    const traces = [trace1, trace2];
    const layout = {
      title: data.text,
      font: {
        size: 14,
        color: "#808080",
      },
      barmode: 'group',
      bargroupgap: 0.1,
      legend: {
        x: 0,
        y: -0.35,
      },
    };
  
    Plotly.newPlot(deltaDivs[idx], traces, layout, config)
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

function updateDelta() {
  let datesArr;
  let minTempArr;
  let maxTempArr;
  let minHumArr;
  let maxHumArr;
  let minPrArr;
  let maxPrArr;

  fetch('/tempDelta')
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.dates.length) {
        datesArr = resJson.dates;
        minTempArr = resJson.min_t;
        maxTempArr = resJson.max_t;
        minHumArr = resJson.min_h;
        maxHumArr = resJson.max_h;
        minPrArr = resJson.min_p;
        maxPrArr = resJson.max_p;

      Plotly.update(
        temperatureDeltaEl, 
        {
          x: [datesArr],
          y: [minTempArr],
        },
        {
          x: [datesArr],
          y: [maxTempArr],
        },
      );
      Plotly.update(
        humidityDeltaEl, 
        {
          x: [datesArr],
          y: [minHumArr],
        },
        {
          x: [datesArr],
          y: [maxHumArr],
        },
      );
      Plotly.update(
        pressureDeltaEl, 
        {
          x: [datesArr],
          y: [minPrArr],
        },
        {
          x: [datesArr],
          y: [maxPrArr],
        },
      );
    }
  })
}

//const timer = 300000
// const timer = 60 * 1000 * 5
const timer = 60 * 1000 * 15 // every 15 minutes

function loop() {
  setTimeout(() => {
    updateSensorReadings();
    updateLastData();
    updateDelta();
    loop();
  }, timer);
}

(function init() {
  getHystoryPlotly();
  getGaugePlotly();
  getDeltaPlotly();
  updateSensorReadings();
  updateLastData();
  updateDelta();
  loop();
})();