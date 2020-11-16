import React from "react";

import { AutomaticActivation as AutoTabs } from "./tabs";

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
