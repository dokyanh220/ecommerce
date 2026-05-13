import { createLoader, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs/server";

const sortValue = ['curated', 'trending', 'hot_and_new'] as const

export const params = {
    sort: parseAsStringLiteral(sortValue).withDefault('curated'),
    minPrice: parseAsString
        .withOptions({
            clearOnDefault: true
        }),
    maxPrice: parseAsString
        .withOptions({
            clearOnDefault: true
        }),
    tags: parseAsArrayOf(parseAsString)
        .withOptions({
            clearOnDefault: true
        })
}

export const loadProductFilters = createLoader(params)