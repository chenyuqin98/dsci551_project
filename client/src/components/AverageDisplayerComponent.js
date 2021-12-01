import React from "react"
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import showAvgService from "../services/showAvgService";

class AverageDisplayerComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            avg:undefined
        }
    }

    async handleClick(metadata){
        const avg = await showAvgService.getAvg(metadata);
        this.setState({
            avg:avg
        })
    }

    render() {
        let metadata = this.props.metadata;
        return (
            <div style={{display:"flex", justifyContent:"space-between",
                alignItems:"center"}}>
                <Button variant="outlined" color="primary" onClick={() => this.handleClick({metadata})}>Average</Button>
                {this.state.avg&& <Typography>{this.state.avg}</Typography>}
            </div>

        );
    }
}

export default AverageDisplayerComponent;