package com.nextvacancy.api.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

import org.junit.jupiter.api.Test;

class PostgreSqlConnectionUrlTest {
    @Test
    void convertsRenderPostgresUrlAndExtractsEnvironmentProvidedCredentials() {
        PostgreSqlConnectionUrl connection = PostgreSqlConnectionUrl.parse(
                "postgres://render_user:render_password@dpg-example-a/nextvacancy?sslmode=require");

        assertThat(connection.jdbcUrl())
                .isEqualTo("jdbc:postgresql://dpg-example-a/nextvacancy?sslmode=require");
        assertThat(connection.username()).isEqualTo("render_user");
        assertThat(connection.password()).isEqualTo("render_password");
    }

    @Test
    void leavesJdbcUrlUnchangedAndDoesNotParseCredentialsFromIt() {
        PostgreSqlConnectionUrl connection = PostgreSqlConnectionUrl.parse(
                "jdbc:postgresql://db.example.test/nextvacancy");

        assertThat(connection.jdbcUrl()).isEqualTo("jdbc:postgresql://db.example.test/nextvacancy");
        assertThat(connection.username()).isNull();
        assertThat(connection.password()).isNull();
    }

    @Test
    void rejectsNonPostgreSqlUrlsWithoutEchoingThem() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> PostgreSqlConnectionUrl.parse("mysql://user:secret@host/database"))
                .withMessage("DATABASE_URL must use PostgreSQL");
    }
}
