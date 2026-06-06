export function buscarPeriodoDiario(dataBase = new Date()) {
  const inicio = new Date(dataBase);
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 1);

  return {
    inicio,
    fim,
  };
}

export function buscarInicioDaSemana(dataBase = new Date()) {
  const data = new Date(dataBase);
  data.setHours(0, 0, 0, 0);

  const diaDaSemana = data.getDay();

  const diferencaParaSegunda =
    diaDaSemana === 0 ? -6 : 1 - diaDaSemana;

  data.setDate(data.getDate() + diferencaParaSegunda);

  return data;
}

export function buscarPeriodoSemanal(dataBase = new Date()) {
  const inicio = buscarInicioDaSemana(dataBase);

  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 7);

  return {
    inicio,
    fim,
  };
}

export function buscarPeriodoMensalPorAnoMes({ ano, mes }) {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 1);

  return {
    inicio,
    fim,
  };
}

export function buscarPeriodoMensalAtual(dataBase = new Date()) {
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth() + 1;

  return buscarPeriodoMensalPorAnoMes({
    ano,
    mes,
  });
}