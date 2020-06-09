import React from 'react'
import Chart from 'Chart'
import rawData from "data.json";
import { isoParse } from "d3-time-format";

function App() {
    const data = Object.entries(rawData.bpi).map(([date, price]) => ({
        date: isoParse(date) as Date,
        price,
    }));
    return (<Chart data={data} />)
}

export { App }