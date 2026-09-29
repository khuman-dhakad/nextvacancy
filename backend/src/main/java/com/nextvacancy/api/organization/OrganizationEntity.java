package com.nextvacancy.api.organization;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "organizations")
public class OrganizationEntity {
    @Id
    @Column(length = 128)
    private String id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "short_name", nullable = false, length = 64)
    private String shortName;

    @Column(nullable = false, length = 255)
    private String slug;

    @Column(name = "logo_url", columnDefinition = "text")
    private String logoUrl;

    @Column(columnDefinition = "text")
    private String website;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 128)
    private String state;

    @Column(name = "category_type", length = 128)
    private String categoryType;

    @Column(length = 255)
    private String headquarters;

    @Column(name = "established_year")
    private Integer establishedYear;

    @Column(nullable = false)
    private boolean verified;

    @Column(columnDefinition = "text")
    private String tagline;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "about_details", columnDefinition = "jsonb")
    private JsonNode aboutDetails;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selection_process", columnDefinition = "jsonb")
    private JsonNode selectionProcess;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_departments", columnDefinition = "jsonb")
    private JsonNode keyDepartments;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode faqs;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "job_count", nullable = false)
    private int jobCount;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public OrganizationEntity() {
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getShortName() { return shortName; }
    public String getSlug() { return slug; }
    public String getLogoUrl() { return logoUrl; }
    public String getWebsite() { return website; }
    public String getDescription() { return description; }
    public String getState() { return state; }
    public String getCategoryType() { return categoryType; }
    public String getHeadquarters() { return headquarters; }
    public Integer getEstablishedYear() { return establishedYear; }
    public boolean isVerified() { return verified; }
    public String getTagline() { return tagline; }
    public JsonNode getAboutDetails() { return aboutDetails; }
    public JsonNode getSelectionProcess() { return selectionProcess; }
    public JsonNode getKeyDepartments() { return keyDepartments; }
    public JsonNode getFaqs() { return faqs; }
    public boolean isActive() { return active; }
    public int getJobCount() { return jobCount; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setName(String name) { this.name = name; }
    public void setShortName(String shortName) { this.shortName = shortName; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public void setWebsite(String website) { this.website = website; }
    public void setDescription(String description) { this.description = description; }
    public void setState(String state) { this.state = state; }
    public void setCategoryType(String categoryType) { this.categoryType = categoryType; }
    public void setActive(boolean active) { this.active = active; }
    public void setId(String id) { this.id = id; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public void setJobCount(int jobCount) { this.jobCount = jobCount; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
