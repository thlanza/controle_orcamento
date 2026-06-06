import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongoose";
import { buscarConsolidado } from "../../../../../lib/consolidados";
import { buscarPeriodoDiario } from "../../../../../lib/datas";
import { enviarEmail } from "../../../../../lib/email";
import { renderizarEmailConsolidado } from "../../../../../lib/renderizarEmailConsolidado";

export async function GET(request) {
    await connectToDatabase();

    const { inicio, fim } = buscarPeriodoDiario(new Date());

    const consolidado = await buscarConsolidado({
        inicio,
        fim
    });

    const html = renderizarEmailConsolidado({
        titulo: "Consolidado diário de gastos",
        consolidado
    });

    await enviarEmail({
        assunto: "Consolidado diário de gastos",
        html
    });

    return NextResponse.json({
        message: "Email diário enviado com sucesso",
        consolidado
    });
}
