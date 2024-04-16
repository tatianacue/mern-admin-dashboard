import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getDashboardStats = async ( req, res) => {
    try {
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    // Recent transactions.
    const transactions = await Transaction.find().limit(50).sort ({ createdOn: -1});

    // Overall Stats
    const OverallStat = await OverallStat.find({year: currentYear});

    const {
        totalCustomers,
        yearlyTotalSoldUnits,
        yearlySalesTotal,
        monthlyData,
        salesByCategory
    } = OverallStat[0];

    const thisMonthStats = OverallStat[0].monthlyData.find(({ month }) => {
        return month == currentMonth;
    });

    const todayStats = OverallStat[0].dailyData.find(({ date }) => {
        return month == currentMonth;
    });

    res.status(200).json({
        totalCustomers,
        yearlyTotalSoldUnits,
        yearlySalesTotal,
        monthlyData,
        salesByCategory,
        thisMonthStats,
        todayStats,
        transactions,
    });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}