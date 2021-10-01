package org.sublux.controller;

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
    public ApiResponse createLang(@RequestParam(name = "name") String name,
                                  @RequestParam(name = "build_script") MultipartFile buildScript,
                                  @RequestParam(name = "run_script") MultipartFile runScript) {
        Language language = new Language();
        language.setName(name);
        try {
            language.setBuildScript(buildScript.getBytes());
            language.setRunScript(runScript.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ApiResponse(1, e.toString());
        }
        languageRepository.save(language);
        return ApiResponse.OK;
    }
}
