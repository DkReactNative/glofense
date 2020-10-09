import { connect } from 'react-redux';
import Header from "../../components/header"
import Footer from "../../components/footer"
import React from 'react';
import AuthRoute from "../../routes/authRouter"
 
const Auth = (props) => {
   console.log("auth")
    return (
      <div className="full_container">
          <Header/>
          <div className="body_section">
          <AuthRoute />
          </div>
          <Footer />
       </div>
    );
}
 
const mapStateToProps = function(state) {
   return {
     state:state
   }
 }
 
 export default connect(mapStateToProps)(Auth);