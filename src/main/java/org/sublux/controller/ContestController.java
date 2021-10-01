package org.sublux.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.sublux.Contest;
import org.sublux.ResponsePage;
import org.sublux.Task;
import org.sublux.form.ContestForm;
import org.sublux.repository.ContestRepository;
import org.sublux.repository.TaskRepository;
import org.sublux.repository.UserRepository;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Arrays;

@Controller
@RequestMapping("/contest")
public class ContestController {
    private final ContestRepository contestRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ContestController(ContestRepository contestRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.contestRepository = contestRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/create")
    public String getCreateContestForm(ContestForm contestForm) {
        return "contest_form";
    }

    @PostMapping("/create")
    @ResponseBody
    public String createContest(@Valid ContestForm contestForm, BindingResult bindingResult) {
        Contest contest = new Contest();
        contest.setName(contestForm.getName());
        contest.setDescription(contestForm.getDescription());
        contest.setAuthor(userRepository.findById(1).orElse(null));
        ArrayList<Task> tasks = new ArrayList<>();
        taskRepository.findAllById(Arrays.asList(contestForm.getTaskIds())).forEach(tasks::add);
        contest.setTasks(tasks);
        contestRepository.save(contest);
        return "OK";
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Contest getContest(@PathVariable Integer id) {
        return contestRepository.findById(id).orElse(null);
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponsePage<Contest> getAllContests(@RequestParam(required = false, defaultValue = "0") Integer page) {
        Page<Contest> repositoryPage = contestRepository.findAll(PageRequest.of(page, 50));
        return new ResponsePage<>(repositoryPage.iterator(), repositoryPage.getTotalPages(),
                repositoryPage.getTotalElements(), repositoryPage.getSize());
    }
}
