package com.edu.guide.dao.impl;

import com.edu.guide.dao.FileUploadDao;
import com.edu.guide.model.FileUpload;
import com.edu.guide.model.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class FileUploadDaoImpl implements FileUploadDao {
    @PersistenceContext
    private EntityManager em;

    @Override
    public FileUpload localUpload(FileUpload fileUpload) {
        em.persist(fileUpload);

        return fileUpload;
    }

    @Override
    public String deleteFile(FileUpload fileUpload) {
        em.remove(fileUpload);

        return "successful";
    }

    @Override
    public List<FileUpload> getFiles(User user) {
        return em.createQuery("SELECT f FROM FileUpload f WHERE f.user = :user", FileUpload.class)
                .setParameter("user", user).getResultList();
    }

    @Override
    public List<FileUpload> getSearchList(String  search, User user) {
        return em.createQuery("SELECT f FROM FileUpload f WHERE f.name LIKE CONCAT('%',:name,'%') AND f.user = :user", FileUpload.class)
                .setParameter("name", search)
                .setParameter("user", user).getResultList();
    }

    @Override
    public FileUpload getFileById(String fileId) {
        FileUpload fileUpload = em.find(FileUpload.class, fileId);

        if(fileUpload == null) {
            throw new EntityNotFoundException("No file found");
        }

        return fileUpload;
    }
}
