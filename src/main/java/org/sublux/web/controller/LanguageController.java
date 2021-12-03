package org.sublux.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sublux.ResponsePage;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.entity.Language;
import org.sublux.repository.LanguageRepository;
import org.sublux.serialization.LanguageLong;
import org.sublux.service.LanguageService;
import org.sublux.web.form.LanguageCreateDTO;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.io.IOException;
import java.util.Optional;

@Controller
@RequestMapping(path = "/api/language")
public class LanguageController {
    private final LanguageRepository languageRepository;
    private final LanguageService languageService;

    public LanguageController(LanguageRepository languageRepository, LanguageService languageService) {
        this.languageRepository = languageRepository;
        this.languageService = languageService;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<LanguageLong> getLang(@PathVariable Integer id) {
        return languageRepository.findById(id).map(LanguageLong::new).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/getDockerTar/{id}")
    public void getDockerTar(@PathVariable Integer id, HttpServletResponse response) throws IOException {
        response.setContentType("application/x-gtar");
        Optional<Language> optionalLanguage = languageRepository.findById(id);
        if (optionalLanguage.isPresent()) {
            response.setHeader("Content-Disposition", "attachment; filename=\"sublux-" + optionalLanguage.get().getName() + ".tar.xz\"");
            response.getOutputStream().write(optionalLanguage.get().getDockerTar());
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        response.flushBuffer();
    }

    @PostMapping(path = "/create")
    @ResponseBody
    public ResponseEntity<String> createLang(
            @Valid LanguageCreateDTO languageCreateDTO,
            Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                languageService.createLanguage(languageCreateDTO, user);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping(path = "/all")
    @ResponseBody
    public ResponseEntity<ResponsePage<Language>> getAllLanguages(
            @RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
            @RequestParam(required = false, defaultValue = "1", name = "perPage") @Min(1) @Valid Integer perPage) {
        Page<Language> repositoryPage = languageRepository.findAll(PageRequest.of(page, perPage));
        return ResponseEntity.ok(new ResponsePage<>(repositoryPage));
    }

    @GetMapping(path = "/search")
    @ResponseBody
    public ResponseEntity<ResponsePage<Language>> search(
            @RequestParam(name = "filter") String filter,
            @RequestParam(required = false, defaultValue = "1", name = "perPage") @Min(1) @Valid Integer perPage) {
        Page<Language> repositoryPage = languageRepository.findAllByNameContains(filter, PageRequest.of(0, perPage));
        return ResponseEntity.ok(new ResponsePage<>(repositoryPage));
    }
}
