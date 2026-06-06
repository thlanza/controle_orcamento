function formatarValorDecimalParaReais(valor) {
  const valorNumericoApenasParaExibicao = Number(valor || "0.00");

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorNumericoApenasParaExibicao);
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}

export function renderizarEmailConsolidado({ titulo, consolidado }) {
  const linhasCategorias = consolidado.porCategoria
    .map((item) => {
      return `
        <tr>
          <td>${item.categoria}</td>
          <td style="text-align: right;">${item.quantidade}</td>
          <td style="text-align: right;">${formatarValorDecimalParaReais(item.total)}</td>
          <td style="text-align: right;">${formatarValorDecimalParaReais(item.menorGasto)}</td>
          <td style="text-align: right;">${formatarValorDecimalParaReais(item.maiorGasto)}</td>
          <td style="text-align: right;">${formatarValorDecimalParaReais(item.gastoMedio)}</td>
        </tr>
      `;
    })
    .join("");

  const corpoCategorias =
    linhasCategorias ||
    `
      <tr>
        <td colspan="6" style="text-align: center;">
          Nenhum gasto registrado no período.
        </td>
      </tr>
    `;

  return `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h1>${titulo}</h1>

      <p>
        <strong>Período:</strong>
        ${formatarData(consolidado.periodo.inicio)}
        até
        ${formatarData(consolidado.periodo.fim)}
      </p>

      <div style="margin: 24px 0;">
        <p><strong>Total:</strong> ${formatarValorDecimalParaReais(consolidado.total)}</p>
        <p><strong>Quantidade de gastos:</strong> ${consolidado.quantidade}</p>
        <p><strong>Gasto médio:</strong> ${formatarValorDecimalParaReais(consolidado.gastoMedio)}</p>
        <p><strong>Menor gasto:</strong> ${formatarValorDecimalParaReais(consolidado.menorGasto)}</p>
        <p><strong>Maior gasto:</strong> ${formatarValorDecimalParaReais(consolidado.maiorGasto)}</p>
      </div>

      <h2>Gastos por categoria</h2>

      <table
        border="1"
        cellpadding="8"
        cellspacing="0"
        style="border-collapse: collapse; width: 100%;"
      >
        <thead>
          <tr>
            <th style="text-align: left;">Categoria</th>
            <th style="text-align: right;">Qtd.</th>
            <th style="text-align: right;">Total</th>
            <th style="text-align: right;">Menor gasto</th>
            <th style="text-align: right;">Maior gasto</th>
            <th style="text-align: right;">Média</th>
          </tr>
        </thead>

        <tbody>
          ${corpoCategorias}
        </tbody>
      </table>
    </div>
  `;
}