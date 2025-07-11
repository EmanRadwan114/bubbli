import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import emptyCartImage from "../../assets/p1.jpg";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { data, page, setPage, isLoading, handleCartRemoval, handleQuantity } = useCart();

  if (isLoading) return <div className="text-center p-10 text-primary">Loading...</div>;

  return (
    <>
      {data?.data?.length > 0 ? (
        <div className="cart-container light-main-bg dark-main-bg">
          <div className="cart-left">
            <div className="cart-header">
              <h2 className="text-xl font-bold text-primary dark:text-primary-dark">Shopping Cart</h2>
              <button className="light-primary-btn dark-primary-btn px-3 py-1 rounded">Clear Cart</button>
            </div>

            <div className="cart-items">
              {data.data.map((item) => (
                <div className="cart-item light-secondary-bg dark-secondary-bg dark-shadow" key={item._id}>
                  <img src={item.productId.thumbnail} alt={item.productId.title} className="cart-img" />
                  <div className="cart-details">
                    <button className="remove-btn" onClick={() => handleCartRemoval(item.productId._id)}>X</button>
                    <div className="item-info">
                      <h3 className="font-semibold text-primary dark:text-primary-dark">{item.productId.title}</h3>
                      <div className="qty-controls">
                        <button onClick={() => handleQuantity(item.productId._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantity(item.productId._id, item.quantity + 1)}>+</button>
                      </div>
                      <p className="text-dark dark:text-light">EGP {item.productId.price}.00</p>
                      <strong className="text-primary dark:text-accent-dark">
                        Total: EGP {item.productId.price * item.quantity}.00
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              {[...Array(data.totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 border ${page === i + 1 ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="cart-summary light-secondary-bg dark-secondary-bg dark-shadow">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>EGP {data.subtotal}.00</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>EGP 50.00</span>
            </div>
            <hr />
            <div className="summary-line total">
              <span>Total:</span>
              <span>EGP {data.subtotal + 50}.00</span>
            </div>
            <button className="light-primary-btn dark-primary-btn mt-4 w-full py-2 rounded" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart text-center">
          <img src={emptyCartImage} alt="Empty Cart" />
          <h2 className="text-primary dark:text-primary-dark text-xl my-4">Oops! Your cart is lonely. Let’s fix that!</h2>
          <button className="light-primary-btn dark-primary-btn py-2 px-4 rounded" onClick={() => navigate("/")}>
            Start Adding!
          </button>
        </div>
      )}
    </>
  );
}
