import Calls from "../model/Calls";
import Meetings from "../model/Meetings";
import Policy from "../model/policy";

const COMMISSION_RATE = 0.1;

const parsePremium = (val) => {
  const num = parseFloat(val);
  return Number.isNaN(num) ? 0 : num;
};

const getStats = async (startDate) => {
  const callQuery = { deleted: false };
  const meetingQuery = { deleted: false };
  const policyQuery = { deleted: false };

  if (startDate) {
    callQuery.createdOn = { $gte: startDate };
    meetingQuery.createdOn = { $gte: startDate };
    policyQuery.createdOn = { $gte: startDate };
  }

  const [callCount, meetingCount, policies] = await Promise.all([
    Calls.countDocuments(callQuery),
    Meetings.countDocuments(meetingQuery),
    Policy.find(policyQuery)
  ]);

  const commission = policies.reduce(
    (sum, p) => sum + parsePremium(p.premiumAmount),
    0
  ) * COMMISSION_RATE;

  const valuePerCall = callCount > 0 ? commission / callCount : 0;

  return {
    calls: callCount,
    meetings: meetingCount,
    sales: policies.length,
    commission,
    valuePerCall,
  };
};

const overview = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, daily, weekly, monthly] = await Promise.all([
      getStats(),
      getStats(startOfDay),
      getStats(startOfWeek),
      getStats(startOfMonth),
    ]);

    res.json({ total, daily, weekly, monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};

export default { overview };
