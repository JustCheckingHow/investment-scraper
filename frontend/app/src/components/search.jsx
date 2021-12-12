import React from 'react';
import { MDBCol, MDBRow, MDBCard, MDBTypography, MDBCardBody, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { Logo, SearchBar, Tile, TilePlaceholder } from './searchUI';
import { CompanyTile } from './companyTile';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

class Search extends React.Component {
    PKD_ENDPOINT = "http://localhost:8000/pkd/";

    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            showFilters: false,
            tiles: [
            ],
            companies: [],
            companyInfo: {},
            showCompany: false,
            currentTab: 0
        };
    }

    loadTiles = (query) => {
        console.log("Loading tiles");
        console.log(query);
        fetch(`http://localhost:8000/search/${query}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                var showCompany = Object.keys(data['additional_info']).length > 0;
                console.log(data['additional_info']);
                this.setState({
                    tiles: data['search_results'],
                    companies: data['companies'],
                    companyInfo: data['additional_info'],
                    showCompany: showCompany,
                    ready: true,
                });
            });
    }

    switchTab = () => {
        var newTab = this.state.currentTab === 1 ? 0 : 1;
        this.setState({
            ...this.state,
            currentTab: newTab
        });
        console.log(this.state);
    }

    getButtons = () => {
        var inactiveStyle = { color: "#153243", borderColor: "#153243" }
        var activeStyle = { color: "white", borderColor: "#153243", backgroundColor: "#153243" }

        var buttonStyles = [inactiveStyle, inactiveStyle];
        buttonStyles[this.state.currentTab] = activeStyle;

        if (this.state.tiles.length > 0) {
            return (
                <MDBRow className="d-flex mt-3 ml-0" style={{ flexDirection: "row" }}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button onClick={this.switchTab} style={buttonStyles[0]}>Propozycje inwestycyjne</Button>
                        <Button onClick={this.switchTab} style={buttonStyles[1]}>Okazje współpracy</Button>
                    </ButtonGroup>
                </MDBRow>
            )
        }
    }


    render() {
        var source;
        var TileClass;
        if (this.state.currentTab === 0) {
            source = this.state.tiles;
            TileClass = Tile
        }
        else {
            source = this.state.companies;
            TileClass = CompanyTile
        }

        return (
            <div>
                <SearchBar PkdEndpoint={this.PKD_ENDPOINT} onSearch={this.loadTiles} />
                <div style={{ margin: "0 20%" }} >
                    {this.renderCompany()}
                    <MDBRow>
                        <MDBCol className="col-12 m-0 p-2" style={{ height: "fit-content" }} >
                            {this.getButtons()}
                            <MDBRow>
                                <TilePlaceholder ready={this.state.ready}>
                                    {
                                        source.map((tile, index) =>
                                            <TileClass key={index} tile={tile} />
                                        )
                                    }
                                </TilePlaceholder>
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                    {getInfoTiles()}
                </div>
            </div>
        );
    }

    renderCompany = () => {
        if (!this.state.showCompany)
            return null;

        return (<MDBRow className="mt-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <MDBCol>
                <MDBRow>
                    <MDBCol className="col-3 pr-2">
                        <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                            <strong>Nazwa firmy</strong>
                        </MDBTypography>
                    </MDBCol>
                    <MDBCol className="col-3">
                        <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                            {this.state.companyInfo['name']}
                        </MDBTypography>
                    </MDBCol>
                    <MDBCol className="col-3 pr-2">
                        <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "right" }}>
                            <strong>NIP</strong>
                        </MDBTypography>
                    </MDBCol>
                    <MDBCol className="col-3">
                        <MDBTypography tag="h3" variant="h3-responsive" style={{ textAlign: "left" }}>
                            {this.state.companyInfo['nip']}
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
                            {this.state.companyInfo['regon']}
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
        </MDBRow>);
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
                                    FundHub
                                </p>
                            </MDBTypography>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <MDBTypography tag="h6" variant="h6-responsive" style={{ lineHeight: "1.6", fontFamily: "'Montserrat', sans-serif" }}>
                                FundHub to innowacyjne rozwiązanie dla przedsiębiorców które w inteligentny sposób pomoże Ci odnaleźć okazje do inwestycji i dofinansowań dostosowane do Twojej firmy.
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
