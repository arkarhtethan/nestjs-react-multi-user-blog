import { useState } from "react";
import { useQuery } from "react-query"
import { categoryList } from "../../service/post.service"
import { ErrorMessage } from "../../shared/error/formError";
import { Spinner } from "../../shared/loader";
import { ICategory } from "../../types/post.type";
import CategoryItem from "./categoryItem";

export default function Categories () {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const { isError, isLoading } = useQuery(['categories'], categoryList, {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        onSuccess: (response) => {
            if (response.ok) {
                setCategories(response.categories)
            }
        }
    })
    const buidLoading = () => {
        return <div className="w-full flex items-center justify-center py-44">
            <Spinner color={"#000"} height={40} />
        </div>
    }

    const buidError = () => {
        return <div className="w-full flex items-center justify-center py-44">
            <ErrorMessage message="Something went wrong." classes="text-xl" />
        </div>
    }

    if (isLoading) {
        return buidLoading();
    }

    if (isError) {
        return buidError()
    }

    return (
        <div className="shadow-lg bg-white py-4 px-4">
            <h3 className="mb-4 font-bold border-b-2 border-black">Categories</h3>
            <div className="flex flex-wrap">
                {categories.map(category => {
                    return <CategoryItem key={category.slug} category={category} />
                })}
            </div>
        </div>
    )
}
