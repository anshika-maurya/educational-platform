import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

import { useMediaQuery } from 'react-responsive'

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const handleLinkClick = () => {
    // If on mobile, close the sidebar
    if (isMobile) {
      // Find the checkbox and uncheck it to close the sidebar
      const checkbox = document.getElementById("dashboard-drawer")
      if (checkbox && checkbox.checked) {
        checkbox.checked = false
      }
    }
  }

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
        <div className="flex flex-col">
          {sidebarLinks
            .filter((link) => {
              if (link.type && user?.accountType !== link.type) return false
              return true
            })
            .map((link, i) => (
              <div key={i} onClick={handleLinkClick}>
                <SidebarLink 
                  link={link} 
                  iconName={link.icon} 
                  special={link.name === "Dashboard"} 
                />
              </div>
            ))}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            onClick={handleLinkClick}
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-3 text-sm font-medium text-richblack-300 hover:bg-richblack-700 hover:text-richblack-50"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-xl" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
