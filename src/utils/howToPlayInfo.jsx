import rightMouseClick from '../assets/rightMouseClick.png';
import leftMouseClick from '../assets/leftMouseClick.png';
import { FaDivide, FaAsterisk, FaMinus, FaPlus, FaDotCircle, FaBackspace, FaSignInAlt, FaRegKeyboard } from "react-icons/fa";
import { MdKeyboardReturn, MdKeyboardBackspace, MdKeyboard } from "react-icons/md";
import { RiArrowLeftRightLine } from "react-icons/ri";

export const rules = [

    "can use operations between any single number",
    "can use any operations in between, only one at a time",
    "result can also be used with any number on the list",
    "you can take two or three adjacent digits as a wholenumber, but not any others",
    "the merged whole number can be operated with any number on the list in any order"
]

export const mouseControls = [
    {
        image: leftMouseClick,
        text: "Use Left Mouse Click to select or deselct a number or operation."
    },

    {
        image: rightMouseClick,
        text: "Use Right Mouse Click to undo a number"
    },

]


export const keyboardControls = [
    {
        icon: <FaDivide size={48} />,
        text: "Press / for division operation"
    },
    {
        icon: <FaAsterisk size={48} />,
        text: "Press * for multiplication operation"
    },
    {
        icon: <FaMinus size={48} />,
        text: "Press - for subtraction operation"
    },
    {
        icon: <FaPlus size={48} />,
        text: "Press + for addition operation"
    },
    {
        icon: <FaDotCircle size={48} />,
        text: "Press . for merge operation"
    },
    {
        icon: <MdKeyboardBackspace size={48} />,
        text: "Press Backspace to undo the last merge"
    },
    {
        icon: <MdKeyboardReturn size={48} />,
        text: "Press Enter to go to the next level (after success)"
    },
    {
        icon: <MdKeyboard size={48} />,
        text: "Press Esc to reset the current level"
    }
];