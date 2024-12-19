var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js") ;
var { gerarFaturaStr } = require("./apresentacao.js");
const { readFileSync } = require('fs');

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
//const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
//const faturaHTML = gerarFaturaHTML(faturas, pecas);

console.log(faturaStr);
//console.log(faturaHTML);
