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

    //----Получение списка рабтников-----
    @GetMapping(value = "/admin/users")
    public List<User> getAllUsers() {
        List<User> allUsers = userService.findAll();
        return allUsers;
    }

    //----Получение рабтника-----
    @GetMapping(value = "/admin/users/{id}")
    public User getUser(@PathVariable("id") Long id) {
        return userService.getUser(id);
    }


    //-------- Не понятно нужен ли---------//
    @GetMapping(value = "/admin/{id}")
    public User getAdmin(@PathVariable("id") Long id) {
        return userService.getUser(id);
    }

    //------Добавление работника
    @PostMapping("/admin/users")
    public User newUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    //----------Удаление работника
    @DeleteMapping("/admin/users/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
    }

    //-------Изменение работника
    @PutMapping("/admin/users")
    public User updateUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

//    @GetMapping("/roles")
//    public ResponseEntity<List<Role>> showAllRoles() {
//        List<Role> roles = roleRepository.getAllRoles();
//        return new ResponseEntity<>(roles, HttpStatus.OK);
//    }
}

