package com.nextvacancy.api.config;

import java.net.URI;
import java.net.URISyntaxException;

record PostgreSqlConnectionUrl(String jdbcUrl, String username, String password) {
    static PostgreSqlConnectionUrl parse(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("DATABASE_URL must not be blank");
        }
        if (value.startsWith("jdbc:postgresql:")) {
            return new PostgreSqlConnectionUrl(value, null, null);
        }

        try {
            URI uri = new URI(value);
            String scheme = uri.getScheme();
            if (!"postgres".equals(scheme) && !"postgresql".equals(scheme)) {
                throw new IllegalArgumentException("DATABASE_URL must use PostgreSQL");
            }
            if (uri.getHost() == null || uri.getRawPath() == null || uri.getRawPath().equals("/")) {
                throw new IllegalArgumentException("DATABASE_URL must include a PostgreSQL host and database");
            }
            if (uri.getRawFragment() != null) {
                throw new IllegalArgumentException("DATABASE_URL must not contain a fragment");
            }

            String authority = uri.getRawAuthority();
            int userInfoEnd = authority.lastIndexOf('@');
            String hostAndPort = userInfoEnd >= 0 ? authority.substring(userInfoEnd + 1) : authority;
            StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                    .append(hostAndPort)
                    .append(uri.getRawPath());
            if (uri.getRawQuery() != null) {
                jdbcUrl.append('?').append(uri.getRawQuery());
            }

            String username = null;
            String password = null;
            String userInfo = uri.getUserInfo();
            if (userInfo != null) {
                int separator = userInfo.indexOf(':');
                username = separator >= 0 ? userInfo.substring(0, separator) : userInfo;
                password = separator >= 0 ? userInfo.substring(separator + 1) : null;
            }
            return new PostgreSqlConnectionUrl(jdbcUrl.toString(), username, password);
        } catch (URISyntaxException exception) {
            throw new IllegalArgumentException("DATABASE_URL is not a valid PostgreSQL URL", exception);
        }
    }
}
