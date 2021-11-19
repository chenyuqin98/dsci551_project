package com.example.demo.Controller;

import com.example.demo.Model.TrainData;
import com.example.demo.Service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;


@Controller
@CrossOrigin("http://localhost:3000")
public class TrainController {
    private TrainService trainService;
    @Autowired
    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("api/metadata")
    @ResponseBody
    public List<String> getMetaData(@RequestParam("name") String name){
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
            PrintWriter out = response.getWriter();
            out.write("wait for train module");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
