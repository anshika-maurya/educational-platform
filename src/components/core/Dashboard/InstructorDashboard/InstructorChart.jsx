import React, { useState } from "react"
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart } from 'chart.js'

Chart.register(ArcElement)

const InstructorChart = ({ courses = [] }) => {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Ensure courses is always an array
  const safeCoursesArray = Array.isArray(courses) ? courses : []

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Data for the chart displaying student information with safety checks
  const chartDataStudents = {
    labels: safeCoursesArray.map((course) => course?.courseName || "Unnamed Course"),
    datasets: [
      {
        data: safeCoursesArray.map((course) => course?.totalStudentsEnrolled || 0),
        backgroundColor: generateRandomColors(safeCoursesArray.length),
      },
    ],
  }

  // Data for the chart displaying income information with safety checks
  const chartIncomeData = {
    labels: safeCoursesArray.map((course) => course?.courseName || "Unnamed Course"),
    datasets: [
      {
        data: safeCoursesArray.map((course) => course?.totalAmountGenerated || 0),
        backgroundColor: generateRandomColors(safeCoursesArray.length),
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    },
    responsive: true
  }

  // Don't render chart if no courses or all values are 0
  const hasData = safeCoursesArray.length > 0 && (
    currChart === "students" 
      ? safeCoursesArray.some(course => (course?.totalStudentsEnrolled || 0) > 0)
      : safeCoursesArray.some(course => (course?.totalAmountGenerated || 0) > 0)
  )

  return (
    <div className="flex flex-1 flex-col gap-y-2 md:gap-y-4 rounded-md bg-richblack-800 p-4 md:p-6 w-full h-full">
      <p className="text-base md:text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-2 md:space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-2 md:px-3 text-xs md:text-sm transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-2 md:px-3 text-xs md:text-sm transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto h-[200px] md:h-[300px] w-full md:w-[90%] flex items-center justify-center">
        {hasData ? (
          <Doughnut
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={options}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm md:text-lg text-richblack-50">
              No data available to display
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorChart