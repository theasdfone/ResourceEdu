package com.edu.guide.dao;

import com.edu.guide.model.FileUpload;
import com.edu.guide.model.User;

import java.util.List;

public interface FileUploadDao {
    FileUpload uploadFileMetaData(FileUpload fileUpload);

    String deleteFile(FileUpload fileUpload);

    List<FileUpload> getFiles(User user);

    List<FileUpload> getSearchList(String search, User user);

    FileUpload getFileById(String fileId);
}
