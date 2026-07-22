'use client'
import posthog from 'posthog-js'

const AddToCart = () => {
  return (
    <div>
        <button className='btn btn-primary'
            onClick={()=>{
              console.log("Add to cart");
              posthog.capture("add_to_cart_clicked");
            }}
        >Add to Cart
        </button>
    </div>
  )
}

export default AddToCart