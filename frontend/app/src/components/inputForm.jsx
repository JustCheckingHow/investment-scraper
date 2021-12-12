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
	SUBMIT_ENDPOINT = "http://localhost:8000/submit_financing";

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            pkds: [],
            url: [],
			name: "aaa",
			price_low: 0,
			price_high: 0,
			description: "aa",
			W3: "a",
			company_small: false,
			company_medium: false,
			company_big: false,
			financing_type: "a",
        }

		this.handleSubmit = this.handleSubmit.bind(this);
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.addURL(this.inputRef.current.value);
            return;
        }

    }
    
    addURL = (url) => {
        this.setState({
            url: [...this.state.url, url],
            pkds: this.state.pkds
        })
    }

    removeURL = (e) => {
        var url = e.target.innerText;
        this.setState({
            url: this.state.url.filter(u => u !== url),
            pkds: this.state.pkds
        })
    }

    addPKD = (value) => {
        this.setState({
            pkds: [...this.state.pkds, value],
            url: this.state.url
        });
    }

    removePKD = (e) => {
        var value = e.target.innerText;
        var newPKDs = this.state.pkds.filter(pkd => pkd !== value);
        this.setState({
            pkds: newPKDs,
            url: this.state.url
        });
    }

	async handleSubmit(event) {
		console.log("handleSubmit");

		var formdata = new FormData();
		formdata.append("name", this.state.name);
		formdata.append("description", this.state.description);
		formdata.append("price_low", this.state.price_low);
		formdata.append("price_high", this.state.price_high);
		formdata.append("pkds", this.state.pkds);
		formdata.append("W3", this.state.W3);
		formdata.append("company_small", this.state.company_small);
		formdata.append("company_medium", this.state.company_medium);
		formdata.append("company_big", this.state.company_big);
		formdata.append("financing_type", this.state.financing_type);
		formdata.append("url", this.state.url);
		
		var requestOptions = {
		  method: 'POST',
		  body: formdata,
		  redirect: 'follow'
		};
		fetch("http://localhost:8000/submit_financing", requestOptions)
  			.then(response => response.text())
  			.then(result => console.log(result))
  			.catch(error => console.log('error', error));
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
                <MDBRow style={{ marginTop: "10%", marginBottom: "10%" }}>
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
                                                <input type="text" className="form-control" onChange={(e) => { this.setState({ name: e.target.value }) }} />
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Kwota:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <input type="number" className="form-control" onChange={(e) => { this.setState({ price_low: e.target.value }) }} />
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Kwota:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <input type="number" className="form-control" onChange={(e) => { this.setState({ price_high: e.target.value }) }} />
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
                                                    <MenuItem value={10}>Dotacje</MenuItem>
                                                    <MenuItem value={20}>Pożyczka</MenuItem>
                                                    <MenuItem value={30}>Grant</MenuItem>
                                                </Select>

                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }}>
                                                <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    Wielkość przedsiębiorstwa:
                                                </MDBTypography>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem style={{ borderWidth: "0" }} >
                                                {/* 3 checkboxes */}
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" onChange={(e) => {this.setState({company_small: e.target.value})}}/>
                                                    <label className="custom-control-label" htmlFor="customCheck1">Małe</label>
                                                </div>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck2" onChange={(e) => {this.setState({company_medium: e.target.value})}}/>
                                                    <label className="custom-control-label" htmlFor="customCheck2">Średnie</label>
                                                </div>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck3" onChange={(e) => {this.setState({company_big: e.target.value})}}/>
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
                                                <PKDSearch PkdEndpoint={this.PKD_ENDPOINT} callback={this.addPKD} />
                                            </MDBListGroupItem>

                                            <MDBListGroupItem style={{ borderWidth: "0", height: "100%" }}>
                                                <div className="w-100 h-100 border" style={{ backgroundColor: "white" }}>
                                                    {this.state.pkds.map((pkd, index) => {
                                                        return (
                                                            <div onClick={this.removePKD} className="pkd-container hoverable-row" key={"pkd-container-" + index}>
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
                                            <textarea className="form-control" rows="5" onChange={(e) => { this.setState({ description: e.target.value }) }}></textarea>
                                        </MDBListGroupItem>
                                    </MDBRow>
                                    <MDBRow className="ml-0">
                                        <MDBListGroupItem style={{ borderWidth: "0" }}>
                                            <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                Adresy dokumentów:
                                            </MDBTypography>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem className="w-100" style={{ borderWidth: "0" }}>
                                            <input type="text"
                                                ref={this.inputRef}
                                                className="form-control"
                                                onKeyPress={this.onKeyPress}
                                                />
                                        </MDBListGroupItem>

                                        <MDBListGroupItem style={{ borderWidth: "0", height: "100px" }}>
                                            <div className="w-100 h-100 border" style={{ backgroundColor: "white" }}>
                                                {this.state.url.map((pkd, index) => {
                                                    return (
                                                        <div onClick={this.removeURL} className="pkd-container hoverable-row" key={"pkd-container-" + index}>
                                                            <div className="pkd-name">{pkd}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </MDBListGroupItem>
                                    </MDBRow>
                                </MDBListGroup>
                                <div className="w-100 d-flex pr-2" style={{ justifyContent: "end" }}>
                                    <Button variant="contained"
                                        className="mr-3 mt-3"
                                        style={{ backgroundColor: "#8B2635", fontFamily: "'Montserrat', sans-serif" }} variant="contained" disableElevation
                                        onClick={this.handleSubmit}
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
