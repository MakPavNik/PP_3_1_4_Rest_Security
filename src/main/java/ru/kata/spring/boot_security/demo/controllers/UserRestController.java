package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public UserRestController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

//    @GetMapping("admin/{id}")
//    public User getAdmin(@PathVariable("id") Long id){
//        User user = userService.getUser(id);
//        return user;
//    }

//    @GetMapping("admin/users")
//    public List<User> getTableUsers() {
//        List<User> allUsers = userService.findAll();
//        return allUsers;
//    }

    @GetMapping(value = "/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

//    @GetMapping("admin/add")
//    public String addUserTable(User user) {
//        return "add";
//    }

    @GetMapping(value = "/admin/users/{id}")
    public User getUser(@PathVariable("id") Long id ) {
        return userService.getUser(id);
    }


    //-------- Не понятно нужен ли---------//
    @GetMapping(value = "/admin/{id}")
    public User getAdmin(@PathVariable("id") Long id ) {
        return userService.getUser(id);
    }

//    @PostMapping("admin/users")
//    public User addUser(@RequestBody User user){
//        userService.saveUser(user);
//        return user;
//    }

    @PostMapping("/admin/users")
    public void newUser(@RequestBody User user){
        userService.saveUser(user);
    }


    @DeleteMapping("/admin/delete/{id}")
    public void deleteUser (@PathVariable("id") Long id){
        userService.deleteById(id);
    }

//    @GetMapping("admin/update/{id}")
//    public String updateUserTable(@PathVariable("id") Long id, Model model) {
//        User user = userService.findById(id);
//        model.addAttribute("user", user);
//        return "update";
//    }

    @PutMapping("/admin/users")
    public User updateUser(@RequestBody User user) {
        HashSet<Role> roles = new HashSet<>();
        for(Role role : roles) {
            roles.add(role);
        }
        user.setRoles(roles);
        userService.saveUser(user);
        return user;
    }
//    @PutMapping("admin/update")
//    public User updateUser(RequestBody User user){
//        userService.saveUser(user);
//        return user;
//    }

//    @GetMapping("user/{id}")
//    public String infoUser(@PathVariable("id") Long id){
//        User user = userService.getUser(id);
//        return "user";
//    }
}

