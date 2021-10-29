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
import org.sublux.entity.Task;
import org.sublux.entity.Test;
import org.sublux.repository.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

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
    public ResponseEntity createTask(@RequestParam(name = "name") String name,
                                     @RequestParam(name = "description", required = false, defaultValue = "") String description,
                                     @RequestParam(name = "lang_ids") Integer[] langIds,
                                     @RequestParam(name = "validator_id") Long validatorId,
                                     @RequestParam(name = "solution_ id", required = false, defaultValue = "-1") Long solutionId,
                                     @RequestParam(name = "test_ids") Long[] testIds,
                                     @RequestParam(name = "authorId") Integer authorId) {
        Task task = new Task();
        task.setName(name);
        task.setDescription(description);
        Set<Language> languages = new HashSet<>();
        languageRepository.findAllById(Arrays.asList(langIds)).forEach(languages::add);
        task.setAllowedLanguages(languages);
        task.setInputValidator(programRepository.findById(validatorId).orElse(null));
        task.setSolution(programRepository.findById(solutionId).orElse(null));
        Set<Test> tests = new HashSet<>();
        testRepository.findAllById(Arrays.asList(testIds)).forEach(tests::add);
        task.setTests(tests);
        task.setAuthor(userRepository.findById(authorId).orElse(null));
        taskRepository.save(task);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getMy")
    @ResponseBody
    public ResponseEntity<ResponsePage<Task>> listMyTasks(@RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
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
