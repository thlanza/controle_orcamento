import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Categoria } from "../../../../../models/Categoria";
import { connectToDatabase } from "../../../../../lib/mongoose";

export async function DELETE(request, { params }) {
  await connectToDatabase();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        message: "id inválido",
      },
      {
        status: 400,
      }
    );
  }

  const categoriaDeletada = await Categoria.findByIdAndDelete(id);

  if (!categoriaDeletada) {
    return NextResponse.json(
      {
        message: "categoria não encontrada",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    message: "Categoria deletada com sucesso",
    categoria: categoriaDeletada,
  });
}