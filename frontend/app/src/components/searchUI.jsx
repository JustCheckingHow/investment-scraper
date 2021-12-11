import React, { Component } from 'react';
import { MDBInput, MDBRow, MDBCol, MDBNavbar, MDBTypography } from "mdb-react-ui-kit";
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
const background = require("../../public/background.jpg");

export class Logo extends Component {
    render() {
        return (
            <div id="logo-img" className="logo d-flex">
                <img className="mx-auto mt-auto"
                    style={{ objectFit: 'contain', width: '400px', height: '100%' }}
                    src="https://static.polityka.pl/_resource/res/path/38/e6/38e656cd-7edd-4822-ab12-dea01a667133" alt="logo" />
            </div>
        );
    }
}

export class SearchBarContainer extends Component {
    render() {
        return (
            <div className="search-bar w-100 d-flex" style={{
                backgroundImage: `url(${background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: "50vh",
                flexDirection: "column",
                padding: "0 20%"
            }}>
                {this.props.children}
            </div>
        )
    }
}

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
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

    buttonSearch = () => {
        this.props.onSearch(this.state.input);
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onSearch(e.target.value);
            return;
        }

        if (e.target.value.length > 2) {
            fetch(this.props.PkdEndpoint + e.target.value)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            autocomplete: {
                                'company': [],
                                'PKD': result
                            }
                        });
                    }
                );
        }
        else {
            this.setState({
                autocomplete: {
                    'company': [],
                    'PKD': []
                }
            });
        }
    }

    onChange = (e) => {
        this.setState({
            ...this.state,
            input: e.target.value
        });
    }

    componentDidMount = () => {
        var buttonWidth = this.buttonRef.current.offsetWidth;
        var autocompleteWidth = this.autocompleteRef.current.offsetWidth;
        var width = autocompleteWidth - buttonWidth - 20;
        var height = this.searchRef.current.offsetHeight;

        this.autocompleteRef.current.style.width = `${width}px`;
        this.buttonRef.current.style.height = `${height}px`;
    }

    applyAutocomplete = (value) => {
        console.log(value.target.textContent);
    
        this.setState({
            input: value.target.textContent,
            autocomplete: {
                'company': [],
                'PKD': []
            }
        });
    }

    craftAutocomplete = () => {
        var autocomplete = this.state.autocomplete;
        var autocompleteList = [];
        for (var key in autocomplete) {
            if (autocomplete[key].length > 0) {
                autocompleteList.push(
                    <MDBRow className="w-100 mx-0 pr-0 border">
                        <MDBTypography variant="h4" className="h4-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            <b>{key}</b>
                        </MDBTypography>
                        {
                            autocomplete[key].map((item, index) => {
                                return (
                                    <MDBRow className="d-flex w-100 hoverable-row pr-0 mr-0" key={index} onClick={this.applyAutocomplete}>
                                        <MDBTypography variant="h6" className="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            {item[0]}
                                        </MDBTypography>
                                    </MDBRow>
                                )
                            })
                        }
                    </MDBRow >
                )
            }
        }
        return autocompleteList;
    }

    render() {
        console.log(background);
        return (
            <SearchBarContainer>
                <MDBNavbar className="fixed-top shadow-0" style={{ padding: "0 20%", color: "white", backgroundColor: "#08080832" }}>
                    <MDBTypography variant='h1' className="h1-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        MoneyMaker
                    </MDBTypography>
                </MDBNavbar>
                <MDBRow className="h-100" style={{ marginTop: "5%" }} >
                    <Logo />
                </MDBRow>
                <MDBRow className="h-100" style={{ marginBottom: "0%" }}>
                    <MDBCol className="d-flex w-100">
                        <OutlinedInput
                            ref={this.searchRef}
                            onKeyPress={this.onKeyPress}
                            onChange={this.onChange}
                            placeholder="NIP/Regon/Nazwa firmy lub PKD"
                            className="w-100 pr-2 my-auto"
                            value={this.state.input}
                            style={{ backgroundColor: "white" }} />
                        <Button onClick={this.buttonSearch} ref={this.buttonRef} className="ml-3 my-auto" style={{ backgroundColor: "#8B2635", fontFamily: "'Montserrat', sans-serif" }} variant="contained" color="primary" disableElevation>
                            Search
                        </Button>
                    </MDBCol>
                </MDBRow>
                <MDBRow ref={this.autocompleteRef} className="my-0 mx-1 mb-3" style={{ background: "white", overflow: "visible", zIndex: "2" }} >
                    {this.craftAutocomplete()}
                </MDBRow>
            </SearchBarContainer >
        );
    }
}
