package com.example.demo.Controller;

import com.example.demo.Model.TrainData;
import com.example.demo.TrainDataService.TrainDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("api/TrainData")
public class TrainDataController {
    private TrainDataService trainDataService;
    @Autowired
    public TrainDataController(TrainDataService trainDataService) {
        this.trainDataService = trainDataService;
    }


    @GetMapping
    public List<TrainData> getAllTrainData(){
        return trainDataService.getAllTrainData();
    }

    @PostMapping
    public String getTrainResult(@RequestBody TrainData response){
        TrainData trainData= trainDataService.getTrainDataByName(response.getName());
        System.out.println(trainData.getId());
        String result = trainDataService.train(trainData);
        return result;
    }
}
