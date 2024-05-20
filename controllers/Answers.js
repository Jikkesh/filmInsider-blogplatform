import mongoose from 'mongoose';
import Questions from '../models/Questions.js';

export const postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Question unavailable...');
    }

    try {
        const updatedQuestion = await Questions.findByIdAndUpdate(
            _id,
            { $addToSet: { 'answers': { answerBody, userAnswered, userId } } },
            { new: true }
        );

        await updateNoOfQuestions(_id, noOfAnswers);

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error in posting answer:', error);
        res.status(400).json('Error in updating');
    }
};

const updateNoOfQuestions = async (_id, noOfAnswers) => {
    try {
        await Questions.findByIdAndUpdate(
            _id,
            { $set: { 'noOfAnswers': noOfAnswers } }
        );
    } catch (error) {
        console.error('Error in updating number of answers:', error);
    }
};

export const deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerId, noOfAnswers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Question unavailable...');
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).send('Answer unavailable...');
    }

    try {
        const updatedQuestion = await Questions.updateOne(
            { _id },
            { $pull: { 'answers': { _id: answerId } } }
        );

        await updateNoOfQuestions(_id, noOfAnswers);

        res.status(200).json({ message: "Successfully deleted answer." });
    } catch (error) {
        console.error('Error in deleting answer:', error);
        res.status(500).json('Error in deleting answer');
    }
};
