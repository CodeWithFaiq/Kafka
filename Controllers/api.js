const axios=require('axios');

const downloadVideo=async(videoUrl)=>{
    const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
      });
      return response;
}

module.exports={downloadVideo}