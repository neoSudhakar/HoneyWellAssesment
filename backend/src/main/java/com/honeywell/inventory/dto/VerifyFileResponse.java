package com.honeywell.inventory.dto;

import com.honeywell.inventory.model.Movement;

import java.util.List;

public class VerifyFileResponse {

    private boolean valid;
    private String message;
    private List<Movement> movements;

    public VerifyFileResponse() {
    }

    public VerifyFileResponse(boolean valid, String message, List<Movement> movements) {
        this.valid = valid;
        this.message = message;
        this.movements = movements;
    }

    public static VerifyFileResponse success(List<Movement> movements) {
        return new VerifyFileResponse(true, "SHA-256 verification succeeded.", movements);
    }

    public static VerifyFileResponse failure(String message) {
        return new VerifyFileResponse(false, message, null);
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Movement> getMovements() {
        return movements;
    }

    public void setMovements(List<Movement> movements) {
        this.movements = movements;
    }
}
