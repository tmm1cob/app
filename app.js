let chart;

function getData() {
  return JSON.parse(localStorage.getItem("weights")) || [];
}

function saveEntry() {
  const date = document.getElementById("date").value;
  const weight = parseFloat(document.getElementById("weight").value);
  if (!date || !weight) return;

  const data = getData();
  data.push({ date, weight });
  localStorage.setItem("weights", JSON.stringify(data));
  refresh();
}

function calculateBMI() {
  const height = localStorage.getItem("height");
  const data = getData();
  if (!height || data.length === 0) return;

  const w = data[data.length - 1].weight;
  const h = height / 100;
  const bmi = (w / (h * h)).toFixed(1);
  document.getElementById("bmi").textContent = bmi;
}

function calcLow(days) {
  const data = getData();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const vals = data.filter(d => new Date(d.date) >= cutoff).map(d => d.weight);
  return vals.length ? Math.min(...vals).toFixed(1) : "--";
}

function drawChart() {
  const ctx = document.getElementById("chart");
  const data = getData().slice(-10);

  if (chart) chart.destroy();

  if (data.length < 2) return;

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        data: data.map(d => d.weight),
        borderColor: "#2563eb",
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

function refresh() {
  document.getElementById("weekly").textContent = calcLow(7) + " kg";
  document.getElementById("monthly").textContent = calcLow(30) + " kg";
  calculateBMI();
  drawChart();
}

function openSettings() {
  document.getElementById("settings").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settings").style.display = "none";
}

function saveHeight() {
  const h = document.getElementById("height").value;
  if (h) localStorage.setItem("height", h);
  closeSettings();
  refresh();
}

refresh();
