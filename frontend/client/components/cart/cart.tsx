import React from "react";
import { Products, CategoryProducts } from "../../types/category-products";

export const Cart = ({ ...props }: CategoryProducts) => {
    let { products } = props;

    return (
        <div className="cart-content" style={{ color: 'white' }}>
            <h3 style={{ textAlign: 'center' }}>Cart items</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quantity</span>
                <span>name</span>
                <span>Price</span>
            </div>
            {products.length > 0 && <div >
                {products.map((product: Products) => (
                    <div key={product.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{product.quantity}</span>
                        <span>{product.name}</span>
                        <span>{product.price}</span>
                    </div>
                ))}
            </div>}

            <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', height: '50px', width: '150px', margin: '20px auto', cursor: 'pointer' }}
                onClick={() => props.createOrder()}>Create order</div>
        </div>
    );
}