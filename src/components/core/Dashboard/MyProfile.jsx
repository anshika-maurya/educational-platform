import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../Common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      <h1 className="mb-6 md:mb-14 text-2xl md:text-3xl font-medium text-richblack-5">
        My Profile
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-6 sm:px-12 gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-3">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[60px] sm:w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-base sm:text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-xs sm:text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
          customClasses="mt-2 sm:mt-0"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-6 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-xs sm:text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-6 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex flex-col sm:flex-row max-w-[500px] justify-between gap-y-5 sm:gap-y-0 sm:gap-x-4">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">First Name</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">Email</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">Gender</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">Last Name</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">Phone Number</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-xs sm:text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
