import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { addReview, getReviews } from "../../services/productsService";
import Pagination from "../Pagination/Pagination";
import { Star, Send } from "lucide-react";

export default function Reviews() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", id, page],
    queryFn: () => getReviews(id, page),
  });

  const reviews = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  console.log("Fetched review data:", data);

  function handlePagination(value) {
    setPage(value);
  }

  const user = localStorage.getItem("user");

  const submitReviewSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, "Rating must be at least 1 star")
      .max(5)
      .required("Rating is required"),
    description: Yup.string()
      .min(8, "Description must be at least 8 characters")
      .required("Description is required"),
  });

  async function onSubmit(values, { setSubmitting, resetForm, setTouched }) {
    if (!user) {
      toast.error("Please log in to submit your review");
      return;
    }
    try {
      await addReview(id, {
        rating: values.rating,
        description: values.description,
      });
      toast.success("Thanks for sharing your opinion");
      setPage(1);
      if (page === 1) {
        refetch();
      }
      resetForm();
      setTouched({ rating: false, description: false });
    } catch (error) {
      toast.error(
        `${error?.response?.data?.message || "Something went wrong"}`
      );
      console.error("Response data:", error.response?.data);
    } finally {
      setSubmitting(false);
    }
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues: {
      rating: 0,
      description: "",
    },
    validationSchema: submitReviewSchema,
    onSubmit,
  });

  function renderStars(rating) {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-2 sm:px-8 sm:py-6 mt-12 light-secondary-bg dark-secondary-bg">
      <div className="group flex flex-col gap-4 justify-center items-center mb-8 cursor-pointer">
        <p className="mt-4 text-5xl font-semibold transition-colors duration-300 dark: group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent-dark)]">
          Reviews
        </p>
        <hr className="w-[25%] md:w-[15%] lg:w-[8%] md:group-hover:w-[14%] transition-all duration-300 ease-in-out h-1 border-0 rounded bg-[var(--color-accent)] dark:bg-[var(--color-accent-dark)]" />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Customer Reviews
      </h3>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
        {/* Reviews List */}
        <div className="flex flex-col items-center justify-center">
          {reviews.length === 0 ? (
            <p className="text-2xl text-gray-500 dark:text-[var(--color-accent-dark)]">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="border-b border-gray-200 p-4 sm:p-6 bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-[var(--color-primary) dark:text-[var(--color-primary-dark)]">
                          {review?.user?.name || "Anonymous"}
                        </h4>
                        <div className="mt-1">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 pl-[10px] sm:pl-[52px]">
                    {review?.description}
                  </p>
                </article>
              ))}

              <Pagination
                totalPages={totalPages}
                currentPage={page}
                handlePagination={handlePagination}
              />
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Rating */}
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
                    onClick={() => setFieldValue("rating", star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {(hoverRating || values.rating) >= star ? (
                      <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Star className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
              {touched.rating && errors.rating && (
                <div className="text-red-500 text-sm mt-1">{errors.rating}</div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 mb-2 dark:text-gray-100"
              >
                Your Review
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.description && errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {touched.description && errors.description && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.description}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md transition-colors light-secondary-btn dark-secondary-btn"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
