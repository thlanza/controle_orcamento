import { NextResponse } from "next/server";
import { Categoria } from "../../../../models/Categoria";
import { connectToDatabase } from "../../../../lib/mongoose";
Categoria
export async function GET() {
  await connectToDatabase();

  const categorias = await Categoria.find()
    .sort({
      nome: 1,
    })
    .lean();

  return NextResponse.json({
    categorias,
  });
}

export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();

  const nome = String(body.nome || "").trim();

  if (!nome) {
    return NextResponse.json(
      {
        message: "nome da categoria é obrigatório",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const categoria = await Categoria.create({
      nome,
    });

    return NextResponse.json(
      {
        message: "Categoria criada com sucesso",
        categoria,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "categoria já cadastrada",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Erro ao criar categoria",
      },
      {
        status: 500,
      }
    );
  }
}