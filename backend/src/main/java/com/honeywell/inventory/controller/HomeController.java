package com.honeywell.inventory.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("application", "Inventory Movement API");
        info.put("status", "running");
        info.put("frontend", "http://localhost:5173");
        info.put("endpoints", new String[]{
                "GET  /api/movements?from=YYYY-MM-DD&to=YYYY-MM-DD&type=IN|OUT&warehouse=WH-NORTH",
                "POST /api/verify-file  (multipart: file, sha256)"
        });
        return info;
    }
}
