'use client';

import { useState, useEffect, FormEvent } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type Employee = {
  id: number;
  name: string;
  role: string;
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  // Estados para o Modal de Edição
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees');
    const data = await res.json();
    setEmployees(data);
  };

  // --- CREATE ---
  const addEmployee = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role }),
    });

    if (res.ok) {
      const newEmployee = await res.json();
      setEmployees([newEmployee, ...employees]);
      setName('');
      setRole('');
    }
  };

  // --- DELETE ---
  const deleteEmployee = async (id: number) => {
    const res = await fetch('/api/employees', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  // --- UPDATE (Abre o Modal e seta os dados) ---
  const openEditModal = (emp: Employee) => {
    setEditId(emp.id);
    setEditName(emp.name);
    setEditRole(emp.role);
    setEditOpen(true);
  };

  // --- UPDATE (Salva os dados no banco) ---
  const saveEdit = async () => {
    if (!editId) return;

    const res = await fetch('/api/employees', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, name: editName, role: editRole }),
    });

    if (res.ok) {
      // Atualiza a lista na tela sem precisar recarregar a página
      setEmployees(employees.map(emp => 
        emp.id === editId ? { ...emp, name: editName, role: editRole } : emp
      ));
      setEditOpen(false); // Fecha o modal
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Team Directory
      </Typography>

      {/* Formulário de Adicionar usando Paper do MUI */}
      <Paper component="form" onSubmit={addEmployee} sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          label="Employee Name" 
          variant="outlined" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <TextField 
          label="Job Role (e.g. Designer)" 
          variant="outlined" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required 
        />
        <Button type="submit" variant="contained" size="large">
          Add Team Member
        </Button>
      </Paper>

      {/* Lista de Funcionários */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {employees.map((emp) => (
          <Paper key={emp.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{emp.name}</Typography>
              <Typography variant="body2" color="text.secondary">{emp.role}</Typography>
            </Box>
            <Box>
              {/* Botão de Editar */}
              <IconButton color="primary" onClick={() => openEditModal(emp)}>
                <EditIcon />
              </IconButton>
              {/* Botão de Deletar */}
              <IconButton color="error" onClick={() => deleteEmployee(emp.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Modal de Edição (Dialog do MUI) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField 
            label="Name" 
            fullWidth 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} 
          />
          <TextField 
            label="Role" 
            fullWidth 
            value={editRole} 
            onChange={(e) => setEditRole(e.target.value)} 
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