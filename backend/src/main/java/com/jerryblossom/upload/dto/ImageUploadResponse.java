package com.jerryblossom.upload.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ImageUploadResponse {
    private final String imageUrl;
}
