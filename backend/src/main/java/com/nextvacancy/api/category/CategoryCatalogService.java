package com.nextvacancy.api.category;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CategoryCatalogService {
    private final CategoryRepository repository;

    public CategoryCatalogService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<CategoryResponse> findActive() {
        return repository.findAllByActiveTrueOrderByJobCountDesc().stream()
                .map(CategoryResponse::from)
                .toList();
    }
}
