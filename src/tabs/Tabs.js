import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./Tabs.css";

// For easy reference
var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

const Tab = ({
  id,
  deletable,
  index,
  onClick,
  onKeyDown,
  onKeyUp,
  selected,
  title
}) => (
  <button
    role="tab"
    aria-selected={selected}
    aria-controls={`${id}-tab`}
    data-index={index}
    data-deletable={deletable}
    id={id}
    onClick={onClick}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
    tabIndex={selected ? undefined : -1}
  >
    {title}
  </button>
);

const Tabstrip = forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} role="tablist" aria-label="Entertainment">
      {children}
    </div>
  );
});

const TabPanel = ({ children, id, hidden }) => {
  return (
    <div
      tabIndex="0"
      role="tabpanel"
      id={`${id}-tab`}
      aria-labelledby={id}
      hidden={hidden}
    >
      {children}
    </div>
  );
};

const Tabs = ({ children, vertical, selectedTabIdx = 0 }) => {
  const root = useRef(null);
  const tablist = useRef(null);
  var delay = useRef(0);
  const [selectedIdx, setSelectedIdx] = useState(selectedTabIdx);

  useEffect(() => {
    // Determine whether there should be a delay
    // when user navigates with the arrow keys
    var hasDelay = tablist.current.hasAttribute("data-delay");

    if (hasDelay) {
      var delayValue = tablist.current.getAttribute("data-delay");
      if (delayValue) {
        delay.current = delayValue;
      } else {
        // If no value is specified, default to 300ms
        delay.current = 300;
      }
    }
  }, []);

  function focusEventHandler(event) {
    var target = event.target;
    setTimeout(checkTabFocus, delay.current, target);
  }

  // Only activate tab on focus if it still has focus after the delay
  function checkTabFocus(target) {
    const focused = document.activeElement;
    if (target === focused) {
      activateTab(target, false);
    }
  }

  // Activates any given tab panel
  function activateTab(tab, setFocus = true) {
    // // Remove hidden attribute from tab panel to make it visible
    // document.getElementById(controls).removeAttribute("hidden");
    const index = parseInt(tab.dataset.index, 10);
    setSelectedIdx(index);
    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
  }

  const handleTabClick = (e) => {
    var tab = e.target;
    activateTab(tab, false);
  };

  const handleTabKeyDown = (e) => {
    const key = e.keyCode;
    const tabs = tablist.current.querySelectorAll('[role="tab"]');

    switch (key) {
      case keys.end:
        e.preventDefault();
        // Activate last tab
        activateTab(tabs[tabs.length - 1]);
        break;
      case keys.home:
        e.preventDefault();
        // Activate first tab
        activateTab(tabs[0]);
        break;

      // Up and down are in keydown
      // because we need to prevent page scroll >:)
      case keys.up:
      case keys.down:
        determineOrientation(e);
        break;
      default:
    }
  };

  const handleTabKeyUp = (e) => {
    var key = e.keyCode;

    switch (key) {
      case keys.left:
      case keys.right:
        determineOrientation(e);
        break;
      case keys.delete:
        determineDeletable(e);
        break;
      default:
    }
  };

  // Detect if a tab is deletable
  function determineDeletable(e) {
    const target = e.target;

    if (target.getAttribute("data-deletable") === "true") {
      // Delete target tab
      deleteTab(e, target);

      // Activate the closest tab to the one that was just deleted
      const tabs = tablist.current.querySelectorAll('[role="tab"]');
      const index = parseInt(target.dataset.index, 10);
      if (index - 1 < 0) {
        activateTab(tabs[0]);
      } else {
        activateTab(tabs[index - 1]);
      }
    }
  }

  // Deletes a tab and its panel
  function deleteTab(event) {
    var target = event.target;
    var panel = document.getElementById(target.getAttribute("aria-controls"));
    target.parentElement.removeChild(target);
    panel.parentElement.removeChild(panel);
  }

  // When a tablistâ€™s aria-orientation is set to vertical,
  // only up and down arrow should function.
  // In all other cases only left and right arrow function.
  function determineOrientation(e) {
    var key = e.keyCode;
    var proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        e.preventDefault();
        proceed = true;
      }
    } else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      }
    }

    if (proceed) {
      switchTabOnArrowPress(e);
    }
  }

  // Either focus the next, previous, first, or last tab
  // depening on key pressed
  function switchTabOnArrowPress(e) {
    var pressed = e.keyCode;
    const tabs = tablist.current.querySelectorAll('[role="tab"]');

    for (let x = 0; x < tabs.length; x++) {
      tabs[x].addEventListener("focus", focusEventHandler);
    }

    if (direction[pressed]) {
      var target = e.target;
      if (target.dataset.index !== undefined) {
        const index = parseInt(target.dataset.index, 10);
        if (tabs[index + direction[pressed]]) {
          tabs[index + direction[pressed]].focus();
        } else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab();
        } else if (pressed === keys.right || pressed === keys.down) {
          focusFirstTab();
        }
      }
    }
  }

  // Make a guess
  function focusFirstTab() {
    const tabs = tablist.current.querySelectorAll('[role="tab"]');
    tabs[0].focus();
  }

  // Make a guess
  function focusLastTab() {
    const tabs = tablist.current.querySelectorAll('[role="tab"]');
    tabs[tabs.length - 1].focus();
  }

  const tabstrip = (
    <Tabstrip ref={tablist}>
      {React.Children.map(children, (child, i) => {
        const { id, title, deletable } = child.props;
        return (
          <Tab
            id={id}
            index={i}
            deletable={deletable}
            onClick={handleTabClick}
            onKeyDown={handleTabKeyDown}
            onKeyUp={handleTabKeyUp}
            selected={i === selectedIdx}
            title={title}
          />
        );
      })}
    </Tabstrip>
  );

  return (
    <div className="tabs" ref={root}>
      {tabstrip}
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, { hidden: i !== selectedIdx });
      })}
    </div>
  );
};

Tabs.TabPanel = TabPanel;

export default Tabs;
