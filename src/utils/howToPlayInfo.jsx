import React, { Suspense } from 'react';
import rightMouseClick from '../assets/rightMouseClick.png';
import leftMouseClick from '../assets/leftMouseClick.png';

// Lazy load icons
const FaDivide = React.lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaDivide })));
const FaAsterisk = React.lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaAsterisk })));
const FaMinus = React.lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaMinus })));
const FaPlus = React.lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaPlus })));
const FaDotCircle = React.lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaDotCircle })));

const MdKeyboardBackspace = React.lazy(() => import('react-icons/md').then(mod => ({ default: mod.MdKeyboardBackspace })));
const MdKeyboardReturn = React.lazy(() => import('react-icons/md').then(mod => ({ default: mod.MdKeyboardReturn })));
const MdKeyboard = React.lazy(() => import('react-icons/md').then(mod => ({ default: mod.MdKeyboard })));

// You can create a wrapper component for keyboardControls rendering to wrap each icon in Suspense

export const rules = [
    "can use operations between any single number",
    "can use any operations in between, only one at a time",
    "result can also be used with any number on the list",
    "you can take two or three adjacent digits as a wholenumber, but not any others",
    "the merged whole number can be operated with any number on the list in any order"
];

export const mouseControls = [
  {
    image: leftMouseClick,
    text: "Use Left Mouse Click to select or deselct a number or operation."
  },
  {
    image: rightMouseClick,
    text: "Use Right Mouse Click to undo a number"
  }
];

{mouseControls.map((control, i) => (
  <div key={i}>
    <img src={control.image} alt="mouse control" loading="lazy" />
    <p>{control.text}</p>
  </div>
))}

export const keyboardControls = [
    {
        icon: <Suspense fallback={<div>Loading...</div>}><FaDivide size={48} /></Suspense>,
        text: "Press / for division operation"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><FaAsterisk size={48} /></Suspense>,
        text: "Press * for multiplication operation"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><FaMinus size={48} /></Suspense>,
        text: "Press - for subtraction operation"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><FaPlus size={48} /></Suspense>,
        text: "Press + for addition operation"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><FaDotCircle size={48} /></Suspense>,
        text: "Press . for merge operation"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><MdKeyboardBackspace size={48} /></Suspense>,
        text: "Press Backspace to undo the last merge"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><MdKeyboardReturn size={48} /></Suspense>,
        text: "Press Enter to go to the next level (after success)"
    },
    {
        icon: <Suspense fallback={<div>Loading...</div>}><MdKeyboard size={48} /></Suspense>,
        text: "Press Esc to reset the current level"
    }
];
