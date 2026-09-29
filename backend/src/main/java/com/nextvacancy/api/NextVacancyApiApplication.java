package com.nextvacancy.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NextVacancyApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(NextVacancyApiApplication.class, args);
    }
}
