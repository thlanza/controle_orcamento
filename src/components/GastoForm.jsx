"use client";

import { useState } from "react";

export function GastoForm() {
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/gastos", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categoria,
                valor,
                data
            })
        });

        if (!response.ok) {
            alert("Erro ao salvar gasto");
            return;
        };

        setCategoria("");
        setValor("");
        setData("");

        alert("Gasto salvo");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Categoria</label>

                <input
                    value={categoria}
                    onChange={(event) => setCategoria(event.target.value)}
                    placeholder="Ex: Alimentação"
                />
            </div>
            <div>
                <label>Valor</label>

                <input
                    type="text"
                    inputMode="decimal"
                    value={valor}
                    onChange={(evemt) => setValor(event.target.value)}
                    placeholder="Ex: 42,90"
                />
                <div>
                    <label>Data</label>
                    <input 
                        type="date"
                        value={data}
                        onChange={(event) => setData(event.target.value)}
                    />
                </div>

                <button type="submit">Salvar gasto</button>
            </div>
        </form>
    )
}