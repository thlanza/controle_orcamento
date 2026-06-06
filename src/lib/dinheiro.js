import mongoose from "mongoose";

export function normalizarValorMonetario(valor) {
  const valorComoTexto = String(valor).trim();

  const valorComPontoDecimal = valorComoTexto.replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(valorComPontoDecimal)) {
    return null;
  }

  const [parteInteira, parteDecimal = ""] = valorComPontoDecimal.split(".");

  const parteDecimalNormalizada = parteDecimal.padEnd(2, "0");

  return `${parteInteira}.${parteDecimalNormalizada}`;
}

export function criarDecimal128(valor) {
  const valorNormalizado = normalizarValorMonetario(valor);

  if (!valorNormalizado) {
    return null;
  }

  return mongoose.Types.Decimal128.fromString(valorNormalizado);
}

export function decimal128ParaString(valor) {
  if (valor === null || valor === undefined) {
    return "0.00";
  }

  if (typeof valor === "string") {
    return valor;
  }

  return valor.toString();
}

export function decimal128ParaNumberApenasParaExibicao(valor) {
  return Number(decimal128ParaString(valor));
}

export function formatarDecimal128ParaReais(valor) {
  const valorNumerico = decimal128ParaNumberApenasParaExibicao(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorNumerico);
}