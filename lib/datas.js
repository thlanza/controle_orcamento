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
  return DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("week");
}

export function buscarPeriodoSemanaAnterior(dataBase = new Date()) {
  const inicioSemanaAtual = buscarInicioDaSemana(dataBase);

  const inicio = inicioSemanaAtual.minus({
    weeks: 1,
  });

  const fim = inicioSemanaAtual;

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoMesAnterior(dataBase = new Date()) {
  const inicioMesAtual = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE
  }).startOf("month");

  const inicio = inicioMesAtual.minus({
    months: 1
  });

  const fim = inicioMesAtual;

  return montarPeriodo(inicio, fim);
}