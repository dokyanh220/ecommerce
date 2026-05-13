import { useInfiniteQuery } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { DEFAULT_TAGS_LIMIT } from "~/constants"
import { useTRPC } from "~/trpc/client"

interface TagsFilterProps {
    value?: string[] | null
    onChange: (value: string[]) => void
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
    const trpc = useTRPC()
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_TAGS_LIMIT
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
            }
        }
    ))

    const onClick = (tag: string) => {
        if (value?.includes(tag)) {
            onChange(value?.filter((t) => t !== tag) || [])
        } else {
            onChange([...(value || []), tag])
        }
    }

    return (
        <div className="flex flex-col gap-y-2">
            {isLoading
                ? (<div className="flex items-center justify-center p-4">
                    <LoaderIcon className="size-4 animate-spin" />
                </div>) : (
                    data?.pages.map((page) => page.docs.map((tag) => {
                        const isChecked = value?.includes(tag.id) ?? false

                        return (
                        <div
                            key={tag.id}
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => onClick(tag.id)}
                        >
                            <p className="font-medium">{tag.name}</p>
                            <Checkbox
                                checked={isChecked}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={() => onClick(tag.id)}
                            />
                        </div>
                    )}))
                )}

            {hasNextPage && (
                <Button
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="bg-transparent text-black hover:bg-transparent cursor-pointer underline font-medium justify-center text-start disable:opacity-50"
                >
                    Load more
                </Button>
            )}
        </div>
    )
}
