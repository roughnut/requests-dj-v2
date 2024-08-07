import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import components from './pages/componentPage';
// Repeat for each different page
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events.jsx';
import Home from './pages/Home';
import AddEvent from './components/AddEvent.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import EventPage from './pages/EventPage.jsx';
import AddSong from './components/AddSong.jsx';
import UpdateEvent from './components/UpdateEvent.jsx';

// Define the accessible routes, and which components respond to which URL
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      // Add the children pages from the imports.
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/events',
        element: <Events />,
      },
      {
        path: '/events/create_event',
        element: (<ProtectedRoute element={<AddEvent />} />),
      },
      {
        path: '/events/:id/update',
        element: (<ProtectedRoute element={<UpdateEvent />} />),
      },
      {
        path: '/events/:id/add_song',
        element: <AddSong />
      },
      {
        path: '/events/:id',
        element: <EventPage />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
