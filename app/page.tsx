'use client';

import React, { useState, useEffect } from 'react'; // React limpo, sem o FormEvent problemático
import { 
  Box, TextField, Button, Typography, Paper, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// 1. Importamos as Server Actions diretamente!
import { getBooks, createBook, updateBook, deleteBook, Book } from './actions/bookActions';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Estados para o Modal de Edição
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      // 2. Chama a Action direto, sem fetch, sem JSON!
      const data = await getBooks(); 
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addBook(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !author) return;

    try {
      // 3. Chama a Action direto!
      const newBook = await createBook(title, author);
      setBooks([newBook, ...books]);
      setTitle('');
      setAuthor('');
    } catch (error) {
      console.error(error);
    }
  }

  async function removeBook(id: number) {
    try {
      await deleteBook(id);
      setBooks(books.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  async function saveEdit() {
    if (!editId) return;

    try {
      await updateBook(editId, editTitle, editAuthor);
      setBooks(books.map(b => 
        b.id === editId ? { ...b, title: editTitle, author: editAuthor } : b
      ));
      setEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const openEditModal = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom color="primary">
        Book Library
      </Typography>

      {/* Formulário de Adicionar usando Paper do MUI */}
      <Paper component="form" onSubmit={addBook} sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          label="Book Title" 
          variant="outlined" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <TextField 
          label="Book Author" 
          variant="outlined" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          required 
        />
        <Button type="submit" variant="contained" size="large">
          Add Book
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {books.length > 0 && books.map((Book) => (
          <Paper key={Book.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{Book.title}</Typography>
              <Typography variant="body2" color="text.secondary">{Book.author}</Typography>
            </Box>
            <Box>
              {/* Botão de Editar */}
              <IconButton color="primary" onClick={() => openEditModal(Book)}>
                <EditIcon />
              </IconButton>
              {/* Botão de Deletar */}
              <IconButton color="error" onClick={() => deleteBook(Book.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Title" 
            fullWidth 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            margin="normal"
          />
          <TextField 
            label="Author" 
            fullWidth 
            value={editAuthor} 
            onChange={(e) => setEditAuthor(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={saveEdit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}