import React from 'react'

import { useState } from "react";

const NewEvent = (props) => {
const [image, setImage] = useState('');
 const [theme, setTheme] = useState('');
 const [venue, setVenue] = useState('');
 const [price, setPrice] = useState(0);

 const submitHandler = (e) => {
    e.preventDefault();

    if(!image || !theme || !venue || !price) {
        alert('Please fill up the form')
        return

    }
    props.addEvent(image, theme, venue, price);
    
    setImage('')
    setTheme('')
    setVenue('')
    setPrice(0)
};

return(
    <form className='ft' onSubmit={submitHandler}>
    <div class="form-row" >
      
        <input type="text" class="form-control" value={image}
             onChange={(e) => setImage(e.target.value)} placeholder="Image"/>

<input type="text" class="form-control mt-2" value={theme}
           onChange={(e) => setTheme(e.target.value)} placeholder="Theme"/>

<input type="text" class="form-control mt-2" value={venue}
           onChange={(e) => setVenue(e.target.value)} placeholder="Venue"/>

<input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<button type="submit" class="btn btn-outline-dark">Add Event</button>

</div>
</form>
  
)
}
export default NewEvent;
   