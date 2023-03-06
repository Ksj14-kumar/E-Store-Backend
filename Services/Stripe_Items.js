module.exports = (items, totalItems) => {
    let updateItems = []
    items.forEach((item) => {
        updateItems.push({
            price_data: {
                currency: "INR",
                product_data: {
                    name: item.title,
                    description: item.description,
                    images: [item.image],
                    metadata: {
                        id: item.id
                    }
                },
                unit_amount: Math.round(item.price) * 100,
            },
            quantity: item.count,
        })
    })


    return [updateItems, [
        {
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: 'INR' },
                display_name: 'Free shipping',
                delivery_estimate: {
                    minimum: { unit: 'business_day', value: 5 },
                    maximum: { unit: 'business_day', value: 7 },
                },
            },
        },
    ]]
}