package com.nextvacancy.api.job;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class JobCatalogServiceTest {
    @Mock
    private JobRepository repository;

    @Test
    void rejectsPageSizesOutsideSupportedRange() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 101, null, null, null, null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("between 1 and 100");
    }

    @Test
    void searchesUsingBoundedPagingAndNormalizedFilters() {
        JobCatalogService service = new JobCatalogService(repository);
        org.mockito.BDDMockito.given(repository.findAll(
                        org.mockito.ArgumentMatchers.<Specification<JobEntity>>any(), any(Pageable.class)))
                .willReturn(new PageImpl<>(java.util.List.of(), PageRequest.of(1, 25), 0));

        var result = service.search(1, 25, "  clerk  ", " GOVERNMENT ", " OPEN ", "graduate", "Delhi", "title", "asc");

        assertThat(result.getNumber()).isEqualTo(1);
        assertThat(result.getSize()).isEqualTo(25);
        verify(repository).findAll(org.mockito.ArgumentMatchers.<Specification<JobEntity>>any(), eq(PageRequest.of(
                1, 25, org.springframework.data.domain.Sort.by("title").ascending())));
    }

    @Test
    void rejectsUnsupportedSortProperty() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 20, null, null, null, null, null, "password", "asc"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("sort must be one of");
    }

    @Test
    void rejectsOverlongSearchQuery() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 20, "x".repeat(129), null, null, null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at most 128 characters");
    }

    @Test
    void rejectsInvalidSortDirection() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 20, null, null, null, null, null, "createdAt", "sideways"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("direction must be asc or desc");
    }

    @Test
    void rejectsDraftStatusFromPublicSearch() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 20, null, null, "CLOSED", null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available in the public job catalog");
    }

    @Test
    void rejectsUnknownPublicStatus() {
        JobCatalogService service = new JobCatalogService(repository);

        assertThatThrownBy(() -> service.search(0, 20, null, null, "DRAFT", null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available in the public job catalog");
    }
}
