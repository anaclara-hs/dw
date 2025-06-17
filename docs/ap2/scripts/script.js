const perguntas = [
  {
    pergunta: 'Com quanto de investimento você deseja começar?',
    type: 'number',
  },
  {
    pergunta: 'Quanto por mês você ira investir?',
    type: 'number',
  },
  {
    pergunta: 'Por quanto tempo pretende manter esse investimento?',
    type: 'range',

  },
  {
    pergunta: 'Você quer assumir riscos de perder grande parte do seu dinheiro?',
    options: ['sim', 'não'],
    type: 'radio',
  },
]

const dividendos = async () => {
  try {
    const response = await fetch('https://www.alphavantage.co/query?function=DIVIDENDS&symbol=IBM&apikey=demo');

    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados de dividendos.');
    }

    const data = await response.json();
    return data.data; // <- IMPORTANTE! Retorna os dados
  } catch (err) {
    console.error('Erro:', err.message);
    return null;
  }
};

async function cdi() {
  try {
    const response = await fetch('https://brasilapi.com.br/api/taxas/v1');
    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados das taxas.');
    }
    const dados = await response.json();
    console.log('Dados da API CDI:', dados);
    return dados; // Retorna o array
  } catch (err) {
    console.error('Erro ao buscar CDI:', err.message);
    return null;
  }
}





let indexQuestao = 0;
const respostas = [];
let myChart = null;






const questionarioContainer = document.getElementById("questionario-container");
const areaPerguntas = document.getElementById("area-perguntas");
const backButton = document.getElementById("back-button");
const proxButton = document.getElementById("prox-button");
const finishButton = document.getElementById("finish-button");
const relatorio = document.getElementById("relatorio");
const graficoChart = document.getElementById("graficoChart");
const opcao = document.querySelector('.opcao');
const resetButton = document.getElementById("reset-button");
const divT = document.querySelector('.div-titulo');


function mostrar() {
  areaPerguntas.innerHTML = "";
  let perguntaAtual = perguntas[indexQuestao];
  let pergunta = perguntas;

  const div = document.createElement('div');
  div.className = 'slide';
  //TITULO
  divT.textContent = '';
  const tituloPergunta = document.createElement('h2');
  tituloPergunta.className = 'titulo-pergunta';
  tituloPergunta.textContent = `${indexQuestao + 1}. ${perguntaAtual.pergunta}`;
  div.appendChild(divT);
  divT.appendChild(tituloPergunta);
  //PERGUNTAS
  const respostaPerguntas = document.createElement('div');
  respostaPerguntas.className = 'resposta-perguntas';

  let inputType = `${perguntaAtual.type}`;



  if (inputType === 'radio') {
    perguntaAtual.options.forEach((option, index) => {
      const label = document.createElement('label');
      label.className = 'label-pergunta';
      label.name = 'pergunta';

      const question = document.createElement('input');
      question.className = 'radio-input';
      question.name = `pergunta-${indexQuestao}`;
      question.value = option;
      question.type = 'radio';
      

      const span = document.createElement("span");
      span.textContent = option;

      label.appendChild(span);
      label.appendChild(question);
      div.appendChild(label);

      areaPerguntas.appendChild(div);

    });
  }

  else if (inputType === 'range') {
    const question = document.createElement('input');
    question.className = 'range-input';
    question.type = 'range';
    question.min = '0';
    question.max = '120';
    question.value = '0';

    const label = document.createElement('label');
    label.className = 'label-range';

    label.textContent = `\n${question.value} Meses`;

    question.addEventListener('input', function () {
      label.textContent = `\n${this.value} Meses`;
    });

    div.appendChild(question);
    div.appendChild(label);
    areaPerguntas.appendChild(div);
  }

  else {
    const question = document.createElement('input');
    question.className = 'number-input';
    question.type = 'number';
    question.min = '0';

    div.appendChild(question);
    areaPerguntas.appendChild(div);
  }

  if (indexQuestao > 2) {
    finishButton.style.display = 'block';
    proxButton.style.display = 'none';
  }

  else {
    finishButton.style.display = 'none';
  }

  console.log(respostas[indexQuestao])

};



//VOLTAR PERGUNTA
backButton.onclick = function () {
  indexQuestao--;
  if (indexQuestao < 0){
    indexQuestao++
  }
  mostrar();
}


//PROXIMA PERGUNTA
proxButton.onclick = function () {
  const respostaValida = salvarRespostaAtual();
  console.log("Respostas até agora:", respostas);
  if (!respostaValida) return; // <- só avança se a resposta for válida

  indexQuestao++;
  if (indexQuestao < perguntas.length) {
    mostrar();
  } else {
    console.log("Respostas finais:", respostas);
  }
  return respostaValida
}

//SALVAR RESPOSTA
function salvarRespostaAtual() {
  const perguntaAtual = perguntas[indexQuestao];
  const tipo = perguntaAtual.type;
  let questionIndex = 0;

  if (tipo === 'radio') {
    const selecionado = document.querySelector(`input[name="pergunta-${indexQuestao}"]:checked`);
    if (selecionado) {
      respostas[indexQuestao] = selecionado.value;
      console.log(respostas[indexQuestao]);
      return true;
    } else {
      alert("Por favor, selecione uma resposta.");
      questionIndex--;
    }
  } else if (tipo === 'number' || tipo === 'range') {
    const input = document.querySelector('.slide input');
    if (input && input.value !== '') {
      respostas[indexQuestao] = input.value;
      return true;
    } else {
      alert("Por favor, insira um valor.");
      return false;
    }
  }
  console.log(respostas)
}


async function simularInvestimentos() {
  const aporteInicial = Number(respostas[0]);
  const aporteMensal = Number(respostas[1]);
  const meses = Number(respostas[2]);
  const querRisco = (respostas[3]);


  

  const IR_CDB = 0.15;
 // 15% para prazo > 720 dias
  const PERCENTUAL_LCI_LCA = 0.95; // 95% do CDI
  const TAXA_DIVIDENDOS = 0.05; // exemplo 5% a.a.
  const TAXA_FII = 0.07; // exemplo 7% a.a.
  const PRECO_ACAO = 10; // preço fictício de uma ação por mês

  const CDI_ANUAL = 14.65;
  const CDI_MENSAL = CDI_ANUAL / 100 / 12;

  function calcularCompostos(valorInicial, valorMensal, taxaMensal, meses) {
    let montante = valorInicial;
    for (let i = 0; i < meses; i++) {
      montante += valorMensal;
      montante *= (1 + taxaMensal);
    }
    return montante;
  }

  let resultados = {};


  if (querRisco === 'não') {
    // CDB
    let cdbBruto = calcularCompostos(aporteInicial, aporteMensal, CDI_MENSAL, meses);
    let cdbLiquido = cdbBruto * (1 - IR_CDB);
    resultados.CDB = Math.trunc(cdbLiquido);

    // LCI
    let lciMontante = calcularCompostos(aporteInicial, aporteMensal, CDI_MENSAL * PERCENTUAL_LCI_LCA, meses);
    resultados.LCI = Math.trunc(lciMontante);

    // LCA
    let lcaMontante = calcularCompostos(aporteInicial, aporteMensal, CDI_MENSAL * PERCENTUAL_LCI_LCA, meses);
    resultados.LCA = Math.trunc(lcaMontante);

    const paragrafo = document.createElement('p');
      paragrafo.className = 'ajuda';
      paragrafo.textContent = 'O CDB pode ter um rendimento um pouco abaixo dos demais, porem ele se destaca pela facilidade de retirar seu investimento caso esteja em necessidade. Acaba sendo ideal para quem busca um fundo de emergencia \n \n O LCI e LCA tem um rendimento um pouco mais alto, porem não podem ser sacados a qualquer momento, então tenha em mente que seu dinheiro ficara retido por alguns meses'

      opcao.appendChild(paragrafo);


    
  } else if (querRisco === 'sim'){
    // Ações (simples: comprar 1 ação por mês, resto em conta rendendo 0)
    let numAcoes = Math.min(meses, Math.floor((aporteInicial + aporteMensal * meses) / PRECO_ACAO));
    let rendimentoAcoes = Math.pow(1 + (TAXA_DIVIDENDOS / 12), meses) - 1;
    let totalAcoes = numAcoes * PRECO_ACAO * (1 + rendimentoAcoes);
    resultados.Acoes = Math.trunc(totalAcoes);

    // Fundos Imobiliários
    let fiis = calcularCompostos(aporteInicial, aporteMensal, TAXA_FII / 12, meses);
    resultados.FII = Math.trunc(fiis);

    const paragrafo = document.createElement('p');
      paragrafo.className = 'ajuda';
      paragrafo.textContent = 'As ações geralmente são mais volateis, fazendo com que, o investidor tenha que tomar cuidado. A principal ideia das ações é que você compre uma ação na baixa e venda na alta \n \n Os Fundos Imobiliarios são menos volateis, apesar de disso, o investir ainda sofre um enorme risco de que seus fundos desvalorizem, principalmente em grandes crises'

      opcao.appendChild(paragrafo);
  }

  console.log("Resultado dos investimentos:");
  if (querRisco === 'não') {
    console.log(`📊 CDB: R$ ${resultados.CDB}`);
    console.log(`🏠 LCI: R$ ${resultados.LCI}`);
    console.log(`🌾 LCA: R$ ${resultados.LCA}`);

    let maior = Object.entries(resultados).reduce((a, b) => a[1] > b[1] ? a : b);
    console.log(`✅ Mais rentável com risco: ${maior[0]} com R$ ${maior[1]}`);
  } else {
    console.log(`📈 Ações: R$ ${resultados.Acoes}`);
    console.log(`🏢 FIIs: R$ ${resultados.FII}`);

    let maior = Object.entries(resultados).reduce((a, b) => a[1] > b[1] ? a : b);
    console.log(`✅ Mais rentável sem risco: ${maior[0]} com R$ ${maior[1]}`);
  }
  console.log(resultados)
  return resultados;
}



// Cria e renderiza o novo gráfico
finishButton.onclick = async function () {

  if(!salvarRespostaAtual()){
    indexQuestao--;
  }

  const resultados = await simularInvestimentos();
  relatorio.style.display = 'flex';
  questionarioContainer.style.display = 'none';
  console.log(respostas);

  const labels = Object.keys(resultados);
  const valores = Object.values(resultados);

  if (respostas[3] === 'sim') {
    labels, valores;
  } else {
    labels, valores;
  }

  

    salvarRespostaAtual();

  const data = {
    labels: labels,
    datasets: [{
      label: 'Valor final do investimento (R$)',
      data: valores,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true
    }]
  };

  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById('graficoChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar', // ou 'line', 'pie', etc.
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Comparativo de Investimentos'
        }
      }
    }
  });

}

resetButton.onclick = async function () {
  indexQuestao = 0;

  respostas.length = 0;
  relatorio.style.display = 'none';
  questionarioContainer.style.display = 'flex';
  proxButton.style.display = 'block';
  mostrar()
}

mostrar()

