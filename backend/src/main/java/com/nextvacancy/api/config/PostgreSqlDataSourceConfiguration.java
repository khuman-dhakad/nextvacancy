package com.nextvacancy.api.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

@Configuration(proxyBeanMethods = false)
public class PostgreSqlDataSourceConfiguration {
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    HikariDataSource dataSource(DataSourceProperties properties) {
        PostgreSqlConnectionUrl connection = PostgreSqlConnectionUrl.parse(properties.getUrl());
        HikariDataSource dataSource = properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();

        dataSource.setJdbcUrl(connection.jdbcUrl());
        if (!StringUtils.hasText(properties.getUsername())) {
            dataSource.setUsername(connection.username());
        }
        if (!StringUtils.hasText(properties.getPassword())) {
            dataSource.setPassword(connection.password());
        }
        return dataSource;
    }
}
