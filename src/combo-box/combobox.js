import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useId } from "../utils/use-id";
import aria from "../utils/aria-utils";

import "./combobox.css";

const Combobox = ({
  id: idProp,
  searchFn,
  shouldAutoSelect,
  shouldAutoComplete,
  showDropdown,
  labelText
}) => {
  const [id, idInput, idListbox, idLabel, idArrow] = useId(idProp, [
    "combobox",
    "input",
    "listbox",
    "label",
    "combobox-arrow"
  ]);

  const combobox = useRef(null);
  const input = useRef(null);
  const listbox = useRef(null);
  const dropdown = useRef(null);
  const activeIndex = useRef(-1);
  const resultsCount = useRef(0);
  const shown = useRef(false);
  const hasInlineAutocomplete = useRef(false);

  useLayoutEffect(() => {
    if (input.current.getAttribute("aria-autocomplete") === "both") {
      hasInlineAutocomplete.current = true;
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", checkHide);
    return () => document.body.removeEventListener("click", checkHide);
  }, []);

  const handleInputKeyUpCheckKey = (evt) => {
    var key = evt.which || evt.keyCode;

    switch (key) {
      case aria.KeyCode.UP:
      case aria.KeyCode.DOWN:
      case aria.KeyCode.ESC:
      case aria.KeyCode.RETURN:
        evt.preventDefault();
        return;
      default:
        updateResults(false);
    }

    if (hasInlineAutocomplete.current) {
      switch (key) {
        case aria.KeyCode.BACKSPACE:
          return;
        default:
          autocompleteItem();
      }
    }
  };

  const updateResults = (shouldShowAll) => {
    var searchString = input.current.value;
    var results = searchFn(searchString);

    hideListbox();

    if (!shouldShowAll && !searchString) {
      results = [];
    }

    if (results.length) {
      for (var i = 0; i < results.length; i++) {
        var resultItem = document.createElement("li");
        resultItem.className = "result";
        resultItem.setAttribute("role", "option");
        resultItem.setAttribute("id", "result-item-" + i);
        resultItem.innerText = results[i];
        if (shouldAutoSelect && i === 0) {
          resultItem.setAttribute("aria-selected", "true");
          aria.Utils.addClass(resultItem, "focused");
          activeIndex.current = 0;
        }
        listbox.current.appendChild(resultItem);
      }
      aria.Utils.removeClass(listbox.current, "hidden");
      combobox.current.setAttribute("aria-expanded", "true");
      resultsCount.current = results.length;
      shown.current = true;
      onShow();
    }
  };

  const onHide = () => {
    if (showDropdown) {
      dropdown.current.setAttribute("aria-label", "Hide vegetable options");
    }
  };

  const onShow = () => {
    if (showDropdown) {
      dropdown.current.setAttribute("aria-label", "Show vegetable options");
    }
  };

  const handleInputKeyDownSetActiveItem = (evt) => {
    var key = evt.which || evt.keyCode;

    if (key === aria.KeyCode.ESC) {
      hideListbox();
      setTimeout(function () {
        // On Firefox, input does not get cleared here unless wrapped in
        // a setTimeout
        input.current.value = "";
      }, 1);
      return;
    }

    if (resultsCount.current < 1) {
      if (
        hasInlineAutocomplete.current &&
        (key === aria.KeyCode.DOWN || key === aria.KeyCode.UP)
      ) {
        updateResults(true);
      } else {
        return;
      }
    }

    const prevActive = getItemAt(activeIndex.current);
    let activeItem;

    switch (key) {
      case aria.KeyCode.UP:
        if (activeIndex.current <= 0) {
          activeIndex.current = resultsCount.current - 1;
        } else {
          activeIndex.current -= 1;
        }
        break;
      case aria.KeyCode.DOWN:
        if (
          activeIndex.current === -1 ||
          activeIndex.current >= resultsCount.current - 1
        ) {
          activeIndex.current = 0;
        } else {
          activeIndex.current += 1;
        }
        break;
      case aria.KeyCode.RETURN:
        activeItem = getItemAt(activeIndex.current);
        selectItem(activeItem);
        return;
      case aria.KeyCode.TAB:
        checkSelection();
        hideListbox();
        return;
      default:
        return;
    }

    evt.preventDefault();

    activeItem = getItemAt(activeIndex.current);

    if (prevActive) {
      aria.Utils.removeClass(prevActive, "focused");
      prevActive.setAttribute("aria-selected", "false");
    }

    if (activeItem) {
      input.current.setAttribute(
        "aria-activedescendant",
        "result-item-" + activeIndex
      );
      aria.Utils.addClass(activeItem, "focused");
      activeItem.setAttribute("aria-selected", "true");
      if (hasInlineAutocomplete.current) {
        input.current.value = activeItem.innerText;
      }
    } else {
      input.current.setAttribute("aria-activedescendant", "");
    }
  };

  const getItemAt = (index) => {
    return document.getElementById("result-item-" + index);
  };
  const handleInputBlur = (e) => {
    console.log(`Input Blur`);
  };
  const handleListboxClickItem = (evt) => {
    if (evt.target && evt.target.nodeName === "LI") {
      selectItem(evt.target);
    }
  };

  const selectItem = (item) => {
    if (item) {
      input.current.value = item.innerText;
      hideListbox();
    }
  };

  const handleInputFocusCheckShow = (e) => {
    updateResults(false);
  };

  const checkHide = (evt) => {
    if (evt.target === input.current || combobox.current.contains(evt.target)) {
      return;
    }
    hideListbox();
  };

  const hideListbox = () => {
    shown.current = false;
    activeIndex.current = -1;
    listbox.current.innerHTML = "";
    aria.Utils.addClass(listbox.current, "hidden");
    combobox.current.setAttribute("aria-expanded", "false");
    resultsCount.current = 0;
    input.current.setAttribute("aria-activedescendant", "");
    onHide();
  };

  const checkSelection = () => {
    if (activeIndex.current < 0) {
      return;
    }
    var activeItem = getItemAt(activeIndex.current);
    selectItem(activeItem);
  };

  const autocompleteItem = () => {
    var autocompletedItem = listbox.current.querySelector(".focused");
    var inputText = input.current.value;

    if (!autocompletedItem || !inputText) {
      return;
    }

    var autocomplete = autocompletedItem.innerText;
    if (inputText !== autocomplete) {
      input.current.value = autocomplete;
      input.current.setSelectionRange(inputText.length, autocomplete.length);
    }
  };

  const handleDropdownClick = () => {
    input.current.focus();
    if (shown.current) {
      hideListbox();
    } else {
      updateResults(true);
    }
  };

  return (
    <>
      <label id={idLabel} className="combobox-label">
        {labelText}
      </label>
      <div className="combobox-wrapper">
        <div
          ref={combobox}
          role="combobox"
          aria-expanded="false"
          aria-owns={idListbox}
          aria-haspopup="listbox"
          id={id}
        >
          <input
            ref={input}
            type="text"
            aria-autocomplete={shouldAutoComplete ? "both" : "list"}
            aria-controls={idListbox}
            aria-labelledby={idLabel}
            id={idInput}
            onKeyDown={handleInputKeyDownSetActiveItem}
            onKeyUp={handleInputKeyUpCheckKey}
            onFocus={handleInputFocusCheckShow}
            onBlur={handleInputBlur}
          />
          {showDropdown ? (
            <div
              ref={dropdown}
              className="combobox-dropdown"
              id={idArrow}
              tabIndex="-1"
              role="button"
              aria-label="Show vegetable options"
              onClick={handleDropdownClick}
            >
              <img
                src="https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/imgs/arrow_drop_down_grey_27x27.png"
                alt=""
              />
            </div>
          ) : null}
        </div>
        <ul
          ref={listbox}
          aria-labelledby={idLabel}
          role="listbox"
          id={idListbox}
          className="listbox hidden"
          onClick={handleListboxClickItem}
        ></ul>
      </div>
    </>
  );
};

export default Combobox;
