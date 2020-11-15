import React from "react";
import Combobox from "../combobox";
import { searchVeggies } from "../fruit-and-veg";

const ComboboxAutomaticSelection = () => {
  return (
    <Combobox
      labelText="Choice 2 Fruit or Vegetable"
      searchFn={searchVeggies}
      shouldAutoSelect
    />
  );
};

export default ComboboxAutomaticSelection;
