package org.sublux.isolation;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class LanguageImage {
    @Column(name = "imageId")
    private String imageId;

    public LanguageImage(String imageId) {
        this.imageId = imageId;
    }

    public LanguageImage() {
    }

    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }
}
