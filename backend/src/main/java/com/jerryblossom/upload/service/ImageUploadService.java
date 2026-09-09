package com.jerryblossom.upload.service;

import com.jerryblossom.upload.dto.ImageUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageUploadService {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp"
    );

    private final Path uploadRoot;

    public ImageUploadService(
            @Value("${app.upload.directory:uploads}") String uploadDirectory
    ) {
        this.uploadRoot = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    public ImageUploadResponse uploadItemImage(MultipartFile image) {
        validate(image);

        try {
            Path itemDirectory = uploadRoot.resolve("items");
            Files.createDirectories(itemDirectory);

            String extension = ALLOWED_CONTENT_TYPES.get(image.getContentType());
            String savedFileName = UUID.randomUUID() + "." + extension;
            Path destination = itemDirectory.resolve(savedFileName);

            image.transferTo(destination);

            return new ImageUploadResponse("/uploads/items/" + savedFileName);
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "이미지 저장 중 오류가 발생했습니다."
            );
        }
    }

    private void validate(MultipartFile image) {
        if (image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일을 선택해주세요."
            );
        }

        if (image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일은 5MB 이하여야 합니다."
            );
        }

        if (!ALLOWED_CONTENT_TYPES.containsKey(image.getContentType())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다."
            );
        }
    }
}
