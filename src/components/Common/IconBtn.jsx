export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "button",
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-1 sm:gap-x-2 rounded-md py-1 sm:py-2 px-3 sm:px-5 text-sm sm:text-base font-semibold text-richblack-900 ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}
