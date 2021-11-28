package org.sublux.isolation;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.exception.DockerClientException;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.LogConfig;
import com.github.dockerjava.api.model.Mount;
import com.github.dockerjava.core.DockerClientBuilder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.sublux.entity.Language;
import org.sublux.entity.TestCluster;
import org.sublux.repository.LanguageRepository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Service
public class IsolationManager {
    private final DockerClient dockerClient;
    private final MountedVolumeManager mountedVolumeManager;
    private final int volumeSize;
    private final int imageBuildTimeout;
    private final int solutionBuildTimeout;
    private final int logObtainTimeout;

    public IsolationManager(MountedVolumeManager mountedVolumeManager, Environment env) {
        this.mountedVolumeManager = mountedVolumeManager;
        dockerClient = DockerClientBuilder.getInstance().build();
        volumeSize = env.getProperty("sublux.docker-build-image-size", Integer.TYPE, 50);
        imageBuildTimeout = env.getProperty("sublux.docker-image-build-size", Integer.TYPE, 30);
        solutionBuildTimeout = env.getProperty("sublux.docker-build-solution-timeout", Integer.TYPE, 60000);
        logObtainTimeout = env.getProperty("sublux.docker-log-obtain-timeout", Integer.TYPE, 5000);
    }

    public LanguageImage createLanguageImage(Language language) throws IOException, DockerException {
        BuildImageResultCallback buildCallback = dockerClient
                .buildImageCmd(new ByteArrayInputStream(language.getDockerTar()))
                .withNoCache(true)
                .withForcerm(true)
                .withTags(Collections.singleton("sublux-" + language.getName().toLowerCase(Locale.ROOT)))
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
        Mount mount = volume.getMount().withTarget(BuildContainer.volumeMountPointInternal);
        LogConfig logConfig = new LogConfig()
                .setType(LogConfig.LoggingType.LOCAL)
                .setConfig(Collections.singletonMap("max-size", "1m"));
        HostConfig hostConfig = HostConfig.newHostConfig()
                .withMounts(Collections.singletonList(mount))
                .withLogConfig(logConfig);
        CreateContainerResponse ccr = dockerClient.createContainerCmd(language.getLanguageImage().getImageId())
                .withHostConfig(hostConfig)
                .withCmd(BuildContainer.CMD_COMMAND)
                .withName("sublux-build-container-" + language.getId() + "-" + System.currentTimeMillis())
                .exec();
        return new BuildContainer(language, volume, ccr.getId(), solutionBuildTimeout, logObtainTimeout, dockerClient);
    }

    public RunContainer createRunContainer(Language language, TestCluster testCluster) throws DockerException {
        MountedVolume volume;
        try {
            volume = mountedVolumeManager.createMountedVolume(volumeSize);
        } catch (IOException | TerminationException e) {
            e.printStackTrace();
            throw new DockerException("Volume creation error", e);
        }
        Mount mount = volume.getMount().withTarget(RunContainer.volumeMountPointInternal);
        LogConfig logConfig = new LogConfig()
                .setType(LogConfig.LoggingType.LOCAL)
                .setConfig(Collections.singletonMap("max-size", "1m"));
        HostConfig hostConfig = HostConfig.newHostConfig()
                .withMounts(Collections.singletonList(mount))
                .withLogConfig(logConfig)
                .withMemory(testCluster.getMemoryLimit() * 1024L * 1024)
                .withMemorySwap(testCluster.getMemoryLimit() * 1024L * 1024L);
        CreateContainerResponse ccr = dockerClient.createContainerCmd(language.getLanguageImage().getImageId())
                .withHostConfig(hostConfig)
                .withCmd(RunContainer.CMD_COMMAND)
                .withName("sublux-run-container-" + language.getId() + "-" + testCluster.getId() + "-" + System.currentTimeMillis())
                .withNetworkDisabled(true)
                .exec();
        return new RunContainer(language, volume, ccr.getId(), solutionBuildTimeout, logObtainTimeout, dockerClient);
    }

    public void validateLanguageImage(LanguageImage image) {
        dockerClient.inspectImageCmd(image.getImageId()).exec();
    }

    @Bean
    public CommandLineRunner checkLanguageImages(LanguageRepository languageRepository) {
        return (String[] args) -> languageRepository.findAll().forEach(
                lang -> {
                    try {
                        validateLanguageImage(lang.getLanguageImage());
                    } catch (NotFoundException e) {
                        try {
                            lang.setLanguageImage(createLanguageImage(lang));
                        } catch (IOException | DockerException ex) {
                            ex.printStackTrace();
                        }
                        languageRepository.save(lang);
                    }
                }
        );
    }
}
