import React from 'react';
import {
    MDBCol, MDBRow, MDBCard, MDBTypography,
    MDBCardBody, MDBListGroup, MDBListGroupItem, MDBNavbar,
} from "mdb-react-ui-kit";
import { SearchBarContainer } from './searchUI';
import Button from '@mui/material/Button';
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import { SearchBar } from './searchUI';

class PKDSearch extends SearchBar {
    constructor(props) {
        super(props);
        this.autocompleteRef = React.createRef();
        this.searchRef = React.createRef();

        this.state = {
            input: '',
            autocomplete: {
                'company': [],
                'PKD': []
            }
        }
    }

    componentDidMount = () => {
        var width = this.searchRef.current.offsetWidth;

        this.autocompleteRef.current.style.width = `${width}px`;
    }

    applyAutocomplete = (e) => {
        var value = e.target.innerText;
        this.props.callback(value);
        console.log(value);
        this.setState({
            input: '',
            autocomplete: {
                'company': [],
                'PKD': []
            }
        });
    }

    render() {
        return (
            <>
                <MDBRow className="h-100" style={{ marginBottom: "0%" }}>
                    <MDBCol className="d-flex w-100">

                        <input type="text"
                            ref={this.searchRef}
                            className="form-control"
                            onKeyPress={this.onKeyPress}
                            value={this.state.input}

                            onChange={this.onChange} />
                    </MDBCol>
                </MDBRow>
                <MDBRow ref={this.autocompleteRef} className="my-0 mx-1 mb-3" style={{
                    background: "white",
                    overflowY: "scroll",
                    zIndex: "2",
                    maxHeight: "200pt",
                    position: "absolute"
                }} >
                    {this.craftAutocomplete()}
                </MDBRow>
            </>
        );
    }
}

class InputForm extends React.Component {
    PKD_ENDPOINT = "http://localhost:8000/pkd/";

    constructor(props) {
        super(props);
        this.state = {
            pkds: [],
        }
    }

    addPKD = (value) => {
        this.setState({
            pkds: [...this.state.pkds, value]
        });
    }

    removePKD = (e) => {
        var value = e.target.innerText;
        var newPKDs = this.state.pkds.filter(pkd => pkd !== value);
        this.setState({
            pkds: newPKDs
        });
    }

    render() {
        // Create form with name, description and price
        return (
            <SearchBarContainer>
                <MDBNavbar className="fixed-top shadow-0" style={{ padding: "0 20%", color: "white", backgroundColor: "#08080832" }}>
                    <MDBTypography variant='h1' className="h1-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Dodaj nowy wpis
                    </MDBTypography>
                </MDBNavbar>
                <MDBRow style={{ marginTop: "15%" }}>
                    <MDBCol md="12">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBListGroup flush style={{ borderWidth: "0" }}>
                                    <MDBRow className="ml-0">
                                        <MDBCol className="col-6 ml-0 pl-0">
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Nazwa jednostki:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <input type="text" className="form-control" onChange={(e) => { this.setState({ input: e.target.value }) }} />
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Kwota:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <input type="number" className="form-control" onChange={(e) => { this.setState({ input: e.target.value }) }} />
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Typ dofinansowania:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Wybierz typ"
                                                    className="w-100"
                                                >
                                                    <MenuItem value={10}>x</MenuItem>
                                                    <MenuItem value={20}>y</MenuItem>
                                                    <MenuItem value={30}>z</MenuItem>
                                                </Select>

                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Wielkość przedsiębiorstwa:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                {/* 3 checkboxes */}
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                                    <label className="custom-control-label" htmlFor="customCheck1">Małe</label>
                                                </div>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck2" />
                                                    <label className="custom-control-label" htmlFor="customCheck2">Średnie</label>
                                                </div>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck3" />
                                                    <label className="custom-control-label" htmlFor="customCheck3">Duże</label>
                                                </div>
                                            </MDBListGroupItem>
                                        </MDBCol>
                                        <MDBCol className="col-6 ml-0 pl-0 d-flex" style={{ flexDirection: "column" }}>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Kody PKD:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem className="w-100" style={{ borderWidth: "0" }}>
                                                {/* <input type="text" className="w-100" onChange={(e) => { this.setState({ input: e.target.value }) }} />
                                                 */}
                                                <PKDSearch PkdEndpoint={this.PKD_ENDPOINT} callback={this.addPKD} />
                                            </MDBListGroupItem>

                                            <MDBListGroupItem style={{ borderWidth: "0", height: "100%" }}>
                                                <div className="w-100 h-100 border" style={{ backgroundColor: "white" }}>
                                                    {this.state.pkds.map((pkd, index) => {
                                                        return (
                                                            <div onClick={this.removePKD} className="pkd-container hoverable-row" key={"pkd-container-"+index}>
                                                                <div className="pkd-name">{pkd}</div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </MDBListGroupItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="ml-0">
                                        <MDBListGroupItem style={{ borderWidth: "0" }}>
                                            <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                Opis:
                                            </MDBTypography>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem style={{ borderWidth: "0" }}>
                                            <textarea className="form-control" rows="5" onChange={(e) => { this.setState({ input: e.target.value }) }}></textarea>
                                        </MDBListGroupItem>
                                    </MDBRow>
                                </MDBListGroup>
                                <div className="w-100 d-flex pr-2" style={{ justifyContent: "end" }}>
                                    <Button variant="contained"
                                        className="mr-3 mt-3"
                                        style={{ backgroundColor: "#8B2635", fontFamily: "'Montserrat', sans-serif" }} variant="contained" disableElevation
                                        onClick={() => { this.props.addItem(this.state.input) }}
                                    >
                                        Dodaj
                                    </Button>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </SearchBarContainer>
        )
    }
}

export default InputForm;