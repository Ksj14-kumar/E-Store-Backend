const Item = require("../db/Item_Schema")
const Product_Schema = require("../db/Products.Schema")
const ProductsSchema = require("../db/Products.Schema")
class Item_Class {
    async AddItem(req, res) {
        try {
            let totalAmount = 0;
            let totalItems = 0
            const new_item = req.body // newItem==={userId:,item:{}}
            //check item already exist or not
            console.log({ new_item })
            const getItem = await Item.findOne({ userId: new_item.userId })
            console.log({ getItem })
            if (getItem && getItem.items.length === 0) {
                const newItem = {
                    ...new_item.item,
                    count: 1
                }
                getItem.items = [newItem]
                getItem.items.forEach((item) => {
                    totalAmount += ((Math.round(+item.price)) * (+item.count))
                    totalItems += (+item.count)
                })
                getItem.totalItems = totalItems
                getItem.totalAmount = totalAmount
                await getItem.save()
                return res.status(201).send("added")
            }
            if (getItem?.items.length > 0) {
                console.log("call")
                const getItemByIndex = getItem.items.findIndex(item => item.id === new_item.item.id)
                if (getItemByIndex !== -1) {
                    //update count of item  
                    const updateItem_count = {
                        ...getItem.items[getItemByIndex],
                        count: getItem.items[getItemByIndex].count + 1
                    }
                    getItem.items[getItemByIndex] = updateItem_count
                    getItem.items.forEach((item) => {
                        totalAmount += (Math.round(+item.price) * (+item.count))
                        totalItems += (+item.count)
                    })
                    getItem.totalItems = totalItems
                    getItem.totalAmount = totalAmount
                    await getItem.save()
                    return res.status(201).send("added")
                }
                else {
                    const newItemsList = [...getItem.items, { ...new_item.item, count: 1 }]
                    getItem.items = newItemsList
                    newItemsList.forEach((item) => {
                        totalAmount += (Math.round(+item.price) * (+item.count))
                        totalItems += (+item.count)
                    })
                    getItem.totalItems = totalItems
                    getItem.totalAmount = totalAmount
                    await getItem.save()
                    return res.status(201).send("added")
                }
            }
            else {
                const saveNewItem = await Item({
                    userId: new_item.userId,
                    items: [{ ...new_item.item, count: 1 }],
                    totalItems: 1,
                    totalAmount: Math.round(new_item.item.price)
                })
                await saveNewItem.save((err) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send("item not add")
                    }
                    else {
                        return res.status(201).send("added new")
                    }
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
    async DeleteItem(req, res) {
        try {
            let totalAmount = 0;
            let totalItems = 0;
            const itemId = req.params.itemId
            if (!itemId) {
                return res.status(400).send("item id not provide")
            }
            const itemForDelete = req.body //{userId:,}
            console.log(req.body)
            const getUserItems = await Item.findOne({ userId: itemForDelete.userId })
            if (getUserItems?.items.length > 0) {
                const findItemIndex = getUserItems.items.findIndex(item => item.id === +itemId)
                if (findItemIndex !== -1) {
                    if (+itemForDelete.status === 1) {
                        const __decreaseCount = {
                            ...getUserItems.items[findItemIndex],
                            count: getUserItems.items[findItemIndex].count - 1
                        }
                        getUserItems.items[findItemIndex] = __decreaseCount

                    }
                    else if (+itemForDelete.status === 2) {
                        getUserItems.items.splice(findItemIndex, 1)
                        // recalculate price,and count
                    }
                    //delete items whose having count=0
                    const deleteItemWhichHaveCount = getUserItems.items.filter(item => item.count !== 0)
                    getUserItems.items = deleteItemWhichHaveCount
                    getUserItems.items.forEach((item) => {
                        totalAmount += (Math.round(+item.price) * (+item.count))
                        totalItems += (+item.count)
                    })
                    getUserItems.totalItems = totalItems
                    getUserItems.totalAmount = totalAmount
                    await getUserItems.save()
                    return res.status(200).send("deleted")
                }
                else {
                    return res.status(400).send("item not exist in cart")
                }
            }
            else {
                return res.status(400).send("item not exist in cart")
            }

        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
    async GetAllItems(req, res) {
        try {
            const userId = req.params.userId
            if (!userId) {
                return res.status(400).send("bad request")
            }
            const list_all_items = await Item.findOne({ userId }).exec()
            console.log({ list_all_items })
            if (list_all_items?.items.length > 0) {

                return res.status(200).json({
                    items: list_all_items.items,
                    totalAmount: list_all_items.totalAmount,
                    totalItems: list_all_items.totalItems
                })
            }
            return res.status(200).send([])

        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
    async GetAllProducts(req, res) {
        try {

            const result = await Product_Schema.find().exec()
            return res.status(200).send(result)
        } catch (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    }

    async QueryItems(req, res) {
        try {
            const q = req.query.q
            console.log(q)
            const QueryProducts = await ProductsSchema.find({ $or: [{ "category": { $regex: q, '$options': 'i' } }, { "title": { $regex: q, '$options': 'i' } }] }).exec()
            res.set('Cross-Origin-Resource-Policy', 'cross-origin');
            return res.status(200).send(QueryProducts)
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}

module.exports = new Item_Class()