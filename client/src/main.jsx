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
        path: '/events/create_event_protected',
        element: (<ProtectedRoute element={<AddEvent />} />),
      },
      // Change route path from one above after added logins, as it will not let you add an event unless you are logged in
      // Route below is bypassing this for testing and will be removed later.
      {
        path: '/events/create_event',
        element: <AddEvent />,
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
