import React from 'react';
import { MDBCol, MDBRow, MDBCard, MDBTypography, MDBCardBody, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { Logo, SearchBar } from './searchUI';

class Tile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a href={this.props.tile.url} style={{ textDecoration: "none" }} >
                <MDBRow
                    className={"my-3 ml-0 mr-0 hover-shadow h-100 p-0 border"}
                    style={{ color: "black", backgroundColor: "white" }}
                >
                    <MDBCol
                        style={{ flexDirection: "column" }}
                    >
                        <MDBRow className={"ml-3 mr-3"}>
                            <MDBCol className={"col-8 ml-0 pl-0 mt-3"}>
                                <MDBTypography tag="h4" variant="h4-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    <b>{this.props.tile.name}</b>
                                    <br />
                                </MDBTypography>
                            </MDBCol>
                            <MDBCol className={"col-4 mt-3"} style={{ textAlign: "right" }}>
                                <MDBTypography tag="h6" variant="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    <p className="text-muted mb-0">
                                        Cośtam
                                    </p>
                                </MDBTypography>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className={"ml-3 my-2"}>
                            <MDBCol className={"col-xl-8 ml-0 pl-0"}>
                                <MDBTypography tag="h6" variant="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    <p className="text-muted mb-0">
                                        Description
                                    </p>
                                </MDBTypography>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="align-items-end flex-grow-1 ml-3 mr-3 pt-2 pb-2 border-top" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {/* {this.getInfoTiles("ProvisionCosts")} */}
                            Badge
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </a>
        );
    }
}

class Search extends React.Component {
    PKD_ENDPOINT = "http://localhost:8000/pkd/";

    constructor(props) {
        super(props);
        this.state = {
            showFilters: false,
            tiles: [
            ]
        };
    }

    loadTiles = (query) => {
        console.log("Loading tiles");
        console.log(query);
        fetch(`http://localhost:8000/search/${query}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({
                    tiles: data
                });
            });
    }

    render() {
        return (
            <div>
                <SearchBar PkdEndpoint={this.PKD_ENDPOINT} onSearch={this.loadTiles} />
                <div style={{ margin: "0 20%" }} >
                    <MDBRow className="mt-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        <MDBCol>
                            <MDBRow>
                                <MDBCol className="col-3 pr-2">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                                        <strong>Nazwa firmy</strong>
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                                        xd
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3 pr-2">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                                        <strong>NIP</strong>
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                                        NIP
                                    </MDBTypography>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol className="col-3 pr-2">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                                        <strong>REGON</strong>
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                                        3123123
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3 pr-2">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                                        <strong>NIP</strong>
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol className="col-3">
                                    <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                                        NIP
                                    </MDBTypography>
                                </MDBCol>
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow >
                        <MDBCol className="col-12 m-0 p-2" style={{ height: "fit-content" }} >
                            {
                                this.state.tiles.map((tile, index) =>
                                    <Tile key={index} tile={tile} />
                                )
                            }
                        </MDBCol>
                    </MDBRow>
                    {getInfoTiles()}
                </div>
            </div>
        );
    }
}

export default Search;

function getInfoTiles() {
    return <MDBRow className="mt-3 mb-3">
        <MDBCol className="col-6 ">
            <MDBCard className="shadow-0 border">
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol>
                            <MDBTypography tag="h2" variant="h2-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <p className="mb-0">
                                    MoneyMaker
                                </p>
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <MDBTypography tag="h6" variant="h6-responsive" style={{ lineHeight: "1.6", fontFamily: "'Montserrat', sans-serif" }}>
                                MoneyMaker to innowacyjne rozwiązanie dla przedsiębiorców które w inteligentny sposób pomoże Ci odnaleźć okazje do inwestycji i dofinansowań dostosowane do Twojej firmy.
                            </MDBTypography>
                            <MDBTypography
                                tag="h6"
                                variant="h6-responsive"
                                style={{ lineHeight: "1.6", fontFamily: "'Montserrat', sans-serif" }}>
                                Zacznij od wpisania nazwy, numeru REGON, NIPu, albo kategorii PKD w ramach której chcesz znaleźć okazje do inwestycji.
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <MDBCol className="col-6 ">
            <MDBCard className="shadow-0 border">
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol>
                            <MDBTypography tag="h2" variant="h2-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <p className="mb-0">
                                    3W
                                </p>
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <MDBTypography tag="h6" variant="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Dowiedz się więcej o inwestycjach w obszarze 3W: woda - wodór - węgiel.
                            </MDBTypography>

                            <MDBTypography tag="h6" variant="h6-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>

                                <ul>
                                    <li>
                                        <a href="https://www.bgk.pl/3w/">Co to jest?</a>
                                    </li>
                                    <li>
                                        <a href="https://300gospodarka.pl/material-partnera/woda-wodor-i-wegiel-to-strategiczne-zasoby-przyszlosci-czym-jest-idea-3w">3W jako zasoby przyszłości</a>
                                    </li>
                                    <li>
                                        <a href="https://www.izolacje.com.pl/artykul/wydarzenia/258301,3w-woda-wodor-wegiel-nowa-inicjatywa-bgk">Wspólny cel biznesu, nauki i administracji</a>
                                    </li>
                                </ul>
                            </MDBTypography>

                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
    </MDBRow>;
}
