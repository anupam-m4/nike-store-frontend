import React, { useState } from "react";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel";
import RelatedProduct from "@/components/RelatedProduct";
import Wrapper from "@/components/Wrapper";
import { fetchDataFromApi } from "@/utils/api";
import { IoMdHeartEmpty } from "react-icons/io";
import { getDiscountPrice } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ReactMarkdown from "react-markdown";

const ProductDetails = ({ product, products }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();
  const p = product?.data?.[0]?.attributes;

  const notify = () => {
    toast.success("Added to Cart 🛒", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="w-full md:py-20">
      <ToastContainer />

      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[80px]">
          <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
            <ProductDetailsCarousel images={p.Image.data} />
          </div>
          <div className="flex-[1] py-4">
            <div className="text-[34px]  font-semibold mb-4 leading-tight">
              {p.name}
            </div>
            <div className="text-lg font-semibold mb-2 ">{p.subtitle} </div>

            <div className="flex items-center">
              <p className="mr-2 text-lg font-semibold">
                MRP : &#8377;{p.price}
              </p>
              {p.original_price && (
                <>
                  <p className="text-base  font-medium line-through">
                    &#8377;{p.original_price}
                  </p>
                  <p className="ml-auto text-base font-medium text-green-500">
                    {getDiscountPrice(p.original_price, p.price)}% off
                  </p>
                </>
              )}
            </div>

            <div className="text-md font-medium text-black/[0.5] ">
              incl. of taxes
            </div>
            <div className="text-md font-medium text-black/[0.5] mb-20 ">
              {`(Also includes all applicable duties)`}{" "}
            </div>
            {/* range */}
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <div className=" text-md font-semibold ">select size</div>
                <div className="text-md font-medium text-black/[0.5] cursor-pointer">
                  select guide
                </div>
              </div>
              {/* size */}
              <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                {p.size.data.map((item, i) => (
                  <div
                    key={i}
                    className={`border rounded-md text-center py-3 font-medium hover:border-black ${
                      item.enabled
                        ? "hover:border-black cursor-pointer"
                        : "cursor-not-allowed bg-black/[0.1] opacity-50"
                    } ${selectedSize === item.size ? "border-black" : ""}`}
                    onClick={() => {
                      setSelectedSize(item.size);
                      setShowError(false);
                    }}
                  >
                    {item.size}
                  </div>
                ))}
              </div>
              {/* size */}

              {/* error */}
              {showError && (
                <div className="text-red-600 mt-2">
                  Size selection is required
                </div>
              )}
              {/* error */}
            </div>
            {/* range */}

            {/* add to cart */}
            <button
              className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
              onClick={() => {
                if (!selectedSize) {
                  setShowError(true);
                  document.getElementById("sizesGrid").scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  });
                } else {
                  dispatch(
                    addToCart({
                      ...product?.data?.[0],
                      selectedSize,
                      oneQuantityPrice: p.price,
                    })
                  );
                  notify();
                }
              }}
            >
              Add to cart
            </button>
            {/* wishlist */}
            {/* <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 mb-10 hover:opacity-75">
              Add to Wishlist <IoMdHeartEmpty size={20} />
            </button> */}
            {/* details */}
            <div>
              <div className="text-lg font-bold mb-5">Product Details</div>
              <div className="text-md mb-5">
                {p?.description[0].children[0].text}
              </div>
            </div>
          </div>
        </div>
        <RelatedProduct products={products} />
      </Wrapper>
    </div>
  );
};

export default ProductDetails;

export async function getStaticPaths() {
  const products = await fetchDataFromApi("/api/products?populate=*");

  const paths = products?.data.map((p) => ({
    params: {
      slug: p.attributes.slug,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const product = await fetchDataFromApi(
    `/api/products?populate=*&filters[slug][$eq]=${slug}`
  );
  const products = await fetchDataFromApi(
    `/api/products?populate=*&[filters][slug][$ne]=${slug}`
  );

  return {
    props: {
      product,
      products,
    },
  };
}
