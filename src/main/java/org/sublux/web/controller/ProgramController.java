package org.sublux.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.sublux.Program;
import org.sublux.repository.LanguageRepository;
import org.sublux.repository.ProgramRepository;
import org.sublux.repository.UserRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Controller
@RequestMapping(path = "/api/program")
public class ProgramController {
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;
    private final LanguageRepository languageRepository;

    public ProgramController(ProgramRepository programRepository, UserRepository userRepository, LanguageRepository languageRepository) {
        this.programRepository = programRepository;
        this.userRepository = userRepository;
        this.languageRepository = languageRepository;
    }

    @PostMapping(path = "/upload")
    @ResponseBody
    public ResponseEntity<String> uploadProgram(@RequestParam(name = "user_id") Integer userId,
                                                @RequestParam(name = "lang_id") Integer langId,
                                                @RequestParam(name = "files") MultipartFile[] files) {
        Program program = new Program();
        program.setAuthor(userRepository.findById(userId).orElse(null));
        program.setLang(languageRepository.findById(langId).orElse(null));
        ByteArrayOutputStream compressedData = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(compressedData, StandardCharsets.UTF_8);
        try {
            for (MultipartFile file : files) {
                zos.putNextEntry(new ZipEntry(file.getName()));
                zos.write(file.getBytes());
                zos.closeEntry();
            }
            zos.close();
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.toString());
        }
        program.setArchivedData(compressedData.toByteArray());
        programRepository.save(program);
        return ResponseEntity.ok(String.valueOf(files.length));
    }
}
