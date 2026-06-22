import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { connectToDatabase } from "../../../../../lib/mongoose";
import { Gasto } from "../../../../../models/Gasto";

const TIME_ZONE = "America/Sao_Paulo";
// test
function formatarData(data) {
  return DateTime.fromJSDate(data, {
    zone: TIME_ZONE,
  }).toFormat("yyyy-MM-dd HH:mm:ss ZZZZ");
}

function corrigirDataParaInicioDoDiaEmSaoPaulo(data) {
  const dataUtc = DateTime.fromJSDate(data, {
    zone: "utc",
  });

  return DateTime.fromObject(
    {
      year: dataUtc.year,
      month: dataUtc.month,
      day: dataUtc.day,
    },
    {
      zone: TIME_ZONE,
    }
  ).toJSDate();
}

export async function POST() {
  await connectToDatabase();

  const cursor = Gasto.collection.find(
    {
      data: {
        $type: "date",
      },
    },
    {
      projection: {
        _id: 1,
        categoria: 1,
        descricao: 1,
        data: 1,
      },
    }
  );

  const operacoes = [];
  const exemplos = [];
  let analisados = 0;

  for await (const gasto of cursor) {
    analisados += 1;

    const dataCorrigida = corrigirDataParaInicioDoDiaEmSaoPaulo(gasto.data);

    if (gasto.data.getTime() === dataCorrigida.getTime()) {
      continue;
    }

    operacoes.push({
      updateOne: {
        filter: {
          _id: gasto._id,
        },
        update: {
          $set: {
            data: dataCorrigida,
          },
        },
      },
    });

    if (exemplos.length < 5) {
      exemplos.push({
        id: String(gasto._id),
        categoria: gasto.categoria,
        descricao: gasto.descricao,
        dataAnterior: gasto.data.toISOString(),
        dataAnteriorEmSaoPaulo: formatarData(gasto.data),
        dataCorrigida: dataCorrigida.toISOString(),
        dataCorrigidaEmSaoPaulo: formatarData(dataCorrigida),
      });
    }
  }

  if (operacoes.length === 0) {
    return NextResponse.json({
      message: "Nenhuma data precisava ser atualizada.",
      analisados,
      corrigidos: 0,
      exemplos,
    });
  }

  const resultado = await Gasto.collection.bulkWrite(operacoes, {
    ordered: false,
  });

  return NextResponse.json({
    message: "Datas atualizadas com sucesso.",
    analisados,
    corrigidos: resultado.modifiedCount,
    exemplos,
  });
}
