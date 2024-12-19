const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  calcularCredito(pecas, apre) {
    // créditos para próximas contratações
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos; 
  }
    
  calcularTotalCreditos(pecas, apresentacoes) {
    return apresentacoes.reduce(
      (total, apre) => total + this.calcularCredito(pecas, apre),
      0
    );
  }
    
  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    switch (getPeca(pecas, apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
          throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
    }
    return total;
  }
    
  calcularTotalFatura(pecas, apresentacoes) {
    return apresentacoes.reduce(
      (total, apre) => total + this.calcularTotalApresentacao(pecas, apre),0);
  }
}
// função extraída
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100)
}

// função query
function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function gerarFaturaStr (fatura, pecas, calc) {

  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  const formato = formatarMoeda;

  for (let apre of fatura.apresentacoes) {
    //const peca = getPeca(apre);
    let total = calc.calcularTotalApresentacao(pecas, apre); 
    creditos += calc.calcularCredito(pecas, apre);
    totalFatura += total;
  }  
  for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }

  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

//function gerarFaturaHTML(fatura, pecas) {
//  let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente}</p>\n<ul>\n`;
//
//  for (let apre of fatura.apresentacoes) {
//    faturaHTML += `<li> ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
//  }
//
//  faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
//  faturaHTML += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n</html>`;
//
//  return faturaHTML;
//}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
//const faturaHTML = gerarFaturaHTML(faturas, pecas);

console.log(faturaStr);
//console.log(faturaHTML);
