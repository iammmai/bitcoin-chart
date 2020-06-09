import React from "react";
import rawData from "data.json";
import { isoParse } from "d3-time-format";
import { scaleLinear, scaleTime } from "d3-scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { line, curveCardinal } from "d3-shape";
import { textStyles, lineStyles, gridStyles } from "styleConfig";
import { GridRows } from "@vx/grid";
import "index.css";

type Datum = { date: Date; price: number };

const margin = { top: 10, right: 30, bottom: 60, left: 60 };
const width = 900;
const height = 600;
const padding = 50;
const label = "Price in USD";

const computeExtent = (arr: number[]) => {
  const min = arr.reduce((acc, cur) => Math.min(acc, cur), Infinity);
  const max = arr.reduce((acc, cur) => Math.max(acc, cur), -Infinity);
  return [min, max];
};

const myData = Object.entries(rawData.bpi).map(([date, price]) => ({
  date: isoParse(date) as Date,
  price,
}));

// accessors
const xAcc = (d: Datum) => (d.date as Date).valueOf();
const yAcc = (d: Datum) => d.price;

// scales
const [minY, maxY] = computeExtent(myData.map(yAcc));
const yScale = scaleLinear()
  .domain([minY - padding, maxY])
  .range([height - margin.bottom, margin.top]);

const xScale = scaleTime<number>()
  .domain(computeExtent(myData.map(xAcc)))
  .range([margin.left, width - margin.right]);

const lineGen = line<Datum>()
  .x((d) => xScale(xAcc(d)))
  .y((d) => yScale(yAcc(d)))
  .curve(curveCardinal.tension(0.5));

const linePath = lineGen(myData) as string;

function App() {
  return (
    <div
      style={{
        backgroundColor: "#242038",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontFamily: "Arial",
          color: "#8D86C9",
          marginLeft: margin.left,
        }}
      >
        Bitcoin prices over the last 30 days
      </h1>
      <svg width={width + margin.right + margin.left} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={width - margin.right}
            {...gridStyles}
          />
          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            numTicks={10}
            tickLabelProps={() => ({
              ...textStyles,
              stroke: "none",
              fontSize: 11,
            })}
            {...textStyles}
          />
          <AxisLeft
            scale={yScale}
            left={margin.left}
            tickLabelProps={() => ({
              ...textStyles,
              stroke: "none",
              fontSize: 11,
              dx: "-35px",
            })}
            {...textStyles}
            hideAxisLine
            label={label}
            labelProps={{
              x: -50,
              y: -70,
              fill: "#F7ECE1",
              fontSize: 11,
              strokeWidth: 0,
              fontFamily: "sans-serif",
              textAnchor: "end",
              opacity: 0.8,
            }}
          />
          <path d={linePath} {...lineStyles} />
          <rect />
        </Group>
      </svg>
    </div>
  );
}

export default App;
