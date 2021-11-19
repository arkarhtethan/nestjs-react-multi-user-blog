import { Link } from "react-router-dom";
import { ICategory } from "../../types/post.type";

export default function CategoryItem ({ category }: { category: ICategory }) {
    return (
        <div className="bg-black text-white rounded-full text-center p-2 text-sm m-1">
            <Link to={`/category/${category.slug}`}>{category.name}</Link>
        </div>
    )
}
