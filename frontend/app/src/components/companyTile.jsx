import { MDBInput, MDBRow, MDBCol, MDBNavbar, MDBTypography } from "mdb-react-ui-kit";
import React from "react";

export class CompanyTile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.tile);
        return (
            <a href={this.props.tile.URL} style={{ textDecoration: "none" }} >
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
                        </MDBRow>
                        <MDBRow className={"ml-3 my-2"}>

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </a>
        );
    }
}