package org.sublux.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sublux.Contest;
import org.sublux.ResponsePage;
import org.sublux.Task;
import org.sublux.auth.UserDetailsImpl;
import org.sublux.repository.ContestRepository;
import org.sublux.repository.TaskRepository;
import org.sublux.web.form.ContestCreateDTO;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Controller
@RequestMapping("/api/contest")
public class ContestController {
    private final ContestRepository contestRepository;
    private final TaskRepository taskRepository;

    public ContestController(ContestRepository contestRepository, TaskRepository taskRepository) {
        this.contestRepository = contestRepository;
        this.taskRepository = taskRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createContest(@RequestBody @Valid ContestCreateDTO contestCreateDTO,
                                                Authentication authentication) {
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
                Contest contest = new Contest();
                contest.setName(contestCreateDTO.getName());
                contest.setDescription(contestCreateDTO.getDescription());
                contest.setAuthor(user);
                Set<Task> tasks = new HashSet<>();
                taskRepository.findAllById(contestCreateDTO.getTaskIds()).forEach(tasks::add);
                contest.setTasks(tasks);
                contestRepository.save(contest);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Contest> getContest(@PathVariable Integer id) {
        Optional<Contest> contest = contestRepository.findById(id);
        return contest.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<ResponsePage<Contest>> getAllContests(
            @RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
            @RequestParam(required = false, defaultValue = "1", name = "perPage") @Min(1) @Valid Integer perPage) {
        Page<Contest> repositoryPage = contestRepository.findAll(PageRequest.of(page, perPage));
        return ResponseEntity.ok(new ResponsePage<>(repositoryPage));
    }
}
