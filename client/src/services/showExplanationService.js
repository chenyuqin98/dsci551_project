import http from "../commons/http-commons";

class showExplanationService{
    async getexplanation(){
        const response = await http.get("api/firebase");
        console.log("explanation: ", response.data);
        return response.data;
    }
}
export default new showExplanationService();