import React from "react";
import UploadService from "../services/uploadFileService";
import CRUDFileService from "../services/CRUDFileService";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {Box, Modal, Table, Typography} from "@material-ui/core";
import AverageDisplayer from "./AverageDisplayerComponent"
import SparkMD5 from "spark-md5"
import PredictService from "../services/predictService";
import ShowExplanationService from "../services/showExplanationService";
import { DataGrid } from '@mui/x-data-grid';
import showExplanationService from "../services/showExplanationService";

class UploadFileComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state= {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            fileInfos: [],
            fileMetaData:undefined,
            selectedFeatures:[],
            predict:undefined,
            visible: false,
            clean:false,
        }
    }

    async handleOk(){
        this.setState({ visible: true });
        const explanation = await showExplanationService.getexplanation();

    }
    handleClose = () => {
        this.setState({ visible: false });
    }
    clean = () => {
        this.setState({ clean: true });
    }

    componentDidMount() {
        this.listFiles();
    }

    selectFile(event){
        this.setState({
            selectedFiles:event.target.files
        });

    }
    deleteFile(id, name){
        CRUDFileService.deleteFileByIdAndName(id, name)
            .then((response) =>{
                if(response.data === true){
                    this.listFiles();
                    this.setState({
                        fileMetaData:undefined,
                        selectedFeatures:[]
                    })
                }

            });

    }

    listFiles(){
        CRUDFileService.getFiles().then((response) =>{
            const files = response.data;
            this.setState({
                fileInfos: files
            });
        });
    }

    async upload() {
        let currentFile = this.state.selectedFiles[0];
        // if(currentFIle.name.endsWith("jpg")|| ){

        //}
        //获取文件的md5,目的是文件秒传功能
        const reader = new FileReader();
        reader.onload = function(event){
            let binary = event.target.result;
            const md5 = SparkMD5.hashBinary(binary);
            console.log("this file's md5 is : ",md5);
            currentFile.uniqueIdentifier = md5;
        }
        reader.readAsBinaryString(currentFile);
       // const md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(currentFile)).toString();
        //检查数据库是否已经有文件了：大文件秒传
        let flag = await CRUDFileService.checkFile(currentFile.uniqueIdentifier);
        console.log("flag", flag);
        if(flag){
            alert("this file has already been uploaded!");
            return;
        }
        this.setState({
            progress:0,
            currentFile:currentFile
        });
        const chunkedFileList = UploadService.getChunkedFile(currentFile);
        let chunkNum = chunkedFileList.length;
        for(let i = 0; i<chunkNum;i ++){
            //check if chunk is exist
            let flag = await CRUDFileService.checkChunk(i, currentFile.uniqueIdentifier);
            if(!flag){
                await UploadService.uploadChunk(chunkedFileList[i], i, chunkNum, currentFile.name, currentFile.uniqueIdentifier);
            }
            this.setState({
                //用已上传的分片文件除以总分片数得到进度条
                progress:Math.round(100*(i+1)/chunkNum)
            });
        }
        await UploadService.orderComposeFile(chunkNum, currentFile.name, currentFile.uniqueIdentifier);
        this.listFiles();


    }


    render(){
        const {
            selectedFiles,
            currentFile,
            progress,
            message,
            fileInfos,
            fileMetaData,
            selectedFeatures,
            predict,
            visible,
            clean
        } = this.state;

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        };

        const columns = [
            { field: 'id', headerName: 'colorID', width: 130 },
            { field: 'colorName', headerName: 'colorName', width: 130 },
            // { field: 'lastName', headerName: 'Last name', width: 130 },
            // {
            //     field: 'age',
            //     headerName: 'Age',
            //     type: 'number',
            //     width: 90,
            // },
            // {
            //     field: 'fullName',
            //     headerName: 'Full name',
            //     description: 'This column has a value getter and is not sortable.',
            //     sortable: false,
            //     width: 160,
            //     valueGetter: (params) =>
            //         `${params.getValue(params.id, 'firstName') || ''} ${
            //             params.getValue(params.id, 'lastName') || ''
            //         }`,
            // },
        ];
        const rows = [
            { id: 1, colorName: 'Black' },
            { id: 2, colorName: 'Brown' },
            { id: 3, colorName: 'Golden'},
            { id: 4, colorName: 'Yellow'},
            { id: 5, colorName: 'Cream' },
            { id: 6, colorName: 'Gray' },
            { id: 7, colorName: 'White' },

        ];

        return(
            <div className="container" >

                <Modal
                    open={visible}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                checkboxSelection
                            />
                        </div>
                        {/*<Typography id="modal-modal-title" variant="h6" component="h2">*/}
                        {/*    Text in a modal*/}
                        {/*</Typography>*/}
                        {/*<Typography id="modal-modal-description" sx={{ mt: 2 }}>*/}
                        {/*    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
                        {/*</Typography>*/}
                    </Box>
                </Modal>

                {currentFile && (
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}

                <label className="btn btn-default">
                    <input
                        type="file"
                        onChange={(event) =>this.selectFile(event)}
                        className="form-control"
                    />
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    disabled={!selectedFiles}
                    onClick={() =>this.upload()}
                >Upload
                </Button>



                <div className="alert alert-light" role="alert">
                    {message}
                </div>

                <div className="card">
                    <div className="card-header">List of Files</div>
                    <ul className="list-group list-group-flush">
                        {fileInfos &&
                        fileInfos.map(file => {
                                return (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('png')) ?

                                    <li className="list-group-item" key={file.id}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <div>{file.name}</div>
                                            <div>
                                                <Button variant="contained"
                                                        color="error"
                                                        onClick={() => this.predict(file.name)}
                                                >
                                                    Predict
                                                </Button>
                                                <Button variant="contained"
                                                        color="secondary"
                                                        startIcon={<DeleteIcon/>}
                                                        onClick={() => this.deleteFile(file.id, file.name)}
                                                >Delete
                                                </Button>
                                            </div>

                                        </div>
                                    </li>
                                    :
                                    <li className="list-group-item" key={file.id}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <div>{file.name}</div>
                                            <div>
                                                <Button variant="contained"
                                                        color="primary"
                                                        onClick={() => this.getMetaData(file.name)}
                                                >
                                                    Explore
                                                </Button>
                                                <Button variant="contained"
                                                        color="secondary"
                                                        startIcon={<DeleteIcon/>}
                                                        onClick={() => this.deleteFile(file.id, file.name)}
                                                >Delete
                                                </Button>
                                                <Button variant="contained"
                                                        color="error"
                                                        onClick={() =>this.handleOk()}
                                                >
                                                    Explain
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                            }

                        )}
                    </ul>
                </div>

                {predict&& (
                    <div className="card" >
                        <div className="card-header">
                            Prediction Result
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <Typography variant="h4">This pet will be adopted in {predict} days</Typography>
                            </li>
                        </ul>
                    </div>
                )}

                {fileMetaData && (
                    <div className="card" >
                        <div className="card-header" style={{display:"flex", justifyContent:"center",
                            alignItems:"center"}}>
                            <Typography>MetaData: Choose Features to Train and Predict!</Typography>
                        </div>
                        <ul className="list-group list-group-flush">
                            {fileMetaData.map(
                                (metadata, index) => {
                                    // <li className="list-group-item" id={index}>

                                    return index>=3 ? <div style={{display:"flex", justifyContent:"center",
                                        alignItems:"center"}}>
                                            <Button
                                            onClick={() => {
                                        this.selectFeature(metadata);
                                            }}
                                            variant="outlined"
                                            color="primary"
                                            style={{width:"70%"}}
                                            >
                                            {metadata}
                                            </Button>
                                            <AverageDisplayer metadata={metadata} />
                                                    </div>
                                        :
                                        <Typography  style={{textAlign:"center"}}>{metadata}</Typography>
                                }

                            )}
                        </ul>
                    </div>
                )}

                {selectedFeatures.length>0 && (
                    <div>
                        <div></div>
                        <div><Button variant="contained" color="secondary" onClick={this.clean}>clean</Button>
                        {clean&& (<label>Successfully cleaned!</label>)}
                        </div>

                        <form action="http://localhost:8080/api/Train" method="POST" >
                            <legend>Fill in the features! </legend>
                            {selectedFeatures.map(feature =>
                                <div className="mb-3">
                                    <label htmlFor="feature" className="form-label">{feature}</label>
                                    <input type="text" className="form-control" id="feature" name={feature}
                                           />
                                </div>
                            )}
                            <Button type="submit" variant="contained" color="primary">Train and Predict</Button>
                        </form>

                    </div>

                )}
            </div>
        );

    }


    selectFeature(metadata) {
        this.setState((state) =>({
            selectedFeatures:[...state.selectedFeatures, metadata]
        }));

    }

    async getMetaData(name) {
        const response = await CRUDFileService.getMetaData(name);
        this.setState({
            fileMetaData:response.data
        })
    }
    async predict(name){
        const data = await PredictService.predict(name);
        this.setState({
            predict:data
        })
    }
}

export default UploadFileComponent;