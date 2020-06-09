import React from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { line, curveCardinal } from "d3-shape";
import { textStyles, lineStyles, gridStyles } from "styles";
import { GridRows } from "@vx/grid";

type Datum = { date: Date; price: number };

const margin = { top: 10, right: 60, bottom: 60, left: 80 };

const width = 900 - (margin.left + margin.right);
const height = 600 - (margin.top + margin.bottom);
const padding = 50;
const label = "Price in USD";

const computeExtent = (arr: number[]) => {
  const min = arr.reduce((acc, cur) => Math.min(acc, cur), Infinity);
  const max = arr.reduce((acc, cur) => Math.max(acc, cur), -Infinity);
  return [min, max];
};


type Props = {
  data: Datum[]
}

function Chart({ data }: Props) {

  // accessors
  const xAcc = (d: Datum) => (d.date as Date).valueOf();
  const yAcc = (d: Datum) => d.price;

  // scales
  const [minY, maxY] = computeExtent(data.map(yAcc));
  const yScale = scaleLinear()
    .domain([minY - padding, maxY])
    .range([height, 0]);

  const xScale = scaleTime<number>()
    .domain(computeExtent(data.map(xAcc)))
    .range([0, width]);

  const lineGen = line<Datum>()
    .x((d) => xScale(xAcc(d)))
    .y((d) => yScale(yAcc(d)))
    .curve(curveCardinal.tension(0.5));

  const linePath = lineGen(data) as string;

  return (
    <div
      style={{
        backgroundColor: "#242038",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center',
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
      <svg width={width + margin.right + margin.left} height={height + margin.top + margin.bottom}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={width}
            {...gridStyles}
          />
          <AxisBottom
            top={height}
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
        </Group>
      </svg>
    </div>
  );
}

export default Chart;
