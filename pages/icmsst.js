let itens = [];

function voltar() {
    window.location.href = "../index.html";
}

function adicionarItem() {
    itens.push({
        qtd: 0,
        preco: 0,
        icms: 18,
        ipi: 0,
        pis: 0,
        cofins: 0,
        mva: 0
    });

    render();
}

function render() {
    const tabela = document.getElementById("tabelaItens");
    tabela.innerHTML = "";

    itens.forEach((item, i) => {
        tabela.innerHTML += `
        <tr>
            <td>${i + 1}</td>

            <td><input onchange="update(${i}, 'qtd', this.value)"></td>
            <td><input onchange="update(${i}, 'preco', this.value)"></td>
            <td><input value="18" onchange="update(${i}, 'icms', this.value)"></td>
            <td><input onchange="update(${i}, 'ipi', this.value)"></td>
            <td><input onchange="update(${i}, 'pis', this.value)"></td>
            <td><input onchange="update(${i}, 'cofins', this.value)"></td>
            <td><input onchange="update(${i}, 'mva', this.value)"></td>

            <td id="frete_${i}">0</td>
            <td id="desc_${i}">0</td>
            <td id="base_${i}">0</td>

            <td id="base_real_${i}">0</td>
            <td id="icms_${i}">0</td>
            <td id="ipi_${i}">0</td>
            <td id="pis_${i}">0</td>
            <td id="cofins_${i}">0</td>

            <td id="basest_${i}">0</td>
            <td id="st_${i}">0</td>
            <td id="fcp_${i}">0</td>
        </tr>`;
    });
}

function update(i, campo, valor) {
    itens[i][campo] = parseFloat(valor) || 0;
    calcularTotal(); // agora tudo passa por aqui
}

function calcularItem(i) {
    const item = itens[i];

    const icmsInterno = (parseFloat(document.getElementById("icmsInterno").value) || 0) / 100;
    const fcp = (parseFloat(document.getElementById("fcp").value) || 0) / 100;

    const base = item.qtd * item.preco;

    const valorICMS = base * (item.icms / 100);
    const valorIPI = base * (item.ipi / 100);
    const valorPIS = base * (item.pis / 100);
    const valorCofins = base * (item.cofins / 100);

    // BASE ST (com MVA)
    const baseST = base * (1 + item.mva / 100);

    // ICMS ST
    const icmsST = (baseST * icmsInterno) - valorICMS;

    // FCP
    const valorFCP = baseST * fcp;

    // PRINT
    set(`base_${i}`, base);
    set(`icms_${i}`, valorICMS);
    set(`ipi_${i}`, valorIPI);
    set(`pis_${i}`, valorPIS);
    set(`cofins_${i}`, valorCofins);
    set(`basest_${i}`, baseST);
    set(`st_${i}`, icmsST);
    set(`fcp_${i}`, valorFCP);
}

function calcularTotal() {

    let totalProdutos = 0;
    let totalICMS = 0;
    let totalIPI = 0;
    let totalPIS = 0;
    let totalCofins = 0;
    let totalST = 0;
    let totalFCP = 0;

    itens.forEach(item => {
        totalProdutos += item.qtd * item.preco;
    });

    const freteTotal = parseFloat(frete.value) || 0;
    const descontoTotal = parseFloat(desconto.value) || 0;
    const icmsInterno = (parseFloat(icmsInternoInput()) || 0) / 100;
    const fcpPerc = (parseFloat(fcpInput()) || 0) / 100;

    itens.forEach((item, i) => {

        const valorItem = item.qtd * item.preco;

        const proporcao = totalProdutos > 0 ? valorItem / totalProdutos : 0;

        const freteRateado = freteTotal * proporcao;
        const descontoRateado = descontoTotal * proporcao;

        const baseOriginal = valorItem;
        const baseAjustada = valorItem + freteRateado - descontoRateado;

        const icms = base * (item.icms / 100);
        const ipi = base * (item.ipi / 100);
        const pis = base * (item.pis / 100);
        const cofins = base * (item.cofins / 100);

        const baseST = base * (1 + item.mva / 100);
        const st = (baseST * icmsInterno) - icms;
        const fcp = baseST * fcpPerc;

        // SOMATÓRIOS
        totalICMS += icms;
        totalIPI += ipi;
        totalPIS += pis;
        totalCofins += cofins;
        totalST += st;
        totalFCP += fcp;

        // PRINT
        set(`frete_${i}`, freteRateado);
        set(`desc_${i}`, descontoRateado);
        set(`base_${i}`, base);
        set(`icms_${i}`, icms);
        set(`ipi_${i}`, ipi);
        set(`pis_${i}`, pis);
        set(`cofins_${i}`, cofins);
        set(`basest_${i}`, baseST);
        set(`st_${i}`, st);
        set(`fcp_${i}`, fcp);
        set(`base_${i}`, baseAjustada);       // base ajustada
        set(`base_real_${i}`, baseOriginal);  // base original
    });

    // 🔥 TOTAL FINAL IGUAL PLANILHA
    const totalNota = totalProdutos 
                + freteTotal 
                - descontoTotal 
                + totalIPI 
                + totalST;

    document.getElementById("totalNota").innerText =
        totalNota.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // 🔥 RESUMO (IGUAL SUA IMAGEM 3)
    atualizarResumo({
        totalProdutos,
        totalICMS,
        totalIPI,
        totalPIS,
        totalCofins,
        totalST,
        totalFCP,
        totalNota
    });
}

function set(id, valor) {
    document.getElementById(id).innerText =
        valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

