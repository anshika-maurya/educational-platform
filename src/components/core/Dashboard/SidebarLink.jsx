import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName, special }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(matchRoute(link.path))
  }, [location.pathname, link.path])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  // Only reset course state if not already on the same route
  const handleClick = (e) => {
    if (isActive) {
      e.preventDefault()
      return
    }
    dispatch(resetCourseState())
  }

  // Special styling for Dashboard link
  const dashboardStyle = special ? {
    fontSize: '1rem',
    fontWeight: '600',
    paddingTop: '0.875rem',
    paddingBottom: '0.875rem',
  } : {}

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`relative px-8 py-3 text-sm font-medium flex items-center ${
        isActive
          ? `${special ? "bg-yellow-400 text-richblack-900" : "bg-yellow-800 text-yellow-50"}`
          : `bg-opacity-0 text-richblack-300 hover:bg-richblack-700 hover:text-richblack-50 ${special ? "hover:bg-yellow-500 hover:bg-opacity-20 hover:text-yellow-50" : ""}`
      } transition-all duration-200`}
      style={dashboardStyle}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] ${
          special ? "bg-yellow-400" : "bg-yellow-50"
        } ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center gap-x-2">
        <Icon 
          className={`${special ? "text-2xl" : "text-xl"} ${
            isActive 
              ? `${special ? "text-richblack-900" : "text-yellow-50"}` 
              : "text-richblack-300"
          }`} 
        />
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}
