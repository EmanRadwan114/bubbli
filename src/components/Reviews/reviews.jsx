import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Star, StarHalf, StarOff, Send } from 'lucide-react';



const ReviewSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  rating: Yup.number()
    .min(1, 'Please select a rating')
    .max(5)
    .required('Required'),
  comment: Yup.string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must be less than 500 characters')
    .required('Required'),
});

const Reviews = ({ productId }) => {
  // Dummy data - replace with real data from backend later
  const dummyReviews = [
    
  
  ];

  const [reviews, setReviews] = useState(dummyReviews);
  const [hoverRating, setHoverRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      userName: '',
      rating: 0,
      comment: ''
    },
    validationSchema: ReviewSchema,
    onSubmit: (values, { resetForm }) => {
      const newReview = {
        id: Date.now().toString(),
        userName: values.userName,
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString(),
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      };

      setReviews(prev => [newReview, ...prev]);
      resetForm();
      setHoverRating(0);
    },
  });

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const hasHalfStar = averageRating % 1 >= 0.5;

  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= rating ? (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ) : star - 0.5 <= rating ? (
              <div className="relative">
                <Star className="w-5 h-5 text-yellow-400" />
                <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute inset-0" />
              </div>
            ) : (
              <Star className="w-5 h-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-8 py-6 mt-12 light-secondary-bg dark-secondary-bg">
      <div className="group flex flex-col gap-4 justify-center items-center mb-8 cursor-pointer">
        <p className="text-4xl font-semibold  transition-colors duration-300 dark: group-hover:text-[var(--color-accent)] dark:group-hover:text-[var(--color-accent-dark)]">
          Reviews
        </p>
        <hr className="w-[5%] group-hover:w-[10%] transition-all duration-300 ease-in-out h-1  border-0 rounded  bg-[var(--color-accent)] dark:bg-[var(--color-accent-dark)]" />
      </div>
      <h3 className=" text-xl font-semibold text-gray-800 mb-6">
        Customer Reviews
      </h3>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
        {/* Reviews List */}

        <div className="flex flex-col items-center justify-center">
          {reviews.length === 0 ? (
            <p className="text-gray-500 ">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b border-gray-200 pb-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={review.avatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">
                          {review.userName}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="mt-1">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 pl-[52px]">{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
        {/* Review Form */}
        <div className="bg-white p-6 rounded-lg shadow-md  border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Write a Review
          </h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700 mb-2">
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
              <label htmlFor="comment" className="block text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
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
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
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