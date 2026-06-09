import mongoose, { Schema, models, model } from "mongoose";

const CategoriaSchema = new Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

export const Categoria = models.Categoria || model("Categoria", CategoriaSchema);