import React, {Component} from 'react'
import app from 'firebase/app';
import * as FirebaseUI from 'firebaseui';
import Firebase from '../Firebase';
import firebase from 'firebase'
import {Card, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthorization} from '../Session';
import {AuthUserContext} from '../Session';


const BookingPage = () => (
    <div>
        <AuthUserContext.Consumer>
        {authUser => <Booking value= {authUser.email}/>}
        </AuthUserContext.Consumer>
    </div>
)

class Booking extends Component {
    constructor(props){
        super(props)
        this.state = {
            bookings :[]
        }
    }
    componentDidMount() {
        //get bookings
        console.log(this.props.value)
        let email = this.props.value
        let list = []
        //var url = 'http://ec2-54-87-180-69.compute-1.amazonaws.com:5000/get_tickets?email=' + email
        let url = "http://3.215.128.213:5001/gettickets?email=" + email
        fetch(url).then(response => response.json().then(data => {
            var obj;
            for(var i = 0; i < data.Result.length; i++) {
               var obj = data.Result[i];
               list.push(obj)
               console.log(list)
       }
       this.setState({
           bookings: list
     })
     }));

    }

    render(){
        return (
            <Container>
                <h1> Bookings </h1>
                {this.state.bookings.map((item,idx) => (
                <Card>
                    <Card.Header><b>{item.Destination_name.toUpperCase()}</b></Card.Header>
                    <Card.Body>
                        <Card.Title><b>{item.City}</b></Card.Title>
                        <Card.Text>

                        <b>Ticket ID:</b> {item.Ticketid}
                        <br/>
                        <b>Ticket Price:</b> ${item.Total}
                        <br/>
                        <b>No. of Travellers:</b> {item.Passenger_number}
                        <br/>
                        <b>Source:</b> {item.Source}
                        <br/>
                        <b> Date of Travel: </b> {item.Date_travel}
                        <br/>
                        <b> Date of Booking: </b> {item.Date_booked}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )) }
                <br />
            </Container>
        )
    }
}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(BookingPage);
