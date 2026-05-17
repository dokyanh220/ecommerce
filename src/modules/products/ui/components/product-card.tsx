import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { number } from "zod"

interface ProductCardProps {
    id: string
    name: string
    imageUrl?: string | null
    authorName: string
    authorImageUrl?: string | null
    reviewRating: number
    reviewCount: number
    price: number
}

export const ProductCard = ({ id, name, imageUrl, authorName, authorImageUrl, reviewCount, reviewRating, price }: ProductCardProps) => {
    return (
    <Link href={`/product/${id}`}>
        <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all border rounded-md bg-white overflow-hidden h-full flex flex-col">
            <div className="relative aspect-square">
                <Image
                    alt={name}
                    fill
                    className="object-cover"
                    src={imageUrl || '/placeholder.png'}
                />
            </div>

            <div className="border-y p-4 flex flex-col gap-3 flex-1">
                <h2 className="text-lg font-medium line-clamp-4">{name}</h2>

                {/* Todo: Redirect to shop */}
                <div className="flex items-center gap-2" onClick={() => {}}>
                    {authorImageUrl && (
                        <Image
                            alt={authorName}
                            src={authorImageUrl}
                            width={16}
                            height={16}
                            className="rounded-full border shrink-0 size-4"
                        />
                    )}

                    <p className="text-sm text-gray-700 underline font-medium">{authorName}</p>
                </div>

                {reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                        <StarIcon className="size-3 fill-amber-500"/>
                        <p className="text-sm font-medium">
                            {reviewRating} <strong>({reviewCount})</strong>
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="relative px-2 py-1 border bg-fuchsia-300 w-fit">
                    <p className="text-sm font-medium">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 1
                        }).format(Number(price))}
                    </p>
                </div>
            </div>
        </div>
    </Link>
)}

export const ProductCardSkeleton = () => {
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse"/>
    )
}