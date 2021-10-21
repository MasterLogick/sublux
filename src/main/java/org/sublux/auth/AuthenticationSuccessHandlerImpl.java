package org.sublux.auth;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.sublux.serializer.UserLong;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_OK);
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                response.setHeader("Content-Type", "application/json");
                UserDetailsImpl details = (UserDetailsImpl) authentication.getPrincipal();
                JsonGenerator mapper = new ObjectMapper().createGenerator(response.getOutputStream());
                mapper.writeObject(new UserLong(details));
                mapper.flush();
            }
        }
        response.flushBuffer();
    }
}
