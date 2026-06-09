import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongoose";
import { Gasto } from "../../../../models/Gasto";
import { criarDecimal128, normalizarValorMonetario } from "../../../../lib/dinheiro";
import { converterDataInputParaDate } from "../../../../lib/datas";
import { Categoria } from "../../../../models/Categoria";


export async function POST(request) {
    await connectToDatabase();

    const body = await request.json();

    const { categoria, valor, data, descricao } = body;

    if (!categoria || valor === undefined || !data || !descricao) {
        return NextResponse.json(
            { message: "Categoria, valor e data são obrigatórios."},
            { status: 400 }
        )
    };

    const categoriaExistente = await Categoria.findOne({
        nome: categoria,
    });

    if (!categoriaExistente) {
        return NextResponse.json(
        {
            message: "categoria não cadastrada",
        },
        {
            status: 400,
        }
        );
    }

    const valorNormalizado = normalizarValorMonetario(valor);

    if (!valorNormalizado || valorNormalizado === "0.00") {
        return NextResponse.json(
            {
                message: "valor deve ser um valor monetário válido maior que zero."
            },
            {
                status: 400
            }
        )
    };

    const valorDecimal = criarDecimal128(valorNormalizado);

    const dataDoGasto = converterDataInputParaDate(data);

    if (!dataDoGasto) {
        return NextResponse.json(
            {
                message: "data inválida"
            },
            {
                status: 400
            }
        )
    };

    const gasto = await Gasto.create({
        categoria,
        valor: valorDecimal,
        moeda: "BRL",
        data: dataDoGasto,
        descricao
    });

    return NextResponse.json(
        {
            message: "Gasto cadastrado com sucesso",
            gasto
        },
        {
            status: 201
        }
    )
}