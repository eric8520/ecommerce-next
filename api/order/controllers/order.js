'use strict';
const stripe = require('stripe')("sk_test_51H09wnJKtYoAeFVQ9HROT0u34kKuqg4Ub6SXEOJFpGCOacOid5z3LnWIhVV9kiW8CCJx4iZlGvKqRgcjTS15GeUH00vIiuZ2Lz");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        const { token, products, userId, addressShipping } = ctx.request.body
        let totalPayment = 0;
        products.map(product => {
            totalPayment = parseFloat(totalPayment) + parseFloat(product.price);
        })
        
        const charge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: 'eur',
            source: token.id, 
            description: `ID Usuario: ${userId}`

        })

        const createOrder = [];
        for await (const product of products){
            const data = {
                game: product.id,
                user: userId,
                totalPayment: totalPayment.toFixed(2),
                idPayment: charge.id, 
                addressShipping
            }
            /*const validData = await ctx.createStrapi.entityValidator.validateEntity(
                strapi.models.order,
                data
            )*/

            const entry = await strapi.services.order.create(data);
            createOrder.push(entry)
        }
        return createOrder;


    }
};
