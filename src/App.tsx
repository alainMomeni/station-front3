// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Importez votre nouveau composant de routes
import './App.css'; // Ou votre fichier de styles global principal

function App() {
  return (
    <BrowserRouter>
      <AppRoutes /> {/* Rendez le composant qui contient vos routes */}
    </BrowserRouter>
  );
}

export default App;