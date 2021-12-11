import { Component } from 'react';
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
                    src="https://lh3.googleusercontent.com/proxy/tanfFUVIvAm98j7sKpu62RMpsM1Yq1sVj8nQNBLAYtdd8ucSmFF8PFBZ9dyMXmFQVHJGhLnJuayY2WHf314qoHSg_o4_hByxDdByzsh-XRYS6S-8GVkdX_ED76e7F6aIP_cAfMtgSh8" alt="logo" />
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
                minHeight: "50vh",
                flexDirection: "column",
                padding: "0 20%"
            }}>
                {this.props.children}
            </div>
        )
    }
}

export class SearchBar extends Component {
    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onSearch(e.target.value);
        }
    }

    render() {
        console.log(background);
        return (
            <SearchBarContainer>
                <MDBNavbar className="fixed-top shadow-0" style={{ margin: "0 20%", color: "white" }}>
                    <MDBTypography variant='h1' className="h1-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        MoneyMaker
                    </MDBTypography>
                </MDBNavbar>
                <MDBRow className="h-100" style={{ marginTop: "5%" }} >
                    <Logo />
                </MDBRow>
                <MDBRow className="h-100" style={{ marginBottom: "10%" }}>
                    <MDBCol className="d-flex w-100">
                        <OutlinedInput
                            onKeyPress={this.onKeyPress}
                            placeholder="NIP/Regon/Nazwa firmy lub kod PKD"
                            className="w-100 pr-2 my-auto"
                            style={{ backgroundColor: "white" }} />
                        <Button className="ml-3" style={{ backgroundColor: "#8B2635", fontFamily: "'Montserrat', sans-serif" }} variant="contained" color="primary" disableElevation>
                            Search
                        </Button>
                    </MDBCol>
                </MDBRow>
            </SearchBarContainer >
        );
    }
}
