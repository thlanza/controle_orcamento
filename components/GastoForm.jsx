"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";

const categoriasSugeridas = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Lazer",
  "Educação",
  "Assinaturas",
  "Compras",
  "Outros",
];

export function GastoForm() {
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem(null);

    try {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria,
          descricao,
          valor,
          data,
        }),
      });

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: "Erro ao salvar gasto.",
        });

        return;
      }

      setCategoria("");
      setValor("");
      setData("");
      setDescricao("");

      setMensagem({
        tipo: "success",
        texto: "Gasto salvo com sucesso.",
      });
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro inesperado ao salvar gasto.",
      });
    } finally {
      setSalvando(false);
    }
  }

  function fecharMensagem() {
    setMensagem(null);
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f4f6f8",
          px: 2,
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Novo gasto
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Registre rapidamente uma despesa para entrar nos consolidados
                  diário, semanal e mensal.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Categoria"
                    value={categoria}
                    onChange={(event) => setCategoria(event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {categoriasSugeridas.map((categoriaSugerida) => (
                      <MenuItem
                        key={categoriaSugerida}
                        value={categoriaSugerida}
                      >
                        {categoriaSugerida}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    required
                    label="Valor"
                    value={valor}
                    onChange={(event) => setValor(event.target.value)}
                    placeholder="Ex: 42,90"
                    inputMode="decimal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Informe o valor em reais. Exemplo: 42,90"
                  />

                  <TextField
                    fullWidth
                    required
                    label="Descrição"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                    placeholder="Ex: saída no cinema"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Informe a descrição do gasto. Exemplo: saída ao cinema"
                  />

                  <TextField
                    fullWidth
                    required
                    label="Data"
                    type="date"
                    value={data}
                    onChange={(event) => setData(event.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={salvando}
                    startIcon={
                      salvando ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={{
                      mt: 1,
                      py: 1.4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    {salvando ? "Salvando..." : "Salvar gasto"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={Boolean(mensagem)}
        autoHideDuration={4000}
        onClose={fecharMensagem}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {mensagem ? (
          <Alert
            onClose={fecharMensagem}
            severity={mensagem.tipo}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensagem.texto}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}