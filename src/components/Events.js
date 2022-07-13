import React from 'react';
import { useState } from 'react';

 
  
 

const Events = (props) => {

  const [newVenue, setnewVenue] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();}
 
  return (
    <div className='container'>
    <div className='row'>

    {props.events.map((summer) => (
<div className='col-4'  key={summer.index}>
<div className='card'>
{console.log(summer.image)}
<img class="card-img-top" src={summer.image} alt=" img top"/>
<div className='card-body'>
<h5 className='card-title'>Theme : {summer.theme}</h5>
<p className='card-text'> Venue : {summer.venue}</p>
<h5 className='card-bottom'>Booking Price : {summer.price / 1000000000000000000} cUSD</h5>
</div>
<div>
{props.onlyOwner !== summer.owner && (
<button type="button" class="btn tip btn-outline-primary" onClick={() => props.bookEvent(summer.index)}>book Event</button>
)}

{props.onlyOwner !== summer.owner && (
<sm><button onClick={ ()=> props.interested(summer.index)} class="btn btn-outline-dark btn-b">Interested in Event</button></sm>

)}
 
{props.onlyOwner === summer.owner && (
<div><input class="form-control form-control-lg"  onChange={(e) => setnewVenue(e.target.value)} type="text" placeholder="Add new Venue"></input>
               <button class="btn btn-primary mb-2"  onClick={() => props.ChangeVenue(summer.index, newVenue)}>Change Venue</button>
               </div>
              
)}
 
 
</div>
</div>

</div>
    ))}
    </div>

    </div>
)}





export default Events;