import { useRef } from "react";

let _id = 1;

export const useId = (defaultId, suffixes) => {
  const { current: id } = useRef(defaultId ?? _id++);
  if (suffixes) {
    // TODO don't create thes eevery time, keep them inn the ref
    return suffixes.map((suffix) => `${id}-${suffix}`);
  } else {
    return id;
  }
};
