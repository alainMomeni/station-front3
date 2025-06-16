// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes'; // Importez votre nouveau composant de routes
import './App.css'; // Ou votre fichier de styles global principal

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;