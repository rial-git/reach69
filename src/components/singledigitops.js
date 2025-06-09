import { makeBlock } from '../utils/utils';

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
      if (value > 6 || value < 0 || !Number.isInteger(value)) {
        return {
          ...state,
          error: 'Factorial only allowed for integers 0 to 6'
        };
      }
      result = Array.from({ length: value }, (_, i) => i + 1)
                    .reduce((a, b) => a * b, 1);
      info = `${value}!`;
      break;

    default: 
      return state;
  }

  result = Math.round(result * 100) / 100;

  const newBlock = makeBlock(result, [block], { 
    gap: 0, 
    infoOfRoot: info,
    mergedTime: Date.now() 
  });

  const newBlocks = [...state.blocks];
  newBlocks[index] = newBlock;

  return {
    blocks: newBlocks,
    selection: { numbers: [], operation: null },
    error: null
  };
}
