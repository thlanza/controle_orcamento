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

export function buscarPeriodoDiaAnterior(dataBase = new Date()) {
  const inicio = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  })
    .minus({ days: 1 })
    .startOf("day");

  const fim = inicio.plus({ days: 1 });

  return montarPeriodo(inicio, fim);
}

export function buscarInicioDaSemanaAtual(dataBase = new Date()) {
  const data = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("day");

  const diasDesdeSegunda = data.weekday - 1;

  return data.minus({
    days: diasDesdeSegunda,
  });
}

export function buscarPeriodoSemanaAnterior(dataBase = new Date()) {
  const inicioSemanaAtual = buscarInicioDaSemanaAtual(dataBase);

  const inicio = inicioSemanaAtual.minus({
    weeks: 1,
  });

  const fim = inicioSemanaAtual;

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoMesAnterior(dataBase = new Date()) {
  const inicioMesAtual = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("month");

  const inicio = inicioMesAtual.minus({
    months: 1,
  });

  const fim = inicioMesAtual;

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoDiario(dataBase = new Date()) {
  const inicio = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("day");

  const fim = inicio.plus({ days: 1 });

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoSemanal(dataBase = new Date()) {
  const inicio = buscarInicioDaSemanaAtual(dataBase);
  const fim = inicio.plus({ weeks: 1 });

  return montarPeriodo(inicio, fim);
}

export function buscarPeriodoMensalAtual(dataBase = new Date()) {
  const inicio = DateTime.fromJSDate(dataBase, {
    zone: TIME_ZONE,
  }).startOf("month");

  const fim = inicio.plus({ months: 1 });

  return montarPeriodo(inicio, fim);
}