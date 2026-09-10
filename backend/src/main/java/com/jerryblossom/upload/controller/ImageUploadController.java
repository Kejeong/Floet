package com.jerryblossom.upload.controller;

import com.jerryblossom.upload.dto.ImageUploadResponse;
import com.jerryblossom.upload.service.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/uploads")
@Tag(name="이미지 업로드")
public class ImageUploadController {
    private final ImageUploadService imageUploadService;

    @PostMapping(value = "/items", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "이미지 업로드")
    public ImageUploadResponse uploadItemImage(@RequestParam("image") MultipartFile image) {
        return imageUploadService.uploadItemImage(image);
    }
}