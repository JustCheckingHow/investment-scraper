import React, { Component } from 'react';
import { MDBIcon, MDBRow, MDBCol, MDBNavbar, MDBTypography } from "mdb-react-ui-kit";
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import ReactPlaceholder from "react-placeholder";
import { TextBlock, RectShape } from "react-placeholder/lib/placeholders";

const path = require('path');
const background = require("../../public/background.jpg");
const logo = require("../../public/logo.png");

export class TilePlaceholder extends Component {
    getPlaceholder() {
        return (
            <MDBRow
                className={"my-3 ml-0 mr-0 h-100 p-0 border"}
            >
                <MDBCol
                    style={{ flexDirection: "column" }}
                >
                    <TextBlock showLoadingAnimation={true} rows={3} />
                </MDBCol>
            </MDBRow>
        )
    }

    render() {
        return (
            <ReactPlaceholder ready={this.props.ready}
                showLoadingAnimation={true}
                type="media"
                rows={5}
            >
                {this.props.children}
            </ReactPlaceholder>);
    }
}

export class Tile extends React.Component {
    constructor(props) {
        super(props);
    }


    getDocumentTile(url) {
        var filename = path.basename(url).substring(0, 30).replace("-", " ").replace("_", " ");
        if (filename == 0)
            return;

        var colwidths = [6, 4, 8];
        if (filename.length > 13) {
            colwidths = [12, 2, 10];
        }

        return (
            <MDBCol className={"p-0 col-" + colwidths[0]}>
                {/* Round pill */}
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div className="rounded-pill p-1 m-2" style={{
                        backgroundColor: "rgb(237, 237, 237)",
                        textAlign: "center",
                        color: "rgb(154, 146, 146)",
                        border: "1px solid rgb(154, 146, 146)"
                    }}>
                        <MDBRow className="m-0 p-0">
                            <MDBCol className={" m-0 p-0 pl-2 d-flex col-" + colwidths[1]}>
                                <img
                                    style={{ width: "16px", height: "16px" }}
                                    className="ml-auto mr-3 my-auto"
                                    src="https://img.icons8.com/ios/50/000000/document--v1.png" />
                            </MDBCol>
                            <MDBCol className={"m-0 p-0 col-" + colwidths[2]} style={{ textAlign: "left" }}>
                                {path.basename(url).substring(0, 30)}
                            </MDBCol>
                        </MDBRow>
                    </div>
                </a>

            </MDBCol>
        );
    }

    getMoney = () => {
        if (this.props.tile.money && this.props.tile.money.length == 0)
            return null;

        return (
            <>
                <MDBRow className={"mt-3 mx-3"} style={{ textAlign: "right" }}>
                    <MDBTypography tag="h5" variant="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        <p className="mb-0 mt-2">
                            {this.props.tile.source}
                        </p>
                    </MDBTypography>
                </MDBRow>
                <MDBRow className={"mt-3 mx-3"} style={{ textAlign: "right" }}>
                    <MDBTypography tag="h5" variant="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {
                            this.props.tile.money !== "Undefined" ?
                                <p className="mb-0 mt-2" dangerouslySetInnerHTML={{ __html: "Budżet: " + this.props.tile.money }}>
                                </p> : null
                        }
                    </MDBTypography>
                </MDBRow>
                <hr />
                <MDBRow className="mr-3">
                    <MDBTypography tag="h5" variant="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif", textAlign: "end" }}>
                        <a href={this.props.tile.URL} target="_blank" rel="noopener noreferrer">
                            Przejdź do pełnego opisu
                        </a>
                    </MDBTypography>
                </MDBRow>
            </>
        )
    }

    render() {
        console.log(this.props.tile);
        return (
            <MDBRow
                className={"mt-3 ml-0 mr-0 shadow-sm h-100 p-0 border"}
                style={{ color: "black", backgroundColor: "white" }}
            >
                <MDBCol
                    className="col-8"
                    style={{ flexDirection: "column" }}
                >
                    <MDBRow className={"ml-3 mr-3"}>
                        <MDBCol className={"col-8 ml-0 pl-0 mt-3"}>
                            <MDBTypography tag="h4" variant="h4-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <b>{this.props.tile.name}</b>
                                <br />
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className={"ml-3 my-2"}>
                        <MDBCol className={"col-xl-8 ml-0 pl-0"}>
                            <MDBTypography tag="h6" variant="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <p className="text-muted mb-0" dangerouslySetInnerHTML={{ __html: this.props.tile.summary }}>
                                </p>
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
                <MDBCol className="col-4">
                    {this.getMoney()}
                    <MDBRow className="my-3">
                        {this.props.tile.documents.map((url) => {
                            return this.getDocumentTile(url);
                        })}
                    </MDBRow>
                </MDBCol>
            </MDBRow>
        );
    }
}

export class Logo extends Component {
    render() {
        return (
            <div className="logo d-flex">
                <img id="logo-img" className="mx-auto mt-auto"
                    style={{ objectFit: 'contain', width: '250px', height: '100%' }}
                    src={logo} alt="logo" />

            </div>
        );
    }
}

export class SearchBarContainer extends Component {
    render() {
        return (
            <div id="search-bar" className="search-bar w-100 d-flex" style={{
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

    hideTopBar = () => {
        document.getElementById("logo-img").style.display = "none";
        document.getElementById("search-bar").style.height = "auto";
    }

    buttonSearch = () => {
        this.props.onSearch(this.state.input);
        this.hideTopBar()
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onSearch(e.target.value);
            this.hideTopBar()
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
                        FundHub
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
                            placeholder="NIP/Regon lub PKD"
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
