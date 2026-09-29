package com.nextvacancy.api.category;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class CategoryEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 255)
    private String slug;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 128)
    private String icon;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "is_featured", nullable = false)
    private boolean featured;

    @Column(name = "job_count", nullable = false)
    private int jobCount;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public CategoryEntity() {
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public boolean isActive() { return active; }
    public boolean isFeatured() { return featured; }
    public int getJobCount() { return jobCount; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setDescription(String description) { this.description = description; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setActive(boolean active) { this.active = active; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public void setId(String id) { this.id = id; }
    public void setJobCount(int jobCount) { this.jobCount = jobCount; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
