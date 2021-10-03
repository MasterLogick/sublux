package org.sublux.web.form;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@PasswordMatches
public class UserRegisterDTO {
    @NotNull
    @NotEmpty
    @Pattern(regexp = "^(?=.*?[a-zA-Z])[a-zA-Z0-9_-]{7,50}$", message = "Username must contain at least one letter and has a length from 7 to 50 characters")
    private String username;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{6,255}$", message = "Password must contain at least one upper case English letter, at least one lower case letter, at least one digit, at least one nonalphanumeric character and has length from 6 to 255")
    private String password;

    @NotNull
    @NotEmpty
    private String passwordRepetition;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+$", message = "Invalid mail address")
    private String mail;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordRepetition() {
        return passwordRepetition;
    }

    public void setPasswordRepetition(String passwordRepetition) {
        this.passwordRepetition = passwordRepetition;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
}
