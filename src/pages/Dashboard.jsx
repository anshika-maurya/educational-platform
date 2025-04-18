import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import logo from "../assets/Logo/Logo-Full-Light.png"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Mobile Menu Button - only visible on small screens */}
      <button 
        className="fixed top-[60px] left-6 z-50 rounded-full bg-yellow-50 p-3 shadow-lg md:hidden flex items-center justify-center"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar menu"
      >
        {showSidebar ? 
          <AiOutlineClose size={24} className="text-richblack-900" /> : 
          <AiOutlineMenu size={24} className="text-richblack-900" />
        }
      </button>

      {/* Mobile Sidebar - Only visible on small screens */}
      <div className={`fixed top-0 left-0 h-screen md:hidden ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-[1000]`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-richblack-900 bg-opacity-50 transition-opacity duration-300 ${
            showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        ></div>
        
        {/* Mobile Sidebar Container */}
        <div className="relative h-full w-[280px] bg-richblack-800 z-[1001] flex flex-col shadow-xl">
          {/* Sidebar Header with Logo */}
          <div className="bg-richblack-800 flex items-center justify-between p-4 border-b border-richblack-700">
            <img src={logo} alt="StudyNotion" className="h-8 object-contain" />
            <button 
              onClick={toggleSidebar}
              className="text-richblack-100 p-1 rounded-full hover:bg-richblack-700"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Only visible on large screens */}
      <div className="hidden md:block min-w-[220px] border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto pt-[50px] md:pt-0">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 px-4 md:px-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
