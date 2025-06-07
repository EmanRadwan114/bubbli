import { useNavigate } from "react-router";
import { useCategories } from "../../hooks/useCategories";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function CategoryCard() {
  const { data: categories, isLoading, error } = useCategories();
  const navigate = useNavigate();
  if (isLoading) return <LoadingSpinner />;
  if (error) return toast.error("Error loading categories");
  return (
    <>
      <div className="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-4">
        {categories?.map((category) => (
          <div
            key={category._id}
            onClick={() => navigate(`/gifts/${category.name}`)}
            className="flex flex-col items-center justify-center gap-4 mb-4 sm:mb-0 cursor-pointer"
          >
            <div className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <img src={category.thumbnail} alt="category" className="w-full h-full object-cover" />
            </div>
            <h6 className="text-primary font-bold font-[Playpen Sans Hebrew] text-lg">{category.name}</h6>
          </div>
        ))}
      </div>
    </>
  );
}
