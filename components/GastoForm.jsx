"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import UpdateIcon from "@mui/icons-material/Update";

export function GastoForm() {
  const [categorias, setCategorias] = useState([]);

  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");

  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [salvandoGasto, setSalvandoGasto] = useState(false);
  const [atualizandoDatas, setAtualizandoDatas] = useState(false);

  const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [deletandoCategoriaId, setDeletandoCategoriaId] = useState(null);

  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    setCarregandoCategorias(true);

    try {
      const response = await fetch("/api/categorias");

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: "Erro ao carregar categorias.",
        });

        return;
      }

      const responseBody = await response.json();

      setCategorias(responseBody.categorias || []);
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro inesperado ao carregar categorias.",
      });
    } finally {
      setCarregandoCategorias(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSalvandoGasto(true);
    setMensagem(null);

    try {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria,
          valor,
          data,
          descricao
        }),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: responseBody?.message || "Erro ao salvar gasto.",
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
      setSalvandoGasto(false);
    }
  }

  async function handleCriarCategoria(event) {
    event.preventDefault();

    const nomeCategoria = novaCategoria.trim();

    if (!nomeCategoria) {
      setMensagem({
        tipo: "error",
        texto: "Informe o nome da categoria.",
      });

      return;
    }

    setSalvandoCategoria(true);
    setMensagem(null);

    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeCategoria,
        }),
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: responseBody?.message || "Erro ao criar categoria.",
        });

        return;
      }

      const categoriaCriada = responseBody.categoria;

      setCategorias((categoriasAtuais) => {
        const categoriasAtualizadas = [...categoriasAtuais, categoriaCriada];

        return categoriasAtualizadas.sort((categoriaAtual, proximaCategoria) =>
          categoriaAtual.nome.localeCompare(proximaCategoria.nome, "pt-BR")
        );
      });

      setCategoria(categoriaCriada.nome);
      setNovaCategoria("");
      setModalCategoriaAberto(false);

      setMensagem({
        tipo: "success",
        texto: "Categoria criada com sucesso.",
      });
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro inesperado ao criar categoria.",
      });
    } finally {
      setSalvandoCategoria(false);
    }
  }

  async function handleDeletarCategoria(categoriaItem) {
    const confirmacao = window.confirm(
      `Deseja deletar a categoria "${categoriaItem.nome}"?`
    );

    if (!confirmacao) {
      return;
    }

    setDeletandoCategoriaId(categoriaItem._id);
    setMensagem(null);

    try {
      const response = await fetch(`/api/categorias/${categoriaItem._id}`, {
        method: "DELETE",
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: responseBody?.message || "Erro ao deletar categoria.",
        });

        return;
      }

      setCategorias((categoriasAtuais) => {
        return categoriasAtuais.filter((categoriaAtual) => {
          return categoriaAtual._id !== categoriaItem._id;
        });
      });

      if (categoria === categoriaItem.nome) {
        setCategoria("");
      }

      setMensagem({
        tipo: "success",
        texto: "Categoria deletada com sucesso.",
      });
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro inesperado ao deletar categoria.",
      });
    } finally {
      setDeletandoCategoriaId(null);
    }
  }

  async function handleAtualizarDatas() {
    const confirmacao = window.confirm(
      "Deseja atualizar as datas dos gastos cadastrados?"
    );

    if (!confirmacao) {
      return;
    }

    setAtualizandoDatas(true);
    setMensagem(null);

    try {
      const response = await fetch("/api/gastos/atualizar-datas", {
        method: "POST",
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        setMensagem({
          tipo: "error",
          texto: responseBody?.message || "Erro ao atualizar datas.",
        });

        return;
      }

      setMensagem({
        tipo: "success",
        texto: `${responseBody.corrigidos || 0} data(s) atualizada(s).`,
      });
    } catch (error) {
      setMensagem({
        tipo: "error",
        texto: "Erro inesperado ao atualizar datas.",
      });
    } finally {
      setAtualizandoDatas(false);
    }
  }

  function abrirModalCategoria() {
    setNovaCategoria("");
    setModalCategoriaAberto(true);
  }

  function fecharModalCategoria() {
    if (salvandoCategoria || deletandoCategoriaId) {
      return;
    }

    setModalCategoriaAberto(false);
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
          py: 4,
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 560,
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
                  Registre uma despesa para entrar nos consolidados diário,
                  semanal e mensal.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1.5}
                    alignItems={{
                      xs: "stretch",
                      sm: "flex-start",
                    }}
                  >
                    <TextField
                      select
                      fullWidth
                      required
                      label="Categoria"
                      value={categoria}
                      disabled={carregandoCategorias}
                      onChange={(event) => setCategoria(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        carregandoCategorias
                          ? "Carregando categorias..."
                          : categorias.length === 0
                            ? "Crie sua primeira categoria"
                            : "Selecione uma categoria"
                      }
                    >
                      {categorias.map((categoriaItem) => (
                        <MenuItem
                          key={categoriaItem._id}
                          value={categoriaItem.nome}
                        >
                          {categoriaItem.nome}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={abrirModalCategoria}
                      sx={{
                        minWidth: {
                          xs: "100%",
                          sm: 170,
                        },
                        height: 56,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Categorias
                    </Button>
                  </Stack>

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
                    placeholder="Ex: chocolate"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    helperText="Informe a descrição do gasto."
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
                    disabled={
                      salvandoGasto || carregandoCategorias || atualizandoDatas
                    }
                    startIcon={
                      salvandoGasto ? (
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
                    {salvandoGasto ? "Salvando..." : "Salvar gasto"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    disabled={salvandoGasto || atualizandoDatas}
                    startIcon={
                      atualizandoDatas ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <UpdateIcon />
                      )
                    }
                    onClick={handleAtualizarDatas}
                    sx={{
                      py: 1.4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    {atualizandoDatas ? "Atualizando..." : "Atualizar Datas"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={modalCategoriaAberto}
        onClose={fecharModalCategoria}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleCriarCategoria}>
          <DialogTitle>Gerenciar categorias</DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Nova categoria"
                value={novaCategoria}
                onChange={(event) => setNovaCategoria(event.target.value)}
                placeholder="Ex: Mercado"
                disabled={salvandoCategoria}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={salvandoCategoria}
                startIcon={
                  salvandoCategoria ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                {salvandoCategoria ? "Criando..." : "Criar categoria"}
              </Button>

              <Divider />

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Categorias cadastradas
                </Typography>

                {carregandoCategorias ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Carregando categorias...
                    </Typography>
                  </Stack>
                ) : categorias.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma categoria cadastrada.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {categorias.map((categoriaItem) => {
                      const deletandoEstaCategoria =
                        deletandoCategoriaId === categoriaItem._id;

                      return (
                        <ListItem
                          key={categoriaItem._id}
                          secondaryAction={
                            <Tooltip title="Deletar categoria">
                              <span>
                                <IconButton
                                  edge="end"
                                  color="error"
                                  disabled={deletandoEstaCategoria}
                                  onClick={() =>
                                    handleDeletarCategoria(categoriaItem)
                                  }
                                >
                                  {deletandoEstaCategoria ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <DeleteIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          }
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            mb: 1,
                            bgcolor:
                              categoria === categoriaItem.nome
                                ? "action.selected"
                                : "background.paper",
                          }}
                        >
                          <ListItemText
                            primary={categoriaItem.nome}
                            primaryTypographyProps={{
                              fontWeight:
                                categoria === categoriaItem.nome ? 700 : 400,
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              type="button"
              onClick={fecharModalCategoria}
              disabled={salvandoCategoria || Boolean(deletandoCategoriaId)}
              sx={{
                textTransform: "none",
              }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
