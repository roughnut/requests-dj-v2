// import React from 'react';
import { PiVinylRecordLight } from "react-icons/pi";
import '../App.css';

const Footer = () => {
  return (
    <footer className="bg-light py-1 text-center">
      <div className="text-dark mt-4">
        <p className="d-flex justify-content-center align-items-center gap-2">
          Made with <PiVinylRecordLight /> by 
          <a href="https://github.com/CinosMagician" target="_blank" rel="noopener noreferrer" className="text-decoration-none navi text-muted">Lachlan</a>
          and 
          <a href="https://github.com/roughnut" target="_blank" rel="noopener noreferrer" className="text-decoration-none navi text-muted">Jeremy</a> &copy; 2024</p>
      </div>
    </footer>
  );
};

export default Footer;