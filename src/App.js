import React from "react";

import {
  AutomaticActivation as AutoTabs,
  ManualActivation as ManualTabs
} from "./tabs";

import {
  AutomaticSelectCombobox,
  InlineAutocompleteCombobox,
  ManualSelectCombobox
} from "./combo-box";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <AutoTabs />
      <ManualTabs />

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
