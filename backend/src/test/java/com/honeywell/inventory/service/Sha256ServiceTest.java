package com.honeywell.inventory.service;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class Sha256ServiceTest {

    private final Sha256Service sha256Service = new Sha256Service();

    @Test
    void matchesKnownDigest() {
        byte[] data = "[{\"id\":\"1\"}]".getBytes(StandardCharsets.UTF_8);
        String digest = sha256Service.computeHex(data);
        assertTrue(sha256Service.matches(data, digest));
        assertFalse(sha256Service.matches(data, "deadbeef"));
    }
}
