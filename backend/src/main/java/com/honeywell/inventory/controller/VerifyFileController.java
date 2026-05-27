package com.honeywell.inventory.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.honeywell.inventory.dto.VerifyFileResponse;
import com.honeywell.inventory.model.Movement;
import com.honeywell.inventory.service.MovementStorageService;
import com.honeywell.inventory.service.Sha256Service;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VerifyFileController {

    private final Sha256Service sha256Service;
    private final MovementStorageService storageService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public VerifyFileController(Sha256Service sha256Service, MovementStorageService storageService) {
        this.sha256Service = sha256Service;
        this.storageService = storageService;
    }

    @PostMapping(value = "/verify-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VerifyFileResponse> verifyFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sha256") String sha256) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(VerifyFileResponse.failure("JSON file is required."));
        }

        byte[] bytes = file.getBytes();
        if (!sha256Service.matches(bytes, sha256)) {
            return ResponseEntity.badRequest()
                    .body(VerifyFileResponse.failure("SHA-256 digest does not match the uploaded file."));
        }

        List<Movement> movements = objectMapper.readValue(
                bytes,
                new TypeReference<List<Movement>>() {});
        storageService.saveAll(movements);

        return ResponseEntity.ok(VerifyFileResponse.success(movements));
    }
}
