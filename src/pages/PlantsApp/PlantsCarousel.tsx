import React from 'react'
import { Link } from 'react-router-dom';

const PlantsCarousel = () => {
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px' }}>
                <div className="plants-header">
                    <h1>Plant Carousels</h1>
                    <Link to='/plants-carousel-form'>   <button className="btn btn-primary"  >
                        Add New Carousel
                    </button></Link>
                </div>

            </div>
        </React.Fragment>
    )
}

export default PlantsCarousel