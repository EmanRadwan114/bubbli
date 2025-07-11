import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 my-20">
      <h4 className="text-primary text-4xl font-bold">Oh no!</h4>
      <p className="text-lg">Error 404: Page Not Found.</p>
      <img
        src="https://img.freepik.com/premium-vector/cute-gift-box-character-confused_161751-2343.jpg?uid=R122390214&ga=GA1.1.1139909252.1747612214&semt=ais_hybrid&w=740"
        className="rounded-full w-1/5"
      />
      <Link to={"/"}>
        <button className="light-primary-btn dark-primary-btn p-2 rounded-lg">Back to Home</button>
      </Link>
    </div>
  );
}
