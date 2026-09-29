package com.nextvacancy.api.category;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryCatalogService catalog;

    public CategoryController(CategoryCatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public List<CategoryResponse> findActive() {
        return catalog.findActive();
    }
}
