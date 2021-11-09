package org.sublux.service;

import org.springframework.stereotype.Service;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.entity.Language;
import org.sublux.isolation.DockerTasksThreadPool;
import org.sublux.isolation.IsolationManager;
import org.sublux.repository.LanguageRepository;
import org.sublux.web.form.LanguageCreateDTO;

import java.io.IOException;

@Service
public class LanguageService {
    private final IsolationManager isolationManager;
    private final LanguageRepository languageRepository;
    private final DockerTasksThreadPool dockerTasksThreadPool;

    public LanguageService(IsolationManager isolationManager, LanguageRepository languageRepository, DockerTasksThreadPool dockerTasksThreadPool) {
        this.isolationManager = isolationManager;
        this.languageRepository = languageRepository;
        this.dockerTasksThreadPool = dockerTasksThreadPool;
    }

    public void createLanguage(LanguageCreateDTO languageCreateDTO, UserDetailsImpl user) {
        Language language = new Language();
        language.setName(languageCreateDTO.getName());
        language.setAuthor(user);
        try {
            language.setDockerTar(languageCreateDTO.getDockerTar().getBytes());
            language.setBuildScript(languageCreateDTO.getBuildScript().getBytes());
            language.setRunScript(languageCreateDTO.getRunScript().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        dockerTasksThreadPool.execute(() -> {
           /* LanguageImage image = null;
            try {
                image = isolationManager.createLanguageImage(language);
            } catch (IOException | DockerException e) {
                e.printStackTrace();
            }
            language.setLanguageImage(image);*/
            languageRepository.save(language);
        });
    }
}
