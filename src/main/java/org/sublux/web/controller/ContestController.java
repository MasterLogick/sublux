package org.sublux.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.sublux.Contest;
import org.sublux.ResponsePage;
import org.sublux.Task;
import org.sublux.repository.ContestRepository;
import org.sublux.repository.TaskRepository;
import org.sublux.repository.UserRepository;
import org.sublux.web.form.ContestCreateDTO;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.ArrayList;

@Controller
public class ContestController {
    private final ContestRepository contestRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ContestController(ContestRepository contestRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.contestRepository = contestRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/contest/create")
    public String getCreateContestForm(Model model) {
        model.addAttribute("contestCreateDTO", new ContestCreateDTO());
        return "contest_form";
    }

    @PostMapping("/api/contest/create")
    public ResponseEntity<Object> createContest(@ModelAttribute("contestCreateDTO") @Valid ContestCreateDTO contestCreateDTO) {
        Contest contest = new Contest();
        contest.setName(contestCreateDTO.getName());
        contest.setDescription(contestCreateDTO.getDescription());
        contest.setAuthor(userRepository.findById(1).orElse(null));
        ArrayList<Task> tasks = new ArrayList<>();
        taskRepository.findAllById(contestCreateDTO.getTaskIds()).forEach(tasks::add);
        contest.setTasks(tasks);
        contestRepository.save(contest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/contest/{id}")
    @ResponseBody
    public Contest getContest(@PathVariable Integer id) {
        return contestRepository.findById(id).orElse(null);
    }

    @GetMapping("/api/contest/all")
    @ResponseBody
    public ResponseEntity<ResponsePage<Contest>> getAllContests(
            @RequestParam(required = false, defaultValue = "0", name = "page") @Min(0) @Valid Integer page,
            @RequestParam(required = false, defaultValue = "0", name = "perPage") @Valid @Min(1) Integer perPage) {
        Page<Contest> repositoryPage = contestRepository.findAll(PageRequest.of(page, perPage));
        return ResponseEntity.ok(new ResponsePage<>(repositoryPage.iterator(), repositoryPage.getTotalPages(),
                repositoryPage.getTotalElements(), repositoryPage.getSize()));
    }
}
