import { useEffect, useState, useRef } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useSelector, useDispatch } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { logout } from "../../services/operations/authAPI";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res?.data?.data || []); // Ensuring it's always an array
      } catch (error) {
        console.error("Could not fetch Categories.", error);
        setSubLinks([]); // Avoiding undefined errors
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to go to dashboard
  const goToDashboard = () => {
    navigate("/dashboard/my-profile");
    setMobileMenuOpen(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout(navigate));
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200 relative`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        subLinks
                          ?.filter(
                            (subLink) =>
                              Array.isArray(subLink?.courses) &&
                              subLink.courses.length > 0
                          )
                          ?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile Menu Button - hide on dashboard pages */}
        <button 
          className={`block md:hidden ${location.pathname.includes("/dashboard") ? "hidden" : ""}`} 
          onClick={toggleMobileMenu} 
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[1000] bg-richblack-900 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      ></div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 z-[1001] h-screen w-[70%] bg-richblack-800 p-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <img src={logo} alt="Logo" width={120} height={24} className="object-contain" />
            </Link>
            <button onClick={toggleMobileMenu} className="text-richblack-100">
              <AiOutlineClose fontSize={24} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-y-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index} className="border-b border-richblack-700 pb-4">
                  {link.title === "Catalog" ? (
                    <div>
                      <div
                        className={`flex cursor-pointer items-center justify-between ${
                          matchRoute("/catalog/:catalogName")
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                        onClick={() => setCategoryOpen(!categoryOpen)}
                      >
                        <p className="text-lg font-medium">{link.title}</p>
                        <BsChevronDown className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
                      </div>
                      
                      {/* Mobile Catalog dropdown */}
                      <div className={`mt-4 pl-4 space-y-3 overflow-hidden transition-all duration-300 ${categoryOpen ? "max-h-96" : "max-h-0"}`}>
                        {loading ? (
                          <p className="text-center text-richblack-100">Loading...</p>
                        ) : subLinks.length ? (
                          subLinks
                            ?.filter(
                              (subLink) =>
                                Array.isArray(subLink?.courses) &&
                                subLink.courses.length > 0
                            )
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="block py-2 text-richblack-100 hover:text-yellow-25 transition-colors"
                                key={i}
                                onClick={toggleMobileMenu}
                              >
                                {subLink.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center text-richblack-100">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path} onClick={toggleMobileMenu}>
                      <p
                        className={`text-lg font-medium ${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Auth Buttons / Cart */}
          <div className="mt-8 flex flex-col gap-y-4">
            {token !== null && (
              <div className="rounded-md overflow-hidden bg-richblack-700">
                {/* User profile header */}
                <div 
                  className="flex items-center gap-x-2 p-3 cursor-pointer"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    src={user?.image}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[30px] rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-richblack-50">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-richblack-300">{user?.email}</p>
                  </div>
                  <BsChevronDown className={`transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {/* Dropdown options */}
                <div className={`overflow-hidden transition-all duration-300 ${profileDropdownOpen ? "max-h-[200px]" : "max-h-0"}`}>
                  <button 
                    onClick={goToDashboard}
                    className="flex items-center gap-x-2 w-full p-3 text-richblack-100 hover:bg-richblack-600 active:bg-richblack-600 border-t border-richblack-600"
                  >
                    <VscDashboard className="text-xl" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-x-2 w-full p-3 text-richblack-100 hover:bg-richblack-600 active:bg-richblack-600 border-t border-richblack-600"
                  >
                    <VscSignOut className="text-xl" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
            
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link 
                to="/dashboard/cart" 
                className="flex items-center gap-x-2 text-richblack-100"
                onClick={toggleMobileMenu}
              >
                <AiOutlineShoppingCart className="text-2xl" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="ml-1 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {token === null ? (
              <div className="flex flex-col gap-y-4">
                <Link to="/login">
                  <button 
                    className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100"
                    onClick={toggleMobileMenu}
                  >
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button 
                    className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100"
                    onClick={toggleMobileMenu}
                  >
                    Sign up
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
