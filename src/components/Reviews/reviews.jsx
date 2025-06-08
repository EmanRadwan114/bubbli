import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Star, StarHalf, StarOff, Send } from "lucide-react";
import Pagination from "../Pagination/Pagination";


const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
    .min(1, "Please select a rating")
    .max(5)
    .required("Required"),
    comment: Yup.string()
    .min(4, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters")
    .required("Required"),
});

const Reviews = ({ productId }) => {
  const dummyReviews = [
    // {
    //   id: "1",
    //   userName: "Amina Hassan",
    //   rating: 5,
    //   comment:
    //     "Absolutely loved it! Quality is top-notch and delivery was fast.",
    // },
    // {
    //   id: "2",
    //   userName: "Mohamed Tarek",
    //   rating: 4,
    //   comment: "Good product overall. Could be a bit cheaper.",
    // },
  ];

  const [reviews, setReviews] = useState(dummyReviews);
  const [hoverRating, setHoverRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      userName: "",
      rating: 0,
      comment: "",
    },
    validationSchema: ReviewSchema,
    onSubmit: (values, { resetForm }) => {
      const newReview = {
        id: Date.now().toString(),
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString(),
        avatar: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 100)}.jpg`,
      };

      setReviews((prev) => [newReview, ...prev]);
      resetForm();
      setHoverRating(0);
    },
  });

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const hasHalfStar = averageRating % 1 >= 0.5;

  function handlePagination(newPage) {
    setPage(newPage);
  }

  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= rating ? (
              <Star className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
            ) : star - 0.5 <= rating ? (
              <div className="relative">
                <Star className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
                <StarHalf className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 absolute inset-0" />
              </div>
            ) : (
              <Star className="w-3 h-3 sm:w-5 sm:h-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

// //   test dark mode
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", "dark");
//   }, []);
  
  return (
    <div className="px-4 py-2 sm:px-8 sm:py-6 mt-12 light-secondary-bg dark-secondary-bg">
      <div className="group flex flex-col gap-4 justify-center items-center mb-8 cursor-pointer">
        <p className="mt-4 text-5xl font-semibold  transition-colors duration-300 dark: group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent-dark)]">
          Reviews
        </p>
        <hr className="w-[25%] md:w-[15%] lg:w-[8%] md:group-hover:w-[14%] transition-all duration-300 ease-in-out h-1  border-0 rounded  bg-[var(--color-accent)] dark:bg-[var(--color-accent-dark)]" />
      </div>
      <h3 className=" text-xl font-semibold text-gray-800 dark:text-gray-100 ">
        Customer Reviews
      </h3>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
        {/* Reviews List */}

        <div className="flex flex-col items-center justify-center">
          {reviews.length === 0 ? (
            <p className="text-2xl text-gray-500 dark:text-[var(--color-accent-dark)] ">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b  border-gray-200 p-4 sm:p-6 bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-[var(--color-primary) dark:text-[var(--color-primary-dark)]">
                          {review.userName}
                        </h4>
                        <div className="mt-1">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 pl-[10px] sm:pl-[52px]">
                    {review.comment}
                  </p>
                </article>
              ))}
              <Pagination
                totalPages={3}
                currentPage={2}
                handlePagination={handlePagination}
              />
            </div>
          )}
        </div>
        {/* Review Form */}
        <div className="bg-white p-6 rounded-lg shadow-md  border border-gray-200 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">
            Write a Review
          </h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-gray-700 mb-2 dark:text-gray-300"
              >
                Your Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => formik.setFieldValue("rating", star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {(hoverRating || formik.values.rating) >= star ? (
                      <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Star className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
              {formik.touched.rating && formik.errors.rating ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.rating}
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-gray-700 mb-2 dark:text-gray-100"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.comment}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formik.touched.comment && formik.errors.comment
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {formik.touched.comment && formik.errors.comment ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.comment}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center justify-center gap-2  text-white px-4 py-2 rounded-md  transition-colors light-secondary-btn dark-secondary-btn "
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
