import React from "react";
import Combobox from "../combobox";
import { searchVeggies } from "../fruit-and-veg";

const ComboboxManualSelection = () => {
  return (
    <Combobox
      labelText="Choice 1 Fruit or Vegetable"
      searchFn={searchVeggies}
    />
  );
};

export default ComboboxManualSelection;
