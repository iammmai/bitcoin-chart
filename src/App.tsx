import React, { useState } from "react";
import rawData from "data.json";
import { isoParse, timeFormat } from "d3-time-format";
import { scaleLinear, scaleTime } from "d3-scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { line, curveCardinal } from "d3-shape";

type Datum = { date: Date; price: number };

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 900;
const height = 600;
const background = "#f3f3f3";

const computeExtent = (arr: number[]) => {
  const min = arr.reduce((acc, cur) => Math.min(acc, cur), Infinity);
  const max = arr.reduce((acc, cur) => Math.max(acc, cur), -Infinity);
  return [min, max];
};

const formatTime = timeFormat("%s");
const myData = Object.entries(rawData.bpi).map(([date, price]) => ({
  date: isoParse(date) as Date,
  price,
}));

// accessors
const xAcc = (d: Datum) => (d.date as Date).valueOf();
const yAcc = (d: Datum) => d.price;

// scales
const yScale = scaleLinear()
  .domain(computeExtent(myData.map(yAcc)))
  .range([height - margin.bottom, margin.top]);

const xScale = scaleTime<number>()
  .domain(computeExtent(myData.map(xAcc)))
  .range([margin.left, width - margin.right]);

const lineGen = line<Datum>()
  .x((d) => xScale(xAcc(d)))
  .y((d) => yScale(yAcc(d)))
  .curve(curveCardinal);

const linePath = lineGen(myData) as string;

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div className="App">
      {JSON.stringify(position)}
      <header className="App-header">
        <div>
          <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
              <rect
                width={width}
                height={width}
                fill={background}
                onMouseMove={(e) => {
                  e.persist();
                  setPosition({
                    x: e.clientX - margin.left,
                    y: e.clientY - margin.top,
                  });
                  console.log(e);
                }}
              />
              <circle cx={position.x} cy={position.y} color="red" r="3" />
              <AxisBottom
                top={height - margin.bottom}
                scale={xScale}
                numTicks={10}
              />
              <AxisLeft scale={yScale} left={margin.left} />
              <path d={linePath} stroke="black" strokeWidth="1px" fill="none" />
              <rect />
            </Group>
          </svg>
        </div>
      </header>
    </div>
  );
}

export default App;
