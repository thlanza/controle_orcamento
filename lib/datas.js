import { DateTime } from "luxon";

export const TIME_ZONE = "America/Sao_Paulo";

function montarPeriodo(inicioDateTime, fimDateTime) {
  return {
    inicio: inicioDateTime.toJSDate(),
    fim: fimDateTime.toJSDate(),
  };
}

export function converterDataInputParaDate(dataTexto) {
  if (!dataTexto || typeof dataTexto !== "string") {
    return null;
  }

  const data = DateTime.fromISO(dataTexto, {
    zone: TIME_ZONE,
  });

  if (!data.isValid) {
    return null;
  }

  return data.startOf("day").toJSDate();
}

export function buscarPeriodoDiario(dataBase = new Date()) {
  const inicio = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("day");

  const fim = inicio.plus({
    days: 1,
  });

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoDiaAnterior(dataBase = new Date()) {
  const inicio = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  })
    .minus({
      days: 1,
    })
    .startOf("day");

  const fim = inicio.plus({
    days: 1,
  });

  return montarPeriodo(inicio, fim);
}

export function buscarInicioDaSemana(dataBase = new Date()) {
  const data = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("day");

  const quantidadeDiasDesdeSegunda = data.weekday - 1;

  return data.minus({
    days: quantidadeDiasDesdeSegunda,
  });
}

export function buscarPeriodoSemanal(dataBase = new Date()) {
  const inicio = buscarInicioDaSemana(dataBase);

  const fim = inicio.plus({
    weeks: 1,
  });

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoSemanaAnterior(dataBase = new Date()) {
  const inicioSemanaAtual = buscarInicioDaSemana(dataBase);

  const inicio = inicioSemanaAtual.minus({
    weeks: 1,
  });

  const fim = inicioSemanaAtual;

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoMensalPorAnoMes({ ano, mes }) {
  const inicio = DateTime.fromObject(
    {
      year: ano,
      month: mes,
      day: 1,
    },
    {
      zone: TIME_ZONE,
    }
  ).startOf("day");

  const fim = inicio.plus({
    months: 1,
  });

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoMensalAtual(dataBase = new Date()) {
  const data = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  });

  return buscarPeriodoMensalPorAnoMes({
    ano: data.year,
    mes: data.month,
  });
}

export function buscarPeriodoMesAnterior(dataBase = new Date()) {
  const inicioMesAtual = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  })
    .startOf("month")
    .startOf("day");

  const inicio = inicioMesAtual.minus({
    months: 1,
  });

  const fim = inicioMesAtual;

  return montarPeriodo(inicio, fim);
}