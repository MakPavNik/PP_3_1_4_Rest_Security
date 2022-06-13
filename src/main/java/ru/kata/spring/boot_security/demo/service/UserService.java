package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User findById(Long id) {
        return userRepository.getOne(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        user.setRoles(Set.of(roleRepository.findRoleByRole("ROLE_USER")));
        return userRepository.save(user);
    }
/*
    public void saveUser(User user, String role) {
        Role roleDefault = new Role();
        roleDefault.setRole("ROLE_USER");
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(roleDefault);
        if (role.indexOf("ROLE_") != -1) {
            Role temp = new Role();
            temp.setRole(role);
            roleSet.add(temp);
        }
        user.setRoles(roleSet);
        if (userDao.loadUserByUsername(user.getLogin()) == null) {
            for (Role temp : user.getRoles()) {
                roleRepository.save(temp);
            }
            userDao.addUser(user);
        }
    }
*/
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException { //String username
        User user = findByUsername(login); //username
        if (user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        return new org.springframework.security.core.userdetails
                .User(user.getLogin(), user.getPassword(), mapRolesToAuthorities(user.getRoles())); //user.getUsername()
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getRole())).collect(Collectors.toList());
    }

    public User findByUsername(String username) {
        return userRepository.findUserByLogin(username);
    }

    public User getUser(Long id) {
        return userRepository.findUserById(id);
    }

//    public User getUser(String username) {
//        return userRepository.findByUsername(username);
//    }


}