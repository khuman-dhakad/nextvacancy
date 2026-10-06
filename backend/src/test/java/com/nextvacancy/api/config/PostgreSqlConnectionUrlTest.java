package com.nextvacancy.api.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.junit.jupiter.api.Test;

class PostgreSqlConnectionUrlTest {
    @Test
    void convertsPostgresSchemeToJdbcAndPreservesSslQuery() {
        PostgreSqlConnectionUrl connection = PostgreSqlConnectionUrl.parse(
                "postgres://db.example.test/nextvacancy?sslmode=require");

        assertThat(connection.jdbcUrl())
                .isEqualTo("jdbc:postgresql://db.example.test/nextvacancy?sslmode=require");
        assertThat(connection.username()).isNull();
        assertThat(connection.password()).isNull();
    }

    @Test
    void convertsNeonUrlAndDecodesPercentEscapedCredentialsWithoutDroppingQueryOptions() {
        PostgreSqlConnectionUrl connection = PostgreSqlConnectionUrl.parse(
                "postgresql://user%2Bname:p%40ss%3Aword@ep-example.neon.tech/app?sslmode=require&channel_binding=require");

        assertThat(connection.jdbcUrl())
                .isEqualTo("jdbc:postgresql://ep-example.neon.tech/app?sslmode=require&channel_binding=require");
        assertThat(connection.username()).isEqualTo("user+name");
        assertThat(connection.password()).isEqualTo("p@ss:word");
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

    @Test
    void doesNotIncludeMalformedDatabaseUrlInParserError() {
        Throwable failure = catchThrowable(
                () -> PostgreSqlConnectionUrl.parse("postgresql://user:%zz@db.example/app"));

        assertThat(failure)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("DATABASE_URL is not a valid PostgreSQL URL");
        assertThat(failure.getCause()).isNull();
    }
}
