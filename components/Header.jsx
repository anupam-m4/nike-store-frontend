import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import Link from "next/link";
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";

// import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { fetchDataFromApi } from "@/utils/api";
import { useSelector } from "react-redux";

const Header = () => {
  const [mobileMenu, setmobileMenu] = useState(false);
  const [showCateMenu, setshowCateMenu] = useState(false);
  const [show, setshow] = useState("translate-y-0");
  const [lastScrollY, setlastScrollY] = useState(0);
  const [categories, setCategories] = useState(null);

  const { cartItems } = useSelector((state) => state.cart);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setshow("-translate-y-[80px]");
      } else {
        setshow(" shadow-sm");
      }
    } else {
      setshow("translate-y-0");
    }
    setlastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await fetchDataFromApi("/api/categories?populate=*");
    setCategories(data);
  };

  return (
    <header
      className={`w-full h-[50px] md:h-[80px] bg-slate-50 flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show} md:h-[80px]`}
    >
      <Wrapper className="h-[60px] flex justify-between items-center">
        <Link href="/">
          <img
            src="/logo.svg"
            className="w-[40px] md:w-[60px] cursor-pointer"
          />
        </Link>
        <Menu
          showCateMenu={showCateMenu}
          setshowCateMenu={setshowCateMenu}
          categories={categories}
        />
        {mobileMenu && (
          <MenuMobile
            showCateMenu={showCateMenu}
            setshowCateMenu={setshowCateMenu}
            setmobileMenu={setmobileMenu}
            categories={categories}
          />
        )}

        <div className="flex items-center gap-2 text-black">
          {/* wish icon start */}
          <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
            {/* <IoMdHeartEmpty className="text-[16px] md:text-[22px]" />
            <div className="h-[14px md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[13px] flex justify-center items-center px-[2px] md:px-[5px] ">
              5
            </div> */}
          </div>
          {/*wish icon end */}

          {/* cart icon start */}
          <Link href="/cart">
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
              <BsCart className="text-[15px] md:text-[20px]" />

              {cartItems.length > 0 && (
                <div className="h-[14px md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[13px] flex justify-center items-center px-[2px] md:px-[5px] ">
                  {cartItems.length}
                </div>
              )}
            </div>
          </Link>
          {/* cart icon end */}

          {/* mobile side-nav start */}
          <div className="w-8 md:w-12  h-8 md:h-12 md:hidden rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative -mr-2">
            {mobileMenu ? (
              <VscChromeClose
                className="text-[16px]"
                onClick={() => setmobileMenu(false)}
              />
            ) : (
              <BiMenuAltRight
                className="text-[20px]"
                onClick={() => setmobileMenu(true)}
              />
            )}
          </div>
          {/* mobile side-nav end */}
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
