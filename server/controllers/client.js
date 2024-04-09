import Product  from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const productWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id
                })
                return {
                    ...product._doc,
                    stat,
                }
            })
        );
        
        res.status(200).json(productWithStats);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} 

export const getCustomers = async(req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} 

export const getTransactions = async (req, res) => {
  try {
    let { page = 0, pageSize = 20, sort = '{}', search = "" } = req.query;

    // Convert page and pageSize to numbers
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);

    // Adjusting for the new sort parameter format
    sort = JSON.parse(sort);

    // Construct the sort object for mongoose
    let mongooseSort = {};
    if (sort.field && sort.sort) {
      mongooseSort[sort.field] = sort.sort === 'asc' ? 1 : -1;
    }

    // Construct query for searching
    const searchQuery = {
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    };

    // Fetch transactions with pagination, sorting (using mongooseSort), and search
    const transactions = await Transaction.find(searchQuery)
      .sort(mongooseSort)
      .skip(page * pageSize)
      .limit(pageSize);

    // Count total number of documents matching the search criteria
    const total = await Transaction.countDocuments(searchQuery);

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
