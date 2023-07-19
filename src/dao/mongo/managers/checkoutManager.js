import checkoutModel from '../models/checkout.js';


export default class CheckoutManager {
    /*getCheckout = async (params) => {
        try {
          const populatedCheckout = await checkoutModel
            .findById(params)
            .populate('ticket')
            .lean();
      
          // Calculate the quantity for each product in the cart
          const CheckoutFinal = populatedCheckout.checkoutTicket.map((ticket) => {
            const InCart = ticket.InCart; // Use a default quantity of 1 if the quantity field is not present
            const Outstock = ticket.Outstock;
            const ticketInfo = ticket.ticket; // Rename this variable to avoid conflicts
            return {
              InCart,
              Outstock,
              ticket: ticketInfo, // Use the renamed variable here
            };
          });
      
          return CheckoutFinal; // Return the calculated data
        } catch (error) {
          throw error;
        }
      };*/
      
      
    getCheckoutById = (params) => {
        //return checkoutModel.find({ params }).populate('ticket').lean();
      return checkoutModel.findOne(params).populate('ticket').lean();
    };

}