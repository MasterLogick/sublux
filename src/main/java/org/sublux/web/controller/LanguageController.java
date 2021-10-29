package org.sublux.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sublux.ResponsePage;
import org.sublux.entity.Language;
import org.sublux.repository.LanguageRepository;
import org.sublux.serializer.LanguageLong;
import org.sublux.web.form.LanguageCreateDTO;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.io.IOException;

@Controller
@RequestMapping(path = "/api/language")
public class LanguageController {
    private final LanguageRepository languageRepository;

    public LanguageController(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<LanguageLong> getLang(@PathVariable Integer id) {
        return languageRepository.findById(id).map(LanguageLong::new).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(path = "/create")
    @ResponseBody
    public ResponseEntity<String> createLang(@Valid LanguageCreateDTO languageCreateDTO) {
        Language language = new Language();
        language.setName(languageCreateDTO.getName());
        try {
            language.setDockerTar(languageCreateDTO.getDockerTar().getBytes());
            language.setBuildScript(languageCreateDTO.getBuildScript().getBytes());
            language.setRunScript(languageCreateDTO.getRunScript().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.toString());
        }
        languageRepository.save(language);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/all")
    @ResponseBody
    public ResponseEntity<ResponsePage<Language>> getAllLanguages(
            @RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
            @RequestParam(required = false, defaultValue = "1", name = "perPage") @Min(1) @Valid Integer perPage) {
        Page<Language> repositoryPage = languageRepository.findAll(PageRequest.of(page, perPage));
        return ResponseEntity.ok(new ResponsePage<>(repositoryPage));
    }
}
