import leftMouseClick from '../assets/leftMouseClick.png';
import rightMouseClick from '../assets/rightMouseClick.png';

const imagesToPreload = [
  leftMouseClick,
  rightMouseClick,
];

export function preloadImages() {
  imagesToPreload.forEach(src => {
    const img = new window.Image();
    img.src = src;
  });
}