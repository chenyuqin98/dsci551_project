import http from "../commons/http-commons";
class UploadFileService{
    //upload the ith file
    uploadChunk(chunkfile, chunkIdx, chunkNum, fileName, md5){
        let formData = new FormData();
        //append key/value对
        formData.append("file", chunkfile);
        formData.append("chunk", chunkIdx);
        formData.append('chunks', chunkNum);
        formData.append("name", fileName);
        formData.append("md5", md5);
        return http.post("/uploadChunkedFile", formData, {
            headers:{
                "Content-Type": "multipart/form-data"
            }
        });
    }
     orderComposeFile(chunkNum, fileName, md5) {
         let formData = new FormData();
         //append key/value对
         formData.append('chunks', chunkNum);
         formData.append("name", fileName);
         formData.append("md5", md5);
         return http.post("/orderComposeFile", formData, {
             headers:{
                 "Content-Type": "multipart/form-data"
             }
         });

    }


    getChunkedFile(file){
        const chunkSize = Math.ceil(file.size/20);
        const fileChunkList = [];
        let cur = 0;
        while(cur<file.size){
            const fileChunk = file.slice(cur, cur+chunkSize);
            fileChunkList.push(fileChunk);
            cur+= chunkSize;
        }
        console.log(fileChunkList);
        return fileChunkList;
    }




}

export default new UploadFileService();