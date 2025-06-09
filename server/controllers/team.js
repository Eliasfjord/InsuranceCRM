import Team from '../model/Team';
import User from '../model/User';

const add = async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json({ team, message: 'Team created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create team' });
    }
};

const list = async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'firstName lastName');
        res.status(200).json({ teams });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch teams' });
    }
};

const assign = async (req, res) => {
    try {
        const { teamId, userId } = req.params;
        await User.findByIdAndUpdate(userId, { team: teamId });
        await Team.findByIdAndUpdate(teamId, { $addToSet: { members: userId } });
        res.status(200).json({ message: 'User assigned to team' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to assign user' });
    }
};

export default { add, list, assign };
