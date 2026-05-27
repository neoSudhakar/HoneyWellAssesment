package com.honeywell.inventory.controller;

import com.honeywell.inventory.model.Movement;
import com.honeywell.inventory.service.MovementStorageService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MovementController {

    private final MovementStorageService storageService;

    public MovementController(MovementStorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/movements")
    public ResponseEntity<Map<String, Object>> getMovements(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String warehouse) throws IOException {

        if (to.isBefore(from)) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "'to' must be on or after 'from'");
            return ResponseEntity.badRequest().body(error);
        }

        List<Movement> all = storageService.loadAll();
        List<Movement> filtered = storageService.filter(all, from, to, type, warehouse);

        Map<String, Object> body = new HashMap<>();
        body.put("movements", filtered);
        body.put("warehouses", storageService.listWarehouses(all));
        return ResponseEntity.ok(body);
    }
}
