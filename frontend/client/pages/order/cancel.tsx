
import { useEffect } from 'react';

export default function Cancel() {

  /** If user got to this page it means that Stripe payment failed, or user interuppted the payment process. 
   * Update order status to cancelled. */
  useEffect(() => {

  }, []);
  return (
    <div>Cancel</div>
  )
}
