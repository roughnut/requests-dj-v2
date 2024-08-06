import React, { useEffect } from 'react';
import '../App.css';

const DiscoBall = () => {
  useEffect(() => {
    const radius = 50;
    const squareSize = 6.5;
    const prec = 19.55;
    const fuzzy = 0.001;
    const inc = (Math.PI - fuzzy) / prec;
    const discoBall = document.getElementById("discoBall");

    for (let t = fuzzy; t < Math.PI; t += inc) {
      let z = radius * Math.cos(t);
      let currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(Math.PI) * Math.sin(t))) / 2.5;
      let circumference = Math.abs(2 * Math.PI * currentRadius);
      let squaresThatFit = Math.floor(circumference / squareSize);
      let angleInc = (Math.PI * 2 - fuzzy) / squaresThatFit;
      for (let i = angleInc / 2 + fuzzy; i < Math.PI * 2; i += angleInc) {
        let square = document.createElement("div");
        let squareTile = document.createElement("div");
        squareTile.style.width = squareSize + "px";
        squareTile.style.height = squareSize + "px";
        squareTile.style.transformOrigin = "0 0 0";
        squareTile.style.webkitTransformOrigin = "0 0 0";
        squareTile.style.webkitTransform = `rotate(${i}rad) rotateY(${t}rad)`;
        squareTile.style.transform = `rotate(${i}rad) rotateY(${t}rad)`;
        if ((t > 1.3 && t < 1.9) || (t < -1.3 && t > -1.9)) {
          squareTile.style.backgroundColor = randomColor("bright");
        } else {
          squareTile.style.backgroundColor = randomColor("any");
        }
        square.appendChild(squareTile);
        square.className = "square";
        squareTile.style.webkitAnimation = "reflect 2s linear infinite";
        squareTile.style.webkitAnimationDelay = `${randomNumber(0, 20) / 10}s`;
        squareTile.style.animation = "reflect 2s linear infinite";
        squareTile.style.animationDelay = `${randomNumber(0, 20) / 10}s`;
        squareTile.style.backfaceVisibility = "hidden";
        let x = radius * Math.cos(i) * Math.sin(t);
        let y = radius * Math.sin(i) * Math.sin(t);
        square.style.webkitTransform = `translateX(${Math.ceil(x)}px) translateY(${y}px) translateZ(${z}px)`;
        square.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(${z}px)`;
        discoBall.appendChild(square);
      }
    }
  }, []);

  const randomColor = (type) => {
    let c;
    if (type === "bright") {
      c = randomNumber(130, 255);
    } else {
      c = randomNumber(110, 190);
    }
    return `rgb(${c},${c},${c})`;
  };

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div id="discoBall">
      <div id="discoBallMiddle"></div>
    </div>
  );
};

export default DiscoBall;