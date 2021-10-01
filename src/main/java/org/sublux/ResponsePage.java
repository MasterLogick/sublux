package org.sublux;

import java.util.Iterator;

public class ResponsePage<T> {
    private Iterator<T> content;
    private Integer totalPages;
    private Long totalElements;
    private Integer size;

    public ResponsePage(Iterator<T> content, Integer totalPages, Long totalElements, Integer size) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
    }

    public Iterator<T> getContent() {
        return content;
    }

    public void setContent(Iterator<T> content) {
        this.content = content;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
