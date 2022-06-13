package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@Controller
@RequestMapping("/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @GetMapping("/login")
//    public String loginPage(){
//        return "login";
//    }


    @GetMapping("admin/users")
    public String getTableUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "users";
    }

    @GetMapping("admin/add")
    public String addUserTable(User user) {
        return "add";
    }

    @PostMapping("admin/add")
    public String addUser(User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    @GetMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin/users";
    }

    @GetMapping("admin/update/{id}")
    public String updateUserTable(@PathVariable("id") Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "update";
    }

    @PostMapping("admin/update")
    public String updateUser(User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    @GetMapping("/user")
    public String infoUser(Model model, Long id) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        return "user";
    }

//    @GetMapping("/user")
//    public String infoUser(Model model, Authentication authentication) {
//        String username = authentication.getName();
//        model.addAttribute("user", userService.getUser(username));
//        return "user";
//    }
//@GetMapping("user/{id}")
//public String userInfo(@PathVariable("id") Long id, Model model) {
//   // User user = userService.findByUsername(username);
//    model.addAttribute("user", userService.findById(id));
//    return "user";
//}
//@GetMapping("/user")
//public String userList(@AuthenticationPrincipal User user, Model model) {
//    model.addAttribute("authorisedUser", user);
//    return "user";
//}

}
