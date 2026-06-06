import { Gasto } from "@/models/Gasto";

function decimal128OuZero(valor) {
  if (valor === null || valor === undefined) {
    return "0.00";
  }

  return valor.toString();
}

export async function buscarConsolidado({ inicio, fim }) {
  const porCategoria = await Gasto.aggregate([
    {
      $match: {
        data: {
          $gte: inicio,
          $lt: fim,
        },
        moeda: "BRL",
      },
    },
    {
      $group: {
        _id: "$categoria",
        total: {
          $sum: "$valor",
        },
        quantidade: {
          $sum: 1,
        },
        menorGasto: {
          $min: "$valor",
        },
        maiorGasto: {
          $max: "$valor",
        },
        gastoMedio: {
          $avg: "$valor",
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $project: {
        _id: 0,
        categoria: "$_id",
        total: 1,
        quantidade: 1,
        menorGasto: 1,
        maiorGasto: 1,
        gastoMedio: 1,
      },
    },
  ]);

  const resumo = await Gasto.aggregate([
    {
      $match: {
        data: {
          $gte: inicio,
          $lt: fim,
        },
        moeda: "BRL",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$valor",
        },
        quantidade: {
          $sum: 1,
        },
        menorGasto: {
          $min: "$valor",
        },
        maiorGasto: {
          $max: "$valor",
        },
        gastoMedio: {
          $avg: "$valor",
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        quantidade: 1,
        menorGasto: 1,
        maiorGasto: 1,
        gastoMedio: 1,
      },
    },
  ]);

  const resumoGeral = resumo[0] || {
    total: "0.00",
    quantidade: 0,
    menorGasto: "0.00",
    maiorGasto: "0.00",
    gastoMedio: "0.00",
  };

  return {
    periodo: {
      inicio,
      fim,
    },
    total: decimal128OuZero(resumoGeral.total),
    quantidade: resumoGeral.quantidade,
    menorGasto: decimal128OuZero(resumoGeral.menorGasto),
    maiorGasto: decimal128OuZero(resumoGeral.maiorGasto),
    gastoMedio: decimal128OuZero(resumoGeral.gastoMedio),
    porCategoria: porCategoria.map((item) => {
      return {
        categoria: item.categoria,
        quantidade: item.quantidade,
        total: decimal128OuZero(item.total),
        menorGasto: decimal128OuZero(item.menorGasto),
        maiorGasto: decimal128OuZero(item.maiorGasto),
        gastoMedio: decimal128OuZero(item.gastoMedio),
      };
    }),
  };
}