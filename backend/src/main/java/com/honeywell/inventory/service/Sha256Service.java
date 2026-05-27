package com.honeywell.inventory.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class Sha256Service {

    public String computeHex(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public boolean matches(byte[] data, String expectedHex) {
        if (expectedHex == null || expectedHex.trim().isEmpty()) {
            return false;
        }
        String actual = computeHex(data);
        return actual.equalsIgnoreCase(expectedHex.trim());
    }
}
