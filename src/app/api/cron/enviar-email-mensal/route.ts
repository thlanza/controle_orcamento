import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { buscarConsolidado } from "@/lib/consolidados";
import { buscarPeriodoMensalAtual } from "@/lib/datas";
import { enviarEmail } from "@/lib/email";
import { renderizarEmailConsolidado } from "@/lib/renderizarEmailConsolidado";
