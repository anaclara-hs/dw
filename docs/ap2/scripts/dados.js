const botaoConversor = document.querySelector('.converter');

async function converterMoeda() {
  const valor = parseFloat(document.getElementById('valor').value);
  const moeda = document.getElementById('moeda').value;
  const res = await fetch(`https://economia.awesomeapi.com.br/json/last/BRL-${moeda}`);
  const data = await res.json();
  const pegarValorMoeda = parseFloat(data[`BRL${moeda}`].ask);
  const resultado = (valor * pegarValorMoeda).toFixed(2);
  var result = document.getElementById('resultado-conversão').textContent = `Resultado: ${moeda} ${resultado}`;
  return result
}

botaoConversor.onclick = async function () {
  const result = await converterMoeda()
  result
}



fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL")
  .then(res => res.json())
  .then(d => {
    const tb = document.querySelector("#moedas tbody");
    tb.innerHTML = "";
    ["USDBRL", "EURBRL", "BTCBRL"].forEach(c => {
      const it = d[c];
      tb.innerHTML += `<tr><td>${it.name}</td><td>R$ ${parseFloat(it.bid).toFixed(2)}</td></tr>`;
    });
  });


const moedas = ["USD-BRL", "EUR-BRL", "BTC-BRL"];
const promisesMoedas = moedas.map(codigo =>
  fetch(`https://economia.awesomeapi.com.br/json/daily/${codigo}/10`)
    .then(res => res.json())
);

Promise.all(promisesMoedas).then(dados => {
  const labels = dados[0].map(d => {
    const data = new Date(d.timestamp * 1000);
    return `${data.getDate()}/${data.getMonth() + 1}`;
  }).reverse();

  const datasets = dados.map((serie, idx) => ({
    label: moedas[idx].split("-")[0],
    data: serie.map(d => parseFloat(d.bid)).reverse(),
    fill: false,
    borderColor: ['#4e73df', '#1cc88a', '#f39c12'][idx],
    tension: 0.3
  }));

  new Chart(document.getElementById('grafico-moedas'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Moedas – últimos 10 dias' } }
    }
  });
});



fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json")
  .then(res => res.json())
  .then(arr => {
    const v = arr[0];
    const tb = document.querySelector("#selic tbody");
    tb.innerHTML = `<tr><td>SELIC</td><td>${v.valor.replace(".", ",")}</td><td>${v.data}</td></tr>`;
  });




fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/10?formato=json")
  .then(res => res.json())
  .then(data => {
    const labels = data.map(item => item.data);
    const valores = data.map(item => parseFloat(item.valor.replace(",", ".")));

    new Chart(document.getElementById('grafico-selic'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'SELIC (%)',
          data: valores,
          borderColor: '#e74c3c',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'SELIC – últimos 10 dias' } }
      }
    });
  });



fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json")
  .then(res => res.json())
  .then(arr => {
    const v = arr[0];
    const tb = document.querySelector("#ipca tbody");
    tb.innerHTML = `<tr><td>IPCA</td><td>${v.valor.replace(".", ",")}</td><td>${v.data}</td></tr>`;
  });



fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/10?formato=json")
  .then(res => res.json())
  .then(data => {
    const labels = data.map(item => item.data);
    const valores = data.map(item => parseFloat(item.valor.replace(",", ".")));

    new Chart(document.getElementById('grafico-ipca'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'IPCA (%)',
          data: valores,
          borderColor: '#36a2eb',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'IPCA – últimos 10 meses' } }
      }
    });
  });






fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/1?formato=json")
  .then(res => res.json())
  .then(arr => {
    const v = arr[0];
    const tb = document.querySelector("#igpm tbody");
    tb.innerHTML = `<tr><td>IGP-M</td><td>${v.valor.replace('.', ',')}%</td><td>${v.data}</td></tr>`;
  });




fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/10?formato=json")
  .then(res => res.json())
  .then(data => {
    const labels = data.map(item => item.data);
    const valores = data.map(item => parseFloat(item.valor.replace(",", ".")));

    new Chart(document.getElementById('grafico-igpm'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'IGP-M (%)',
          data: valores,
          borderColor: '#8e44ad',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'IGP-M – últimos 10 meses' } }
      }
    });
  });



document.getElementById('filtro-investimentos').addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const filtrar = this.value.toLowerCase().trim();
    const secoes = document.querySelectorAll('.investimentos');

    if (filtrar === "") {
      secoes.forEach(secao => secao.style.display = "block");
      return;
    }

    secoes.forEach(secao => {
      const titulo = secao.querySelector('h2')?.innerText.toLowerCase() || "";
      
      

      if (titulo.includes(filtrar)) {
        secao.style.display = "block";
      } else {
        secao.style.display = "none";
      }
    });
  }
});

