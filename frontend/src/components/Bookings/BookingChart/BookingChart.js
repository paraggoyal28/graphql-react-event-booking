import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
const BOOKING_BUCKETS = {
  Cheap: { start: 0, end: 100 },
  Normal: { start: 101, end: 200 },
  Expensive: { start: 201, end: 100000000 },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Cost Types of Bookings",
    },
  },
};

const generateBackgroundColor = () => {
  const redPortion = Math.floor(Math.random() * 256);
  const greenPortion = Math.floor(Math.random() * 256);
  const bluePortion = Math.floor(Math.random() * 256);
  const hue = Math.random();
  return `rgba(${redPortion}, ${greenPortion}, ${bluePortion}, ${hue})`;
};

const BookingChart = (props) => {
  const output = {};
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingsCnt = props.bookings.reduce((acc, booking) => {
      return (
        acc +
        (booking.event.price >= BOOKING_BUCKETS[bucket].start &&
        booking.event.price <= BOOKING_BUCKETS[bucket].end
          ? 1
          : 0)
      );
    }, 0);
    values.push(filteredBookingsCnt);
    output[bucket] = filteredBookingsCnt;
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      backgroundColor: generateBackgroundColor(),
      data: values,
    });

    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BookingChart;
