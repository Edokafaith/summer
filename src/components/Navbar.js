import React from "react"
 

const Navbar = (props) => {
  return (
    <header>

    <nav className="navbar navbar-expand-md navbar-dark bg-green">

      <div className="container-fluid">

        <a className="navbar-brand" href="/#">Summer World</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">

          <span className="navbar-toggler-icon" />

        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">

          

            <button className="btn btn-outline-light ar" type="submit">Balance: {props.balance} </button>

        </div>

      </div>

    </nav>

  </header>
  );
};

export default Navbar