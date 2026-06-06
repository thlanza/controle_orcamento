import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongoose";
import { buscarConsolidado } from "../../../../../lib/consolidados";
import { buscarPeriodoMensalAtual } from "../../../../../lib/datas";
import { enviarEmail } from "../../../../../lib/email";
import { renderizarEmailConsolidado } from "../../../../../lib/renderizarEmailConsolidado";

export async function POST(request) {
    await connectToDatabase();

    const { inicio, fim } = buscarPeriodoMensalAtual(new Date());

    const consolidado = await buscarConsolidado({
        inicio,
        fim
    });

    const html = renderizarEmailConsolidado({
        titulo: "Consolidado mensal de gastos",
        consolidado
    });

    await enviarEmail({
        assunto: "Consolidado mensal de gastos",
        html
    });

    return NextResponse.json({
        message: "Email mensal enviado com sucesso",
        consolidado
    });
}