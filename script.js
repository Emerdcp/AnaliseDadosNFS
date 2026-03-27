function abrir(pagina) {
    window.location.href = pagina;
}



let itens = [];

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

    renderTabela();
}

function renderTabela() {
    const tabela = document.getElementById("tabelaItens");
    tabela.innerHTML = "";

    itens.forEach((item, i) => {
        tabela.innerHTML += `
        <tr>
            <td>${i + 1}</td>

            <td><input onchange="atualizar(${i}, 'qtd', this.value)"></td>
            <td><input onchange="atualizar(${i}, 'preco', this.value)"></td>
            <td><input onchange="atualizar(${i}, 'icms', this.value)" value="18"></td>
            <td><input onchange="atualizar(${i}, 'ipi', this.value)"></td>
            <td><input onchange="atualizar(${i}, 'pis', this.value)"></td>
            <td><input onchange="atualizar(${i}, 'cofins', this.value)"></td>
            <td><input onchange="atualizar(${i}, 'mva', this.value)"></td>

            <td id="base_${i}">0</td>
            <td id="icmsv_${i}">0</td>
            <td id="basest_${i}">0</td>
            <td id="stv_${i}">0</td>
            <td id="fcpv_${i}">0</td>
        </tr>
        `;
    });
}

function atualizar(i, campo, valor) {
    itens[i][campo] = parseFloat(valor) || 0;
    calcularItem(i);
    calcularTotal();
}

function calcularItem(i) {
    const item = itens[i];

    const icmsInterno = (parseFloat(icmsInternoInput()) || 0) / 100;
    const fcp = (parseFloat(fcpInput()) || 0) / 100;

    const base = item.qtd * item.preco;

    const valorICMS = base * (item.icms / 100);

    const baseST = base * (1 + item.mva / 100);

    const icmsST = (baseST * icmsInterno) - valorICMS;

    const valorFCP = baseST * fcp;

    document.getElementById(`base_${i}`).innerText = base.toFixed(2);
    document.getElementById(`icmsv_${i}`).innerText = valorICMS.toFixed(2);
    document.getElementById(`basest_${i}`).innerText = baseST.toFixed(2);
    document.getElementById(`stv_${i}`).innerText = icmsST.toFixed(2);
    document.getElementById(`fcpv_${i}`).innerText = valorFCP.toFixed(2);
}

function calcularTotal() {
    let total = 0;

    itens.forEach(item => {
        total += item.qtd * item.preco;
    });

    const desconto = parseFloat(document.getElementById("desconto").value) || 0;
    const frete = parseFloat(document.getElementById("frete").value) || 0;

    total = total - desconto + frete;

    document.getElementById("totalNota").innerText =
        total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// helpers
function icmsInternoInput() {
    return document.getElementById("icmsInterno").value;
}

function fcpInput() {
    return document.getElementById("fcp").value;
}


function atualizarResumo(totais) {

    set("totalPIS", totais.totalPIS);
    set("totalCofins", totais.totalCofins);
    set("totalICMS", totais.totalICMS);
    set("totalIPI", totais.totalIPI);
    set("totalST", totais.totalST);
    set("totalFCP", totais.totalFCP);

    document.getElementById("totalNotaResumo").innerText =
        totais.totalNota.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}_nfs