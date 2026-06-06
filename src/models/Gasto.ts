import mongoose, { Schema, models, model } from "mongoose";

const GastoSchema = new Schema(
    {
        categoria: {
            type: String,
            required: true,
            trim: true
        },
        valorCentavos: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        moeda: {
            type: String,
            required: true,
            default: "BRL",
            enum: ["BRL"]
        },
        data: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Gasto = models.Gasto || model("Gasto", GastoSchema);

