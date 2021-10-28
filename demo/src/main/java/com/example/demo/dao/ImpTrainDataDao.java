package com.example.demo.dao;

import com.example.demo.Model.TrainData;
import org.springframework.stereotype.Repository;

import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Repository
public class ImpTrainDataDao implements TrainDataDao{
    private static List<TrainData> Database = new ArrayList<>();

    public ImpTrainDataDao() {
        Database.add(new TrainData(UUID.randomUUID(), "train.csv", "train.csv"));
    }
    @Override
    public List<TrainData> retrieveAllTrainData() {
        return Database;
    }

    @Override
    public TrainData getTrainDataByName(String name) {
        for(TrainData t: Database){
            if(t.getName().equals(name)){
                return t;
            }
        }
        return null;
    }
}
