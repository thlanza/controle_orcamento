import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongoose";
import { buscarConsolidado } from "../../../../../lib/consolidados";
import { buscarPeriodoSemanal } from "../../../../../lib/datas";
import { enviarEmail } from "../../../../../lib/email";
import { renderizarEmailConsolidado } from "../../../../../lib/renderizarEmailConsolidado";

export async function GET(request) {

    await connectToDatabase();

    const { inicio, fim } = buscarPeriodoSemanal(new Date());

    const consolidado = await buscarConsolidado({
        inicio,
        fim
    });

    const html = renderizarEmailConsolidado({
        titulo: "Consolidado semanal de gastos",
        consolidado
    });

    await enviarEmail({
        assunto: "Consolidado semanal de gastos",
        html
    });

    return NextResponse.json({
        message: "Email semanal enviado com sucesso",
        consolidado
    })
}