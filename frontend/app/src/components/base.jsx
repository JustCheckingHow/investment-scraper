import React from "react";
import { MDBContainer } from "mdb-react-ui-kit"

class Base extends React.Component {
    render() {
        return (
            <MDBContainer className="d-flex flex-column min-vh-100 m-0 p-0" fluid>
                {this.props.children}
            </MDBContainer>
        )
    }
}

export default Base;