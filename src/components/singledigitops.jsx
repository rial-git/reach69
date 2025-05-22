import { makeBlock } from './utils';


export function singleDigitOp(state, index, op) {

  const block = state.blocks[index];
  const value = parseFloat(block.value);
  let result, info;

  switch(op) {
    case '√': 
      result = Math.sqrt(value);
      info = `√${value}`;
      break;
    case '!':
      result = Array.from({length: value}, (_, i) => i+1).reduce((a,b) => a*b, 1);
      info = `${value}!`;
      break;
    default: 
      return state;
  }
  result = Math.round(result * 100) / 100

  const newBlock = makeBlock(result, [block], { 
    gap: 0, 
    infoOfRoot: info 
  });

  const newBlocks = [...state.blocks];
  newBlocks[index] = newBlock; // Replace the original block with the new block

  return {
    blocks: newBlocks,
    selection: { numbers: [], operation: null },
    error: null
  };
}