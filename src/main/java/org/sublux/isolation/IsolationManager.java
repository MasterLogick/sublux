package org.sublux.isolation;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.exception.DockerClientException;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.Mount;
import com.github.dockerjava.core.DockerClientBuilder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.sublux.entity.Language;
import org.sublux.repository.LanguageRepository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

@Service
public class IsolationManager {
    private final DockerClient dockerClient;
    private final MountedVolumeManager mountedVolumeManager;
    private final int volumeSize;
    private final int imageBuildTimeout;

    public IsolationManager(MountedVolumeManager mountedVolumeManager, Environment env) {
        this.mountedVolumeManager = mountedVolumeManager;
        dockerClient = DockerClientBuilder.getInstance().build();
        volumeSize = env.getProperty("sublux.docker-build-image-size", Integer.TYPE, 50);
        imageBuildTimeout = env.getProperty("sublux.docker-image-build-size", Integer.TYPE, 30);
    }

    public LanguageImage createLanguageImage(Language language) throws IOException, DockerException {
        BuildImageResultCallback buildCallback = dockerClient
                .buildImageCmd(new ByteArrayInputStream(language.getDockerTar()))
                .withNoCache(true)
                .withForcerm(true)
                .withTags(Collections.singleton("sublux-" + language.getName()))
                .start();
        String imageId;
        try {
            imageId = buildCallback.awaitImageId(imageBuildTimeout, TimeUnit.MINUTES);
        } catch (DockerClientException e) {
            buildCallback.close();
            throw new DockerException("Language image build exception", e);
        }
        return new LanguageImage(imageId);
    }

    public BuildContainer createBuildContainer(Language language) throws DockerException {
        MountedVolume volume;
        try {
            volume = mountedVolumeManager.createMountedVolume(volumeSize);
        } catch (IOException | TerminationException e) {
            e.printStackTrace();
            throw new DockerException("Volume creation error", e);
        }
        HostConfig hostConfig = HostConfig.newHostConfig();
        Mount mount = volume.getMount().withTarget(BuildContainer.volumeMountPointInternal);
        hostConfig.withMounts(Collections.singletonList(mount));
        CreateContainerResponse ccr = dockerClient.createContainerCmd(language.getLanguageImage().getImageId())
                .withHostConfig(hostConfig).withCmd(BuildContainer.CMD_COMMAND).exec();
        return new BuildContainer(language, volume, ccr.getId(), dockerClient);
    }

    public boolean isLanguageImageValid(LanguageImage image) {
        try {
            dockerClient.inspectImageCmd(image.getImageId()).exec();
            return true;
        } catch (NotFoundException e) {
            throw e;
        }
    }

    @Bean
    public CommandLineRunner checkLanguageImages(LanguageRepository languageRepository) {
        return (String[] args) -> languageRepository.findAll().forEach(
                lang -> {
                    isLanguageImageValid(lang.getLanguageImage());
                }
        );
    }
}
