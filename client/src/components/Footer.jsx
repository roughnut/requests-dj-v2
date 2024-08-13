import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="bg-light py-1 text-center">
      <div className="text-dark mt-4">
        <div className="d-flex justify-content-center gap-4">
          <a href="https://github.com/CinosMagician" target="_blank" rel="noopener noreferrer" className="text-decoration-none navi">Lachlan</a>
          <a href="https://github.com/roughnut" target="_blank" rel="noopener noreferrer" className="text-decoration-none navi">Jeremy</a>
        </div>
        <p className="text-muted small mt-2">&copy; 2024</p>
      </div>
    </footer>
  );
};

export default Footer;