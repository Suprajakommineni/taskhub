import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Projects from './pages/projects';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from './components/protectedroute';


import Tasks from './pages/tasks';

const App = () => {
  
  


  return (
  
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/projects' element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:projectId" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />

      </BrowserRouter>

    
);
}
export default App;
                