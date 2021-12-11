import React from 'react';
import { MDBCol, MDBRow, MDBCard, MDBTypography, MDBCardBody, MDBListGroup, MDBListGroupItem, MDBNavbar } from "mdb-react-ui-kit";
import { SearchBarContainer } from './searchUI';
import Button from '@mui/material/Button';

class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        }
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
                <MDBRow style={{ marginTop: "30%" }}>
                    <MDBCol md="12">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBListGroup flush style={{ borderWidth: "0" }}>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Nazwa:
                                        </MDBTypography>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <input type="text" className="form-control" onChange={(e) => { this.setState({ input: e.target.value }) }} />
                                    </MDBListGroupItem>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Opis:
                                        </MDBTypography>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <textarea className="form-control" rows="5" onChange={(e) => { this.setState({ input: e.target.value }) }}></textarea>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <MDBTypography variant='h5' className="h5-responsive" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Cena:
                                        </MDBTypography>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem style={{ borderWidth: "0" }}>
                                        <input type="number" className="form-control" onChange={(e) => { this.setState({ input: e.target.value }) }} />
                                    </MDBListGroupItem>
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