import React from "react";

import Nav from "../components/nav.jsx"
import Footer from "../components/footer.jsx"

import AdminStore from "../api/user";
import DocumentStore from "../api/documents";
import '../../css/dashboard.css';

import plus from "../../static/icons/plus.svg"
import gear from "../../static/icons/gear.svg"
import search from "../../static/icons/search.svg"

import learn from "../../static/learn.png"
import coop from "../../static/coop.png"
import lifestyle from "../../static/uwlife.png"

export default class LoginHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            data: [],
            search: "",
            isSelect: false
        };

        this.fileRef = React.createRef();
    }

    componentDidMount() {
        DocumentStore.getList().then((res) =>{
            this.setState({
                data: res
            })
        });
    }

    uploadFileHandler = async (event) => {
        let data = this.state.data;
        let fileName = event.target.files[0].name;

        let displayFile = {
            name: fileName,
            date: this.getCurrentDate(),
            fileType: event.target.files[0].name.split('.').pop(),
            fileSize: this.formatBytes(event.target.files[0].size),
        }

        let fileData = new FormData();
        fileData.append("file", event.target.files[0]);
        // fileData.append("jsonData", new Blob([JSON.stringify(displayFile)], {type: "application/json"}));

        const presignedUrl = await DocumentStore.getPresignedUrlUpload(fileName, "PUT");
        await DocumentStore.upload(presignedUrl, fileData, displayFile).then((res) => {
            this.setState({
                data: [...data, res],
            });
        });
    }

    searchHandler = (event) => {
        if(event.target.value) {
            DocumentStore.getSearchList(event.target.value).then((files) =>{
                this.setState({
                    data: files,
                    search: event.target.value
                })
            });
        } else {
            DocumentStore.getList().then((res) =>{
                this.setState({
                    data: res
                })
            });
        }
    }

    shareClickHandler = (fileId) => {
        console.log(fileId);
    }

    downloadClickHandler = async (fileName, fileType) => {
        const presignedUrl = await DocumentStore.getPresignedUrlUpload(fileName, "GET");
        await DocumentStore.download(presignedUrl).then((blob) =>{
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);

            link.href = url;
            link.download = `${fileName}.${fileType}`;
            link.click();
        });;
    }

    deleteClickHandler = async (fileId) => {
        await DocumentStore.delete(fileId);
        DocumentStore.getList().then((res) =>{
            this.setState({
                data: res
            })
        });
    }

    fileListHandler = (event) => {
        let fileData = new FormData();
        let files = [];

        let displayFile = {
            name: event.target.files[0].name,
            date: this.getCurrentDate(),
            fileType: event.target.files[0].name.split('.').pop(),
            fileSize: this.formatBytes(event.target.files[0].size),
        }

        fileData.append("file", event.target.files[0]);
        fileData.append("jsonData", new Blob([JSON.stringify(displayFile)], {type: "application/json"}));

        files.push(fileData);

        this.setState({
            fileList: files
        });
    }
    
    fileClickHandler = () => {
        this.fileRef.current.click();
    }

    fileSelectionHandler = () => {
        this.setState({
            isSelect: !this.state.isSelect
        })
    }

    getCurrentDate() {
        let today = new Date();

        let day = today.getDate().toString().padStart(2, '0');
        let month = (today.getMonth() + 1).toString().padStart(2, '0');
        let year = today.getFullYear();

        return `${month}/${day}/${year}`;
    }

    //Community byte calculator
   formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    renderNav() {
        const user = AdminStore.getCurrentUser().username;

        return(
            <Nav
                user={user}
            />
        )
    }

    renderSearchBar() {
        return(
            <div className="dashboard-searchbar-container">
                <input className="dashboard-searchbar" type="text" placeholder="Search File" onChange={this.searchHandler}/>
                <div className="dashboard-search-icon" type="button">
                    <img src={search} type="submit" alt=""/>
                </div>
            </div>
        )
    }

    renderSelect(file) {
        if(this.state.isSelect) {
            return(
                // <input style={{display: 'none'}} ref={this.fileList} type="checkbox" onChange={this.fileListHandler}/>
                <div></div>
            )
        } else {
            return(
                <div>
                    <img className="dropdown-toggle" type="button" data-toggle="dropdown" src={gear} alt="gear" />
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => this.shareClickHandler(file.id)}>Share</div>
                        <div className="dropdown-item" onClick={() => this.downloadClickHandler(file.name, file.fileType)}>Download</div>
                        <div className="dropdown-item" onClick={() => this.deleteClickHandler(file.id)}>Delete</div>
                    </div>
                </div>
            )
        }
    }

    renderStorageLinks() {
        return(
            <div>
                <div className="row jumbotron dashboard-file-container">
                    <table className="table">
                        <thead>
                            <tr className="d-flex">
                                <th className="col-3" scope="col">Name</th>
                                <th className="col-3" scope="col">Date Uploaded</th>
                                <th className="col-3" scope="col">File Type</th>
                                <th className="col-2" scope="col">File Size</th>
                                <th className="col-1" scope="col">
                                    <img className="dropdown-toggle" type="button" data-toggle="dropdown" src={plus} alt="plus" />
                                    <div className="dropdown-menu">
                                        <div className="dropdown-item" onClick={this.fileSelectionHandler}>Select Files</div>
                                        <div className="dropdown-item" onClick={this.fileClickHandler}>Add File</div>
                                        <input style={{display: 'none'}} ref={this.fileRef} accept=".pdf, .png, .jpg, .mp3, .mp4, .xls, .doc,.docx" type="file" onChange={this.uploadFileHandler}/>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((file)=> (
                                    <tr className="d-flex dashboard-table-container" key={file.id}>
                                        <td className="col-3">{file.name}</td>
                                        <td className="col-3">{file.date}</td>
                                        <td className="col-3">{file.fileType}</td>
                                        <td className="col-2">{file.fileSize}</td>
                                        <td>{this.renderSelect(file)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    renderPublicResource() {
        return(
            <div>
                <h3>More Resources</h3>
                <div className="d-flex row" id="dashboard-link-color">
                    <a href="/share" className="col-sm-4 justify-content-center align-items-center">
                        <img src={lifestyle} alt="lifestyle" className="dashboard-images"/>
                        <div className="dashboard-text-container">
                            <h3 className="dashboard-text">University</h3>
                        </div>
                    </a>
                    <a href="/share" className="col-sm-4 justify-content-center align-items-center">
                        <img src={learn} alt="lifestyle" className="dashboard-images" />
                        <div className="dashboard-text-container">
                            <h3 className="dashboard-text">Academics</h3>
                        </div>
                    </a>
                    <a href="/share" className="col-sm-4 justify-content-center align-items-center">
                        <img src={coop} alt="lifestyle" className="dashboard-images" />
                        <div className="dashboard-text-container">
                            <h3 className="dashboard-text">Co-ops</h3>
                        </div>
                    </a>
                </div>
            </div>
        )
    }

    renderFooter() {
        return (
            <Footer />
        )
    }

    render() {
        return (
            <div>
                {this.renderNav()}
                <div className="dashboard-container">
                    <div className="container d-flex justify-content-center align-items-center jumbotron text-light resource-doc">
                        <h1>Resource Docs</h1>
                    </div>
                    <div className="container">
                        {this.renderSearchBar()}
                        {this.renderStorageLinks()}
                        {this.renderPublicResource()}
                        <br/>
                    </div>
                </div>
                {this.renderFooter()}
            </div>
        );
    }
}