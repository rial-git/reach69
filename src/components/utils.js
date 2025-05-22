// src/utils/utils.js
export function makeBlock(value, root = null, meta = null) {
  return {
    id: crypto.randomUUID(),
    value: String(value),
    root,
    meta,
  };
}