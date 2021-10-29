package org.sublux.serializer;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.entity.Language;

@JsonSerialize(using = LanguageLongSerializer.class)
public class LanguageLong extends Language {
    public LanguageLong(Language language) {
        super(language);
    }
}
