"use strict"

const axios = require('axios').default;

const URL_PRESIDENTE = 'https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json';
const URL_DEPUTADO_ESTADUAL = 'https://resultados.tse.jus.br/oficial/ele2022/546/dados-simplificados/mg/mg-c0007-e000546-r.json';
const URL_DEPUTADO_FEDERAL = 'https://resultados.tse.jus.br/oficial/ele2022/546/dados-simplificados/mg/mg-c0006-e000546-r.json'
const URL_DEPUTADO_SENADOR = 'https://resultados.tse.jus.br/oficial/ele2022/546/dados-simplificados/mg/mg-c0005-e000546-r.json'

const expirationTime = 5000;

let apuracao = [];

function waitSec(waitTime) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, waitTime);
	});

}

async function getResult(URL) {
	try {
		const response = await axios.get(URL);
		console.log(`${response.data.pst}% das seções totalizadas`)
		mostraApuracao(response.data.cand)
	} catch (error) {
		console.error(error);
	}
}

function validaNome(nomeCandidato) {
	return String(nomeCandidato).toUpperCase() == 'LOHANNA' ||
		String(nomeCandidato).toUpperCase() == 'LAURA COSTA'
}

function mostraApuracao(apuracaoData) {
	apuracaoData.forEach(informacao => {
		const validacao = informacao.seq == 1 || informacao.seq == 2 || informacao.seq == 3 || validaNome(informacao.nm)

		if (validacao) {
			apuracao.push({
				posicao: informacao.seq,
				candidato: informacao.nm,
				porcentagem: `${informacao.pvap}%`,
				n_votos: Number(informacao.vap)
			})
		}
	});

	console.table(apuracao.sort((candidatoA, candidatoB) => {
		if (Number(candidatoA.posicao) < Number(candidatoB.posicao)) {
			return -1;
		}
		if (Number(candidatoA.posicao) > Number(candidatoB.posicao)) {
			return 1;
		}
		return 0;
	}));

	apuracao = [];
}

async function getPresidente() {
	console.log('Presidente');
	await getResult(URL_PRESIDENTE)
}

async function getDeputadoEstadual() {
	console.log('Deputado Estadual');
	await getResult(URL_DEPUTADO_ESTADUAL)
}

async function getDeputadoFederal() {
	console.log('Deputado Federal');
	await getResult(URL_DEPUTADO_FEDERAL)
}

async function getSenador() {
	console.log('Senador');
	await getResult(URL_DEPUTADO_SENADOR)
}

async function start() {
	while (true) {
		await waitSec(expirationTime);
		console.clear();

		await getPresidente()
		await getSenador()
		await getDeputadoEstadual()
		await getDeputadoFederal()
	}
}


start();



