package org.sublux.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.sublux.ResponsePage;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.entity.*;
import org.sublux.repository.*;
import org.sublux.test.InputOutputType;
import org.sublux.web.form.TaskCreateDTO;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/task")
public class TaskController {
    private final TaskRepository taskRepository;
    private final LanguageRepository languageRepository;
    private final ProgramRepository programRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, LanguageRepository languageRepository, ProgramRepository programRepository, TestRepository testRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.languageRepository = languageRepository;
        this.programRepository = programRepository;
        this.testRepository = testRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public Task getTask(@PathVariable Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @PostMapping(path = "/create")
    @ResponseBody
    public ResponseEntity createTask(@RequestBody @Valid TaskCreateDTO taskCreateDTO,
                                     BindingResult bindingResult,
                                     Authentication authentication) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                Task task = new Task();
                task.setName(taskCreateDTO.getName());
                task.setDescription(taskCreateDTO.getDescription());
                task.setAuthor(user);
                HashSet<Language> languages = new HashSet<>();
                for (Language language : languageRepository.findAllById(taskCreateDTO.getAllowedLanguages())) {
                    languages.add(language);
                }
                if (languages.size() != taskCreateDTO.getAllowedLanguages().size()) {
                    bindingResult.addError(new ObjectError("allowedLanguages", "Unknown languages"));
                    throw new BindException(bindingResult);
                }
                task.setAllowedLanguages(languages);
                Program validator = new Program();
                validator.setAuthor(user);
                Optional<Language> validatorLanguage = languageRepository.findById(taskCreateDTO.getValidator().getLanguage());
                if (validatorLanguage.isPresent()) {
                    validator.setLang(validatorLanguage.get());
                } else {
                    bindingResult.addError(new ObjectError("validator", "Invalid language"));
                    throw new BindException(bindingResult);
                }
                try {
                    validator.setArchivedData(taskCreateDTO.getValidator());
                } catch (IOException e) {
                    bindingResult.addError(new ObjectError("validator", e.getMessage()));
                    throw new BindException(bindingResult);
                }
                task.setInputValidator(validator);
                Program solution = new Program();
                solution.setAuthor(user);
                Optional<Language> solutionLanguage = languageRepository.findById(taskCreateDTO.getSolution().getLanguage());
                if (solutionLanguage.isPresent()) {
                    solution.setLang(solutionLanguage.get());
                } else {
                    bindingResult.addError(new ObjectError("solution", "Invalid language"));
                    throw new BindException(bindingResult);
                }
                try {
                    solution.setArchivedData(taskCreateDTO.getSolution());
                } catch (IOException e) {
                    bindingResult.addError(new ObjectError("solution", e.getMessage()));
                    throw new BindException(bindingResult);
                }
                task.setSolution(solution);
                task.setTestClusters(
                        taskCreateDTO.getTests().stream().map((cluster -> {
                            TestCluster c = new TestCluster();
                            c.setName(cluster.getName());
                            c.setTask(task);
                            c.setTests(
                                    cluster.getTests().stream().map(test -> {
                                        Test t = new Test();
                                        t.setInput(test.getInput());
                                        t.setOutput(test.getOutput());
                                        t.setPoints(test.getPoints());
                                        t.setInputProviderType(InputOutputType.PLAIN_TEXT);
                                        t.setOutputConsumerTypeId(InputOutputType.PLAIN_TEXT);
                                        t.setTestCluster(c);
                                        return t;
                                    }).collect(Collectors.toSet()));
                            return c;
                        })).collect(Collectors.toSet()));
                taskRepository.save(task);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/getMy")
    @ResponseBody
    public ResponseEntity<ResponsePage<Task>> getMyTasks(@RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
                                                         @RequestParam(required = false, defaultValue = "1", name = "perPage") @Min(1) @Valid Integer perPage,
                                                         Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                Page<Task> taskPage = taskRepository.findAllByAuthor(user, PageRequest.of(page, perPage));
                return ResponseEntity.ok(new ResponsePage<>(taskPage));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
