package org.sublux.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    private final UserDetailsServiceImpl userDetailsService;

    public WebSecurityConfiguration(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        //todo add user password changer
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        auth.eraseCredentials(true);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/error").permitAll()
                .antMatchers("/js/**").permitAll()
                .antMatchers("/css/**").permitAll()
                .antMatchers("/img/**").permitAll()
                .antMatchers("/contest/all").permitAll()
                .antMatchers("/contest/create").hasAuthority("ROLE_USER")
                .antMatchers("/contest/{id}").permitAll()
                .antMatchers("/task/create").hasAuthority("ROLE_USER")
                .antMatchers("/task/{id}").permitAll()
                .antMatchers("/user/register").permitAll()
                .anyRequest().authenticated();
        http.formLogin()
                .loginProcessingUrl("/user/login")
                .successHandler(new AuthenticationSuccessHandlerImpl())
                .failureHandler(new AuthenticationFailureHandlerImpl())
                .permitAll(true);
        http.logout()
                .logoutUrl("/user/logout")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessUrl("/")
                .permitAll(true);
        http.exceptionHandling().authenticationEntryPoint(new AuthenticationEntryPointImpl());
    }
}
