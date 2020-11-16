import React from "react";

import Tabs from "../Tabs";

const AutomaticActivationExample = () => {
  return (
    <Tabs>
      <Tabs.TabPanel id="nils" title="Nils Frahm" ariaLabel="Entertainment">
        <p>
          Nils Frahm is a German musician, composer and record producer based in
          Berlin. He is known for combining classical and electronic music and
          for an unconventional approach to the piano in which he mixes a grand
          piano, upright piano, Roland Juno-60, Rhodes piano, drum machine, and
          Moog Taurus.
        </p>
      </Tabs.TabPanel>
      <Tabs.TabPanel id="agnes" title="Agnes Obel">
        <p>
          Agnes Caroline Thaarup Obel is a Danish singer/songwriter. Her first
          album, Philharmonics, was released by PIAS Recordings on 4 October
          2010 in Europe. Philharmonics was certified gold in June 2011 by the
          Belgian Entertainment Association (BEA) for sales of 10,000 Copies.
        </p>
      </Tabs.TabPanel>
      <Tabs.TabPanel id="complex" title="Joke" deletable>
        <p>Fear of complicated buildings:</p>
        <p>A complex complex complex.</p>
      </Tabs.TabPanel>
    </Tabs>
  );
};

export default AutomaticActivationExample;
