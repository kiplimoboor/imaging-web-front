import {
  useId
} from "./chunk-WESD66WE.js";

// node_modules/@mui/material/esm/utils/useId.js
var useId_default = useId;

// node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

// node_modules/@mui/utils/esm/setRef/setRef.js
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export {
  ownerDocument,
  setRef,
  useId_default
};
//# sourceMappingURL=chunk-TAJZFEXT.js.map
