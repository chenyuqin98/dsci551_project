package com.example.demo.Controller;

import com.example.demo.Model.TrainData;
import com.example.demo.Service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;


@Controller
@CrossOrigin("http://localhost:3000")
public class TrainController {
    public static void main(String[] args) throws Exception {
//        String rlt = getAverage("{\"metadata\":\"Type\"}");
//        System.out.println(rlt);
//        String rlt2 = predict("0a0e8c15b-1.jpg");
//        System.out.println(rlt2);
        loadFirebase();
    }

    private TrainService trainService;
    @Autowired
    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("api/predict")
    @ResponseBody

//    public String predict(@RequestParam("name") String name){
//        //形参String name是文件名
//        //返回预测这个图片将被领养的天数
//        return "3";

    public static String predict(@RequestParam("name") String name){
        //形参String name是文件名
         System.out.println(name);
        //返回预测这个图片将被领养的天数
        String pred=null;
        try {
            System.out.println("start cnn predict");
            String[] args = new String[] { "python", "/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/models_manager/cnn.py", name};
            Process proc = Runtime.getRuntime().exec(args);
            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
//            while ((avg=in.readLine())!=null){
//                System.out.println(avg);
//            }
            pred=in.readLine();
            proc.waitFor();
            System.out.println("end cnn predict");
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(pred);
        return pred;
    }

    @GetMapping("api/firebase")
    @ResponseBody
    public static String loadFirebase() throws IOException {
        String url = "https://cyq-dsci551-default-rtdb.firebaseio.com/color_labels.json";
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String result = "tmp";
        try {

//            HttpGet request = new HttpGet("https://httpbin.org/get");
            HttpGet request = new HttpGet(url);
            // add request headers
            request.addHeader("custom-key", "mkyong");
            request.addHeader(HttpHeaders.USER_AGENT, "Googlebot");

            CloseableHttpResponse response = httpClient.execute(request);

            try {

                // Get HttpResponse Status
//                System.out.println(response.getProtocolVersion());              // HTTP/1.1
//                System.out.println(response.getStatusLine().getStatusCode());   // 200
//                System.out.println(response.getStatusLine().getReasonPhrase()); // OK
//                System.out.println(response.getStatusLine().toString());        // HTTP/1.1 200 OK

                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    // return it as a String
                     result = EntityUtils.toString(entity);
                    System.out.println("this is the result:");
                    System.out.println(result);
                }

            } finally {
                response.close();
            }
        } finally {
            httpClient.close();
        }
        return result;

    }

    @GetMapping("api/Average")
    @ResponseBody

//    public String getAverage(@RequestParam("metadata") String metadata){
//        System.out.println("metadata: "+metadata);
//        return "5";

    public static String getAverage(@RequestParam("metadata") String metadata) throws IOException, InterruptedException {
//        System.out.println(metadata);
        String avg=null;
        try {
            System.out.println("start run spark avg");
            String[] args = new String[] { "python", "/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data_manager/data_explorer.py", metadata};
            Process proc = Runtime.getRuntime().exec(args);
            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
//            while ((avg=in.readLine())!=null){
//                System.out.println(avg);
//            }
            avg=in.readLine();
            proc.waitFor();
            System.out.println("end run spark avg");
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return avg;
    }

    @GetMapping("api/metadata")
    @ResponseBody
    public List<String> getMetaData(@RequestParam("name") String name){
        System.out.println("filename: "+name);
        List<String> metaData = trainService.getMetaData(name);
        for(String s:metaData){
            System.out.println(s);
        }
        return trainService.getMetaData(name);
    }
    @PostMapping("/api/Train")
    public void trainOnSelectedFeatures(HttpServletRequest request, HttpServletResponse response){
        //这两个list就是用户选择的feature和用户填入的对应的值value
        List<String> features = new ArrayList<>();
        List<String> values = new ArrayList<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while(parameterNames.hasMoreElements()){
            String attribute = parameterNames.nextElement();
            features.add(attribute);
            String[] parameterValues = request.getParameterValues(attribute);
            for (String parameterValue:parameterValues){
                values.add(parameterValue);
            }
        }
        try {
            System.out.println("start run python xgboost");
            ArrayList<String> arr = new ArrayList<String>();
            arr.add("python");
            arr.add("/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/models_manager/xgboost_.py");
            arr.add("features");
            for(String feature:features) {
                System.out.println(feature);
                arr.add(feature);
            }
            arr.add("values");
            for(String value:values) {
                System.out.println(value);
                arr.add(value);
            }
            String[] args = new String[arr.size()];
            args = arr.toArray(args);
            Process proc = Runtime.getRuntime().exec(args);
            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String line=null;
            // Todo: write line to return result, judge if there are multiple lines;
            while ((line=in.readLine())!=null){
                PrintWriter out = response.getWriter();
                out.write(line);
                out.write("\n");
            }
            proc.waitFor();
            System.out.println("end run python xgboost");
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

    }
}
