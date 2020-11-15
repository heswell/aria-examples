import React from "react";
import Combobox from "../combobox";
import { searchVeggies } from "../fruit-and-veg";

const ComboboxInlineAutocomplete = () => {
  const handleHide = () => {
    console.log("hide");
  };

  const handleShow = () => {
    console.log("hide");
  };

  return (
    <Combobox
      labelText="Choice 3 Fruit or Vegetable"
      searchFn={searchVeggies}
      shouldAutoSelect
      showDropdown
      onHide={handleHide}
      onShow={handleShow}
    />
  );
};

export default ComboboxInlineAutocomplete;
