package com.nextvacancy.api.category;

public record CategoryResponse(
        String id,
        String name,
        String slug,
        String description,
        String icon,
        boolean isActive,
        boolean isFeatured,
        int jobCount) {
    public static CategoryResponse from(CategoryEntity category) {
        return new CategoryResponse(
                category.getId(), category.getName(), category.getSlug(), category.getDescription(),
                category.getIcon(), category.isActive(), category.isFeatured(), category.getJobCount());
    }
}
