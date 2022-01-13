import { useState } from "react";
import { useQuery } from "react-query";
import CategoryItem from "../components/post/CategoryItem";
import { categoryListService } from "../service/post.service";
import { ICategory } from "../types/post.type";

interface INotFound {
    title: string;
    message: string;
}
export default function NotFound ({ message, title }: INotFound) {

    const [categories, setCategories] = useState<ICategory[]>([]);

    useQuery(['categories'], categoryListService, {
        refetchOnWindowFocus: false,
        onSuccess: (response) => {
            setCategories(response.categories)
        }
    });

    return <div className="my-28 w-1/3 mx-auto text-center space-y-3">
        <p className="text-3xl font-bold">{title}</p>
        <p className="">{message}</p>
        <div className="flex border-2 border-gray-500 justify-center items-center mt-5 flex-wrap p-4 lg:space-x-4 space-x-0 lg:space-y-0 space-y-2">
            {categories && categories.map(category => <CategoryItem key={category.id} category={category} />)}
        </div>
    </div>
}
