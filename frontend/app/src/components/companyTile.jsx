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