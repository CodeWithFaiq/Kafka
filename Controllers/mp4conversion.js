const axios=require('axios');
const path = require('path');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');


const writeFileToLocalDirectory = async (video_name, resp,) => {
    const localPath = path.resolve(__dirname, '..', video_name);
    const writer = fs.createWriteStream(localPath);

    resp.data.pipe(writer);

    
    await new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log('Video finished downloading');
            resolve();
        });

        writer.on('error', (err) => {
            console.error('Error writing the video to the local directory:', err);
            reject(err);
        });
    });

  
    await moveMoovAtomToStart(localPath,video_name);
};

const moveMoovAtomToStart = (inputPath,video_name) => {
    return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace('.mp4', video_name);
        ffmpeg.setFfmpegPath(ffmpegStatic);
        ffmpeg(inputPath)
            .outputOptions('-movflags', 'faststart')
            .save(outputPath)
            .on('end', () => {
                console.log('Moov atom moved to the start of the video');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error processing the video:', err);
                reject(err);
            });
    });
};

module.exports={writeFileToLocalDirectory}