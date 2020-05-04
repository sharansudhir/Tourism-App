import React,{Component}  from 'react';
import { withAuthorization} from '../Session';
import {Form, Button, Container, Table, Card, FormGroup, InputGroup, FormControl, Modal, Jumbotron} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ROUTES from '../../constants/routes';
import CreditCardInput from 'react-credit-card-input';
import {AuthUserContext} from '../Session';
import DateInput from "date-input";
import { useHistory } from 'react-router-dom';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose'
import { withFirebase} from '../Firebase';

const HomePage = () => (
    <div>
    <AuthUserContext.Consumer>
    {authUser => <Home value= {authUser.email}/>}
    </AuthUserContext.Consumer>
    </div>
);

class HomePageBase extends Component {
    constructor(props){
        super(props);
        this.state = {
            listofPlaces : [],
            search: true,
            details: false,
            booking: false,
            selectedCard: 0,
        }
    }

    search = (event) => {
     let temp = event.target;
     let keyword = temp.form.elements.keyword_book.value;
     let list = [];
     var url = 'http://3.215.128.213:5000/' + keyword
     fetch(url).then(response => response.json().then(data => {
         for(var i = 0; i < data.length; i++) {
            var obj = data[i];
            list.push(data[i]);
            console.log(obj)
    }
    this.setState({
      listofPlaces: list
  })
  }));
}

    redirect = (id) => {

        var url = 'http://3.215.128.213:5000/getById/' + id
        fetch(url).then(response => response.json().then(data => {
            var obj;
            for(var i = 0; i < data.length; i++) {
               var obj = data[i];
               console.log(obj.place)
               break;

       }
       this.setState({
           details: true,
           search: false,
           booking: false,
           selectedCard: obj
     })
     }));
    }

    goBack = () => {
        this.setState({
            details: false,
            search: true,
            booking: false,
        })
    }

    booking = () => {
        this.setState({
            booking: true,
            search: false
        })
    }

    confirmBooking = (event) => {
        const response =
        fetch('http://3.215.128.213:5001/ticketcreation' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                source: this.state.source,
                date_travel: this.state.Date,
                email: this.props.value,
                destination_name: this.state.selectedCard.place,
                city: this.state.selectedCard.city,
                province: this.state.selectedCard.province,
                ticket_price: this.state.selectedCard.cost,
                passenger_number: this.state.numberOfPeople,
                busid: 13
            }),
        }).then(() => this.props.history.push(ROUTES.BOOKING));
        event.preventDefault();

    }
    close = (event => {
        this.setState({
            details:true,
            booking: false
        })
    })

    handleSourceChange = (event) => {
        this.setState({
            source: event.target.value
        })
    }
    handleNumberOfPeopleChange = (event) => {
        this.setState({
            numberOfPeople: event.target.value
        })
    }
    handleDateChange = (event) => {
        this.setState({
            Date: event
        })
    }
    render() {
        var div_card = {
         display:this.state.listofPlaces.length > 0 ?'block':'none'
        };

        var details = {
            display: this.state.details ? 'block': 'none'
        }
        var search = {
            display: this.state.search ? 'block': 'none'
        }
        var booking = {
            display: this.state.booking ? 'block': 'none'
        }
        return (
            <div>
            <div style={search}>
                <Container>
                    <Jumbotron >
                        <Container>
                        <h1>Explore Destination</h1>
                        <p>
                        You can search for a destination below
                        </p>
                        </Container>
                    </Jumbotron>
                        <Form >
                            <Form.Group controlId="exampleForm.ControlInput1">

                                <Form.Control name="keyword_book" placeholder="Search for province, city, place" />
                            </Form.Group>
                            <Button variant="primary" onClick={this.search}>Search</Button>
                        </Form>
                    <hr/>
                    <div style = {div_card}>
                    {this.state.listofPlaces.map((listitem,idx) => (
                        <Card>
                            <Card.Img  height="300"  variant="top" src={listitem.image_id} />
                            <Card.Body>
                            <Card.Title>{listitem.place}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{listitem.city}</Card.Subtitle>
                                <Card.Text>

                                </Card.Text>
                                <Button variant="primary" onClick={() => this.redirect(listitem.id)}>Details</Button>
                            </Card.Body>
                        </Card>
                        ))}
                    </div>
                </Container>
            </div>
            <div style={details}>
            <Container>
                <Card>
                    <Card.Img  height="300"  variant="top" src={this.state.selectedCard.image_id} />
                    <Card.Body>
                    <Card.Title>{this.state.selectedCard.place}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.state.selectedCard.city}</Card.Subtitle>
                        <Card.Text>
                        {this.state.selectedCard.desc}
                        </Card.Text>
                        <Card.Text>
                        Price: ${this.state.selectedCard.cost}
                        </Card.Text>
                        <Button variant="primary" onClick={() => this.booking()}>Book</Button>
                        <Button className='ml-4' variant="primary" onClick={() => this.goBack()}>Go Back</Button>
                    </Card.Body>
                </Card>
            </Container>
            </div>
            <div style={booking}>
                <Container>
                <Modal.Dialog>
                <Modal.Header closeButton>
                <Modal.Title>Enter Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Enter Source City</Form.Label>
                            <Form.Control name="source" onChange={this.handleSourceChange} type="text" placeholder="Enter city" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Number of People</Form.Label>
                            <Form.Control name="numberOfPeople" type="number" onChange={this.handleNumberOfPeopleChange} placeholder="Number of People" />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Select Date of Journey</Form.Label>
                        <DateInput shouldValidate name="Date" minDate="2020-04-07" onChange={this.handleDateChange} minDateError="please enter valid date" />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Enter your Card Details</Form.Label>
                        <CreditCardInput
                        fieldClassName="input"
                        />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.close}>Close</Button>
                <Button onClick={this.confirmBooking} variant="primary">Confirm Booking</Button>
                </Modal.Footer>
                </Modal.Dialog>

            </Container>
            </div>
            </div>
        )
    }
}
const Home = compose (
  withRouter,
  withFirebase,
)(HomePageBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
