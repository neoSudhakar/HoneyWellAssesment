package com.honeywell.inventory.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.honeywell.inventory.model.Movement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MovementStorageService {

    private final ObjectMapper objectMapper;
    private final Path dataFilePath;

    public MovementStorageService(
            @Value("${inventory.data-file}") String dataFileName,
            ResourceLoader resourceLoader) throws IOException {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());

        Resource classpathResource = resourceLoader.getResource("classpath:" + dataFileName);
        this.dataFilePath = Paths.get(System.getProperty("user.dir"), "data", dataFileName);

        Files.createDirectories(dataFilePath.getParent());
        if (!Files.exists(dataFilePath)) {
            try (InputStream in = classpathResource.getInputStream()) {
                Files.copy(in, dataFilePath);
            }
        }
    }

    public synchronized List<Movement> loadAll() throws IOException {
        return objectMapper.readValue(
                dataFilePath.toFile(),
                new TypeReference<List<Movement>>() {});
    }

    public synchronized void saveAll(List<Movement> movements) throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(dataFilePath.toFile(), movements);
    }

    public List<Movement> filter(
            List<Movement> movements,
            LocalDate from,
            LocalDate to,
            String type,
            String warehouse) {
        return movements.stream()
                .filter(m -> isWithinDateRange(m, from, to))
                .filter(m -> type == null || type.trim().isEmpty() || type.equalsIgnoreCase(m.getMovementType()))
                .filter(m -> warehouse == null || warehouse.trim().isEmpty()
                        || Objects.equals(warehouse, m.getWarehouse()))
                .sorted(Comparator.comparing(Movement::getTimestamp))
                .collect(Collectors.toList());
    }

    public List<String> listWarehouses(List<Movement> movements) {
        return movements.stream()
                .map(Movement::getWarehouse)
                .filter(Objects::nonNull)
                .filter(w -> !w.trim().isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private boolean isWithinDateRange(Movement movement, LocalDate from, LocalDate to) {
        LocalDate movementDate = Instant.parse(movement.getTimestamp()).atZone(ZoneOffset.UTC).toLocalDate();
        return !movementDate.isBefore(from) && !movementDate.isAfter(to);
    }
}
