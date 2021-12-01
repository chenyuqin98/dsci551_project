import http from "../commons/http-commons";
class predictService{
    async predict(name){
       const response= await http.get("api/predict", {
            params:{
                name:name
            }
        })
        return response.data;
    }
}
export default new predictService();