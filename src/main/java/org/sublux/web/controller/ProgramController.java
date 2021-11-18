package org.sublux.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.entity.Language;
import org.sublux.entity.Program;
import org.sublux.entity.Task;
import org.sublux.isolation.IsolationManager;
import org.sublux.repository.LanguageRepository;
import org.sublux.repository.TaskRepository;
import org.sublux.web.form.SolutionUploadDTO;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

@Controller
@RequestMapping(path = "/api/solution")
public class ProgramController {
    private final TaskRepository taskRepository;
    private final LanguageRepository languageRepository;
    private final IsolationManager isolationManager;

    public ProgramController(TaskRepository taskRepository, LanguageRepository languageRepository, IsolationManager isolationManager) {
        this.taskRepository = taskRepository;
        this.languageRepository = languageRepository;
        this.isolationManager = isolationManager;
    }

    @PostMapping(path = "/upload")
    @ResponseBody
    public ResponseEntity uploadSolution(@RequestBody @Valid SolutionUploadDTO solutionUploadDTO,
                                         BindingResult bindingResult,
                                         Authentication authentication) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                Program solution = new Program();
                Optional<Language> languageOptional = languageRepository.findById(solutionUploadDTO.getSolution().getLanguage());
                if (languageOptional.isPresent()) {
                    solution.setLang(languageOptional.get());
                    solution.setAuthor(user);
                    try {
                        solution.setArchivedData(solutionUploadDTO.getSolution());
                    } catch (IOException e) {
                        bindingResult.addError(new ObjectError("solution", "Can not get solution files"));
                        throw new BindException(bindingResult);
                    }
                    Optional<Task> taskOptional = taskRepository.findById(solutionUploadDTO.getTaskId());
                    if (taskOptional.isPresent()) {
                        Task task = taskOptional.get();
                        boolean allowed = task.getAllowedLanguages().stream().anyMatch(l -> Objects.equals(l.getId(), solution.getLang().getId()));
                        if (allowed) {
                            task.startSolutionEvaluation(isolationManager, solution);
                            return ResponseEntity.ok().build();
                        } else {
                            bindingResult.addError(new ObjectError("solution", "Solution language is disallowed for this task"));
                            throw new BindException(bindingResult);
                        }
                    } else {
                        bindingResult.addError(new ObjectError("taskId", "No task found"));
                        throw new BindException(bindingResult);
                    }
                } else {
                    bindingResult.addError(new ObjectError("solution", "No such language found"));
                    throw new BindException(bindingResult);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
