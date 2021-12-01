import http from "../commons/http-commons";
class showAvgService{
    async getAvg(metadata){
        const response = await http.get("api/Average", {
            params:{
                metadata:metadata
            }
        })
        return response.data
    }
}
export default new showAvgService();