import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Home = React.lazy(() => import('../pages/Home'));

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
      <React.Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </React.Suspense>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
