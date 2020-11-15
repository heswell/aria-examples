import React from "react";

import {
  AutomaticSelectCombobox,
  InlineAutocompleteCombobox,
  ManualSelectCombobox
} from "./combo-box";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <ManualSelectCombobox />
      <br />
      <br />
      <AutomaticSelectCombobox />
      <br />
      <br />
      <InlineAutocompleteCombobox />
    </div>
  );
}
