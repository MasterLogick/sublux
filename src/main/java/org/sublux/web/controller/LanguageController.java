package org.sublux.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.sublux.Language;
import org.sublux.repository.LanguageRepository;

import java.io.IOException;

@Controller
@RequestMapping(path = "/lang")
public class LanguageController {
    private final LanguageRepository languageRepository;

    public LanguageController(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public Language getLang(@PathVariable Integer id) {
        return languageRepository.findById(id).orElse(null);
    }

    @PostMapping(path = "/create")
    @ResponseBody
    public ResponseEntity<String> createLang(@RequestParam(name = "name") String name,
                                             @RequestParam(name = "build_script") MultipartFile buildScript,
                                             @RequestParam(name = "run_script") MultipartFile runScript) {
        Language language = new Language();
        language.setName(name);
        try {
            language.setBuildScript(buildScript.getBytes());
            language.setRunScript(runScript.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.toString());
        }
        languageRepository.save(language);
        return ResponseEntity.ok().build();
    }
}
