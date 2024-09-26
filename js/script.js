let data = [];  // Variável para armazenar os dados carregados

// Função para carregar o arquivo JSON
async function loadData() {
    try {
        const response = await fetch('dados/dados.json');  // Carrega o arquivo JSON
        data = await response.json();                     // Armazena os dados carregados
        initializeCharts();                               // Inicializa os gráficos após o carregamento
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Função para desenhar a legenda
function drawLegend(ctx) {
    const legendX = 10; // Posição X da legenda
    const legendY = 10; // Posição Y da legenda
    const legendBoxSize = 13; // Tamanho dos quadrados da legenda
    const legendGap = 5; // Espaçamento entre os quadrados e o texto

    // Desenhar a legenda das mulheres
    ctx.fillStyle = '#C96868'; 
    ctx.fillRect(legendX, legendY, legendBoxSize, legendBoxSize);
    ctx.font = '14px Lato';
    ctx.fillStyle = '#000';
    ctx.fillText('Mulheres', legendX + legendBoxSize + legendGap, legendY + legendBoxSize - 3);

    // Desenhar a legenda dos homens
    ctx.fillStyle = '#7EACB5'; 
    ctx.fillRect(legendX + 100, legendY, legendBoxSize, legendBoxSize); 
    ctx.font = '14px Lato';
    ctx.fillStyle = '#000';
    ctx.fillText('Homens', legendX + legendBoxSize + legendGap + 100, legendY + legendBoxSize - 3);
}

// Função para desenhar o gráfico
function drawChart(courses, canvasId) {
    const cursos = courses.map(d => d.nome_curso_cine);
    const mulheres = courses.map(d => parseInt(d.matriculas_feminino));
    const totais = courses.map(d => parseInt(d.total));
    const homens = totais.map((total, index) => total - mulheres[index]); // Calcula o número de homens

    // Configurações básicas do gráfico
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas

    // Desenha a legenda
    drawLegend(ctx);

    // Configurações das barras
    const barHeight = 20;
    const groupGap = 20; // Espaçamento entre os grupos de barras
    const maxBarWidth = 300;  // Define a largura máxima de cada barra
    const scaleStartX = 200;  // Ponto de início da escala

    // Encontrar o valor máximo para escalar as barras
    const maxValue = Math.max(...totais); // Usa o total para definir a escala
    ctx.font = '14px Lato'; // Ajusta a fonte para os nomes dos cursos

    // Desenhar as barras
    cursos.forEach((curso, index) => {
        const y = index * (barHeight + groupGap) + 50; // Ajusta o espaço vertical para cada curso

        // Desenhar barra das mulheres
        const womenBarWidth = (mulheres[index] / maxValue) * maxBarWidth;
        ctx.fillStyle = '#C96868'; // Cor das mulheres
        ctx.fillRect(scaleStartX, y, womenBarWidth, barHeight);

        // Desenhar barra dos homens
        const menBarWidth = (homens[index] / maxValue) * maxBarWidth;
        ctx.fillStyle = '#7EACB5'; // Cor dos homens
        ctx.fillRect(scaleStartX + womenBarWidth, y, menBarWidth, barHeight); // Desenha a barra dos homens ao lado das mulheres

        // Desenhar o rótulo do curso à esquerda das barras
        ctx.fillStyle = '#000';
        ctx.fillText(curso, 10, y + barHeight / 2 + 5); // Alinha o texto à esquerda da barra

        // Desenhar o número total à direita das barras
        ctx.fillStyle = '#333'; // Define a cor do número
        ctx.fillText(totais[index].toLocaleString(), scaleStartX + womenBarWidth + menBarWidth + 10, y + barHeight / 2 + 5); // Posiciona o número total
    });
}

// Função para inicializar os gráficos
function initializeCharts() {
    // Ordenar os dados por matrículas femininas
    const sortedData = data.sort((a, b) => b.matriculas_feminino - a.matriculas_feminino);

    // Pegar os 10 primeiros e os 10 últimos cursos
    const top10 = sortedData.slice(0, 10);
    const bottom10 = sortedData.slice(-10);

    // Desenhar o gráfico dos 10 primeiros
    drawChart(top10, 'chartCanvasTop');

    // Desenhar o gráfico dos 10 últimos
    drawChart(bottom10, 'chartCanvasBottom');
}

// Chama a função para carregar os dados quando o script é executado
loadData();
