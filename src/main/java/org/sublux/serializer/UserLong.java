package org.sublux.serializer;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.User;

@JsonSerialize(using = UserLongSerializer.class)
public class UserLong extends User {
    public UserLong(User user) {
        super(user);
    }
}
