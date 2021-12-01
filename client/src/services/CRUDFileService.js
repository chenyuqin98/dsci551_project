import http from "../commons/http-commons";
class CRUDFileService{
    deleteFileByIdAndName(id, name){
        return http.get("api/delete", {
            params:{
                id:id,
                name:name
            }
        });
    }
    async checkFile(md5){
        const response = await http.get("api/checkFile", {
           params:{
               md5:md5
           }
        });
       return response.data;
    }

    async checkChunk(i, md5) {
        const response = await http.get("api/checkChunk", {
            params:{
                index:i,
                md5:md5
            }
        });
        return response.data;
    }

    getFiles(){
        return http.get("api/Files");
    }

    getMetaData(name){
        return http.get("api/metadata", {
            params:{
                name:name
            }
        });
    }
}

export default new CRUDFileService();