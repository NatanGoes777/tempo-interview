'use client';

import { useState, useEffect, FormEvent } from 'react';

type Task = {
  id: number;
  title: string;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]); // Adiciona a nova tarefa no topo da lista na tela
        setNewTaskTitle(''); // Limpa o input
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tempo Tasks</h1>

      {/* Formulário de Adicionar */}
      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-900 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm"
        >
          Add Task
        </button>
      </form>

      {/* Lista de Tarefas */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <p className="p-4 text-gray-500 text-center">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">Nenhuma tarefa. Crie uma!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <span className="text-gray-800 font-medium">{task.title}</span>
                <span className="text-xs text-gray-400">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}