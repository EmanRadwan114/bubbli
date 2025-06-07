import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { toast } from "react-toastify";
import { useAllWishlist } from "../../hooks/useWishlist";

const products = [
  {
    thumbnail:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Personalized Wooden Box",
    description:
      "Handcrafted wooden keepsake box with custom engraving Handcrafted wooden keepsake box with custom engraving box with custom engraving",
    price: 30,
    discount: 10,
    rating: 4.5,
    totalReviews: 10,
    label: ["bestseller", "new", "limited", "hot", "deal"],
    _id: 1,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Personalized Wooden Box",
    description:
      "Handcrafted wooden keepsake box with custom engraving Handcrafted wooden keepsake box with custom engraving box with custom engraving",
    price: 30,
    discount: 10,
    rating: 4.5,
    totalReviews: 10,
    label: ["bestseller", "new", "limited", "hot", "deal"],
    _id: 2,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Personalized Wooden Box",
    description:
      "Handcrafted wooden keepsake box with custom engraving Handcrafted wooden keepsake box with custom engraving box with custom engraving",
    price: 30,
    discount: 10,
    rating: 4.5,
    totalReviews: 10,
    label: ["bestseller", "new", "limited", "hot", "deal"],
    _id: 3,
  },
];
export default function Products() {
  // const { data, isLoading, isError, error } = useAllWishlist();
  const [wishlistArr, setWishlistArr] = useState([]);

  const onAddToCart = () => {
    toast.success("Product is added to Wishlist");
  };

  const onAddToWishlist = (id) => {
    if (wishlistArr.includes(id)) {
      setWishlistArr([...wishlistArr.filter((item) => item !== id)]);
      toast.success("Product is removed from Wishlist");
    } else {
      setWishlistArr([...wishlistArr, id]);
      toast.success("Product is added to Wishlist");
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        {products.map((product, indx) => (
          <div className="w-full md:w-6/12 lg:w-4/12 p-2" key={indx}>
            <ProductCard
              product={product}
              onAddToWishlist={onAddToWishlist}
              onAddToCart={onAddToCart}
              wishlistArr={wishlistArr}
            />
          </div>
        ))}
      </div>
    </>
  );
}
